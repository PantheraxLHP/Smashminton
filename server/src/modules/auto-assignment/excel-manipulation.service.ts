import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { UpdateAutoAssignmentDto } from './dto/update-auto-assignment.dto';
import { AutoAssignmentRule, SingleRowRule } from './dto/auto-assignment-rule.dto';

@Injectable()
export class ExcelSearcher {
    private workbook: ExcelJS.Workbook;

    constructor(workbook: ExcelJS.Workbook) {
        this.workbook = workbook;
    }

    // Search for exact cell value
    findCellByValue(searchValue: any, worksheetName?: string): Array<{ worksheet: string, address: string, value: any }> {
        const results: Array<{ worksheet: string, address: string, value: any }> = [];
        const worksheets = worksheetName
            ? [this.workbook.getWorksheet(worksheetName)]
            : this.workbook.worksheets;

        worksheets.forEach(worksheet => {
            if (!worksheet) return;

            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell, colNumber) => {
                    if (cell.value === searchValue) {
                        results.push({
                            worksheet: worksheet.name,
                            address: cell.address,
                            value: cell.value
                        });
                    }
                });
            });
        });

        return results;
    }

    // Search for text containing substring (case-insensitive)
    findCellsContaining(searchText: string, worksheetName?: string): Array<{ worksheet: string, address: string, value: any }> {
        const results: Array<{ worksheet: string, address: string, value: any }> = [];
        const searchLower = searchText.toLowerCase();
        const worksheets = worksheetName
            ? [this.workbook.getWorksheet(worksheetName)]
            : this.workbook.worksheets;

        worksheets.forEach(worksheet => {
            if (!worksheet) return;

            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell, colNumber) => {
                    const cellValue = cell.value?.toString().toLowerCase() || '';
                    if (cellValue.includes(searchLower)) {
                        results.push({
                            worksheet: worksheet.name,
                            address: cell.address,
                            value: cell.value
                        });
                    }
                });
            });
        });

        return results;
    }

    // Search using regex pattern
    findCellsByPattern(pattern: RegExp, worksheetName?: string): Array<{ worksheet: string, address: string, value: any, matches: RegExpMatchArray | null }> {
        const results: Array<{ worksheet: string, address: string, value: any, matches: RegExpMatchArray | null }> = [];
        const worksheets = worksheetName
            ? [this.workbook.getWorksheet(worksheetName)]
            : this.workbook.worksheets;

        worksheets.forEach(worksheet => {
            if (!worksheet) return;

            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell, colNumber) => {
                    const cellValue = cell.value?.toString() || '';
                    const matches = cellValue.match(pattern);
                    if (matches) {
                        results.push({
                            worksheet: worksheet.name,
                            address: cell.address,
                            value: cell.value,
                            matches: matches
                        });
                    }
                });
            });
        });

        return results;
    }
    // Find cells in specific range
    findInRange(range: string, searchValue: any, worksheetName?: string): Array<{ worksheet: string, address: string, value: any }> {
        const results: Array<{ worksheet: string, address: string, value: any }> = [];
        const worksheet = worksheetName
            ? this.workbook.getWorksheet(worksheetName)
            : this.workbook.worksheets[0];

        if (!worksheet) return results;

        // Parse range manually (e.g., "A1:C10")
        const [startCell, endCell] = range.split(':');
        const startCol = startCell.match(/[A-Z]+/)?.[0] || 'A';
        const startRow = parseInt(startCell.match(/\d+/)?.[0] || '1');
        const endCol = endCell.match(/[A-Z]+/)?.[0] || 'A';
        const endRow = parseInt(endCell.match(/\d+/)?.[0] || '1');

        // Convert column letters to numbers
        const colToNum = (col: string) => {
            let result = 0;
            for (let i = 0; i < col.length; i++) {
                result = result * 26 + (col.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
            }
            return result;
        };

        const startColNum = colToNum(startCol);
        const endColNum = colToNum(endCol);

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startColNum; col <= endColNum; col++) {
                const cell = worksheet.getCell(row, col);
                if (cell.value === searchValue) {
                    results.push({
                        worksheet: worksheet.name,
                        address: cell.address,
                        value: cell.value
                    });
                }
            }
        }

        return results;
    }

    // Find all cells in a specific column
    findInColumn(columnLetter: string, searchValue: any, worksheetName?: string): Array<{ worksheet: string, address: string, value: any, row: number }> {
        const results: Array<{ worksheet: string, address: string, value: any, row: number }> = [];
        const worksheet = worksheetName
            ? this.workbook.getWorksheet(worksheetName)
            : this.workbook.worksheets[0];

        if (!worksheet) return results;

        const column = worksheet.getColumn(columnLetter);
        column.eachCell((cell, rowNumber) => {
            if (cell.value === searchValue) {
                results.push({
                    worksheet: worksheet.name,
                    address: cell.address,
                    value: cell.value,
                    row: rowNumber
                });
            }
        });

        return results;
    }

    // Find all cells in a specific row
    findInRow(rowNumber: number, searchValue: any, worksheetName?: string): Array<{ worksheet: string, address: string, value: any, column: number }> {
        const results: Array<{ worksheet: string, address: string, value: any, column: number }> = [];
        const worksheet = worksheetName
            ? this.workbook.getWorksheet(worksheetName)
            : this.workbook.worksheets[0];

        if (!worksheet) return results;

        const row = worksheet.getRow(rowNumber);
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchValue) {
                results.push({
                    worksheet: worksheet.name,
                    address: cell.address,
                    value: cell.value,
                    column: colNumber
                });
            }
        });

        return results;
    }
}

@Injectable()
export class ExcelManipulationService {
    async deleteRuleTableRows(sheetName: string, filePath: string) {
        try {
            console.log('⚠️  IMPORTANT: Make sure the Excel file is CLOSED before running this!');

            console.log(`\n🗑️ Delete Rule Table Rows - Sheet: ${sheetName}\n`);

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const searcher = new ExcelSearcher(workbook);

            //Search for any rule table containing exclude Sort...
            const ruleTables = searcher.findCellsByPattern(new RegExp('RuleTable (?!Sort)\\w+', 'i'), sheetName);

            if (ruleTables.length === 0) {
                console.log(`❌ No RuleTable declarations found.`);
                console.log('Available worksheets:');
                workbook.worksheets.forEach(ws => console.log(`   - ${ws.name}`));
                return;
            }

            console.log(`✅ Found ${ruleTables.length} RuleTable(s):`);
            for (const result of ruleTables) {
                console.log(`   "${result.value}" at ${result.address} - Worksheet: ${result.worksheet}`);
            }

            const worksheet = workbook.getWorksheet(sheetName);
            if (!worksheet) {
                console.log(`❌ Worksheet "${sheetName}" not found!`);
                console.log('Available worksheets:');
                workbook.worksheets.forEach(ws => console.log(`   - ${ws.name}`));
                return;
            }

            console.log(`📊 Before deletion: ${worksheet.rowCount} rows x ${worksheet.columnCount} columns`);

            // Parse and sort rule tables by row number (highest first to preserve indices)
            const sortedRuleTables = ruleTables
                .map(rule => {
                    const rowMatch = rule.address.match(/\d+/);
                    return {
                        ...rule,
                        rowNumber: rowMatch ? parseInt(rowMatch[0]) : 0
                    };
                })
                .sort((a, b) => b.rowNumber - a.rowNumber); // Sort descending (highest row first)


            let totalDeletedRows = 0;

            // Process each rule table (starting from bottom)
            for (const rule of sortedRuleTables) {
                const ruleTableRow = rule.rowNumber;
                const startDeleteRow = ruleTableRow + 5; // Skip 5 rows after rule table

                console.log(`\n🎯 Processing rule table at row ${ruleTableRow}`);
                console.log(`   Starting deletion check from row ${startDeleteRow}`);

                // Find the end of the data block (first blank row)
                let endDeleteRow = startDeleteRow;
                let foundBlankRow = false;

                // Look for the first completely blank row to determine deletion range
                while (endDeleteRow <= worksheet.rowCount && !foundBlankRow) {
                    const row = worksheet.getRow(endDeleteRow);
                    let hasData = false;

                    // Check if row has any non-empty cells
                    row.eachCell({ includeEmpty: false }, (cell) => {
                        if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
                            hasData = true;
                            return;
                        }
                    });

                    if (!hasData) {
                        foundBlankRow = true;
                        console.log(`   Found blank row at ${endDeleteRow}`);
                    } else {
                        endDeleteRow++;
                    }
                }

                // Calculate how many rows to delete
                const rowsToDelete = foundBlankRow ? endDeleteRow - startDeleteRow : 0;

                if (rowsToDelete > 0) {
                    console.log(`   Deleting ${rowsToDelete} rows (${startDeleteRow} to ${endDeleteRow - 1})`);

                    const deletedData: any[] = [];
                    for (let i = startDeleteRow; i < endDeleteRow; i++) {
                        const row = worksheet.getRow(i);
                        const rowData: any[] = [];
                        row.eachCell({ includeEmpty: true }, (cell) => {
                            rowData.push(cell.value);
                        });
                        deletedData.push({
                            rowNumber: i,
                            data: rowData
                        });
                    }

                    console.log(`   Backed up ${deletedData.length} rows of data`);

                    // Delete rows using spliceRows (removes multiple rows at once)
                    worksheet.spliceRows(startDeleteRow, rowsToDelete);
                    totalDeletedRows += rowsToDelete;

                    console.log(`   ✅ Successfully deleted ${rowsToDelete} rows`);

                    console.log('   Deleted data preview:');
                    deletedData.slice(0, 5).forEach((item, index) => {
                        const nonEmptyData = item.data.filter((val: any) => val !== null && val !== undefined && val !== '');
                        if (nonEmptyData.length > 0) {
                            console.log(`     Row ${item.rowNumber}: [${nonEmptyData.slice(0, 10).join(', ')}]${nonEmptyData.length > 5 ? '...' : ''}`);
                        }
                    });
                    if (deletedData.length > 5) {
                        console.log(`     ... and ${deletedData.length - 5} more rows`);
                    }
                } else {
                    console.log(`   No data rows found to delete for this rule table`);
                }
            }

            console.log(`\n📊 After deletion: ${worksheet.rowCount} rows x ${worksheet.columnCount} columns`);
            console.log(`🗑️ Total rows deleted: ${totalDeletedRows}`);

            if (totalDeletedRows > 0) {
                // CRITICAL: Save the file to make changes persistent!
                await workbook.xlsx.writeFile(filePath);
                console.log(`💾 File saved as: ${filePath}`);
                console.log('✅ SUCCESS: Rule table data rows have been deleted!');
            } else {
                console.log('ℹ️ No changes made to the file (no data rows found to delete)');
            }

            return {
                filePath: filePath,
                deletedRows: totalDeletedRows,
                processedRuleTables: sortedRuleTables.length
            };

        } catch (error) {
            console.error('❌ Delete operation failed:', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    async deleteRuleTableRowsWithBackup(sheetName: string, filePath: string) {
        try {

            // Create backup first
            const backupPath = `${filePath.replace('.drl.xlsx', '')}_backup_${Date.now()}.drl.xlsx`;
            await fs.promises.copyFile(filePath, backupPath);
            console.log(`📋 Created backup: ${backupPath}`);

            // Perform the deletion
            const result = await this.deleteRuleTableRows(sheetName, filePath);

            console.log(`\n💾 Backup available at: ${backupPath}`);
            console.log('🔄 To restore, rename the backup file to replace the original');

            return {
                ...result,
                backupPath: backupPath
            };

        } catch (error) {
            console.error('❌ Safe delete operation failed:', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    async insertRuleTableData(sheetName: string, filePath: string, ruleTableData: UpdateAutoAssignmentDto) {
        try {
            console.log('⚠️  IMPORTANT: Make sure the Excel file is CLOSED before running this!');

            console.log(`\n📥 Insert Rule Table Data - Sheet: ${sheetName}\n`);

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const searcher = new ExcelSearcher(workbook);
            const worksheet = workbook.getWorksheet(sheetName);

            if (!worksheet) {
                console.log(`❌ Worksheet "${sheetName}" not found!`);
                console.log('Available worksheets:');
                workbook.worksheets.forEach(ws => console.log(`   - ${ws.name}`));
                return;
            }

            console.log(`📊 Before insertion: ${worksheet.rowCount} rows x ${worksheet.columnCount} columns`);

            let totalInsertedRows = 0;
            for (const data of ruleTableData.data) {
                let ruleTable: any[] = [];
                switch ((data.type).toLowerCase()) {
                    case 'shift':
                        ruleTable = searcher.findCellsContaining('RuleTable AssignableShifts', sheetName);
                        data.cols.push("");
                        data.cols.push("ShiftRule");
                        break;
                    case 'enrollmentshift':
                        ruleTable = searcher.findCellsContaining('RuleTable AssignableEnrollmentShifts', sheetName);
                        data.cols.push("");
                        data.cols.push("EnrollmentShiftRule");
                        break;
                    case 'employee':
                        ruleTable = searcher.findCellsContaining('RuleTable EligibleEmployees', sheetName);
                        data.cols.splice(2, 0, ["-", "-"]);
                        data.cols.push("");
                        data.cols.push("EmployeeRule");
                        break;
                    case 'enrollmentemployee':
                        ruleTable = searcher.findCellsContaining('RuleTable EligibleEnrollmentEmployees', sheetName);
                        data.cols.splice(2, 0, ["-", "-"]);
                        data.cols.push("");
                        data.cols.push("EnrollmentEmployeeRule");
                        break;
                    default:
                        console.log(`❌ Unknown rule type "${data.type}"`);
                        continue;
                }

                if (ruleTable.length === 0) {
                    console.log(`❌ No RuleTable found for type "${data.type}"`);
                    continue;
                }

                console.log(`✅ Found ${ruleTable.length} RuleTable(s) for type "${data.type}":`);
                ruleTable = ruleTable
                    .map(rule => {
                        const rowMatch = rule.address.match(/\d+/);
                        return {
                            ...rule,
                            rowNumber: rowMatch ? parseInt(rowMatch[0]) : 0
                        };
                    })

                const startRow = ruleTable[0].rowNumber;
                const startRowInsert = startRow + 5;
                worksheet.insertRow(startRowInsert, data.cols);
                totalInsertedRows++;
            }

            console.log(`📊 After insertion: ${worksheet.rowCount} rows x ${worksheet.columnCount} columns`);
            console.log(`📥 Total rows inserted: ${totalInsertedRows}`);

            if (totalInsertedRows > 0) {
                // CRITICAL: Save the file to make changes persistent!
                await workbook.xlsx.writeFile(filePath);
                console.log(`💾 File saved as: ${filePath}`);
                console.log('✅ SUCCESS: Rule table data has been inserted!');
            } else {
                console.log('ℹ️ No changes made to the file (no data rows inserted)');
            }

            return {
                filePath: filePath,
                insertedRows: totalInsertedRows,
            }

        } catch (error) {
            console.error('❌ Insert operation failed:', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    getRuleType = (ruleTableName: string): string => {
        switch (ruleTableName.toLowerCase()) {
            case 'ruletable assignableshifts':
                return 'shift';
            case 'ruletable assignableenrollmentshifts':
                return 'enrollmentShift';
            case 'ruletable eligibleemployees':
                return 'employee';
            case 'ruletable eligibleenrollmentemployees':
                return 'enrollmentEmployee';
            default:
                return 'unknownType';
        }
    }

    async getRuleTableData(sheetName: string, filePath: string): Promise<AutoAssignmentRule | null> {
        try {
            console.log(`\n📊 Get Rule Table Data - Sheet: ${sheetName}\n`);
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const searcher = new ExcelSearcher(workbook);
            const worksheet = workbook.getWorksheet(sheetName);

            //Search for any rule table containing exclude Sort...
            const ruleTables = searcher.findCellsByPattern(new RegExp('RuleTable (?!Sort)\\w+', 'i'), sheetName);

            if (ruleTables.length === 0) {
                console.log(`❌ No RuleTable declarations found.`);
                console.log('Available worksheets:');
                workbook.worksheets.forEach(ws => console.log(`   - ${ws.name}`));
                return null;
            }

            console.log(`✅ Found ${ruleTables.length} RuleTable(s):`);
            for (const result of ruleTables) {
                console.log(`   "${result.value}" at ${result.address} - Worksheet: ${result.worksheet}`);
            }

            if (!worksheet) {
                console.log(`❌ Worksheet "${sheetName}" not found!`);
                console.log('Available worksheets:');
                workbook.worksheets.forEach(ws => console.log(`   - ${ws.name}`));
                return null;
            }

            const ruleTableData: AutoAssignmentRule = {
                data: []
            };

            for (const rule of ruleTables) {
                const rowMatch = rule.address.match(/\d+/);
                const ruleTableRow = rowMatch ? parseInt(rowMatch[0]) : 0;
                const metadataRow = worksheet.getRow(ruleTableRow + 4);
                const conditions: string[] = [];
                const actions: string[] = [];
                const subObj: string[] = [];

                if (metadataRow) {
                    metadataRow.eachCell((cell, colNumber) => {
                        const cellValue = cell.value?.toString().trim() || '';
                        if (cellValue.startsWith('sub:')) {
                            subObj.push(cellValue.slice(4).trim());
                        } else if (cellValue.startsWith('condition:')) {
                            conditions.push(cellValue.slice(10).trim());
                        } else if (cellValue.startsWith('action:')) {
                            actions.push(cellValue.slice(7).trim());
                        }
                    });
                }

                const boundaries = {
                    subObj: 2 + subObj.length,
                    conditions: 2 + subObj.length + conditions.length,
                    actions: 2 + subObj.length + conditions.length + actions.length
                }

                const startRowRead = ruleTableRow + 5;

                console.log(`🎯 Processing rule table at row ${ruleTableRow}`);
                console.log(`   Starting data extraction from row ${startRowRead}`);

                let endRowRead = startRowRead;
                let foundBlankRow = false;
                while (endRowRead <= worksheet.rowCount && !foundBlankRow) {
                    const row = worksheet.getRow(endRowRead);
                    let hasData = false;

                    row.eachCell({ includeEmpty: false }, (cell) => {
                        if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
                            hasData = true;
                            return;
                        }
                    });

                    if (!hasData) {
                        foundBlankRow = true;
                        console.log(`   Found blank row at ${endRowRead}`);
                    } else {
                        endRowRead++;
                    }
                }

                const rowsToRead = foundBlankRow ? endRowRead - startRowRead : worksheet.rowCount - startRowRead;

                if (rowsToRead > 0) {
                    console.log(`   Reading ${rowsToRead} rows (${startRowRead} to ${endRowRead - 1})`);

                    for (let i = startRowRead; i < endRowRead; i++) {
                        const row = worksheet.getRow(i);
                        const rowData: SingleRowRule = {
                            ruleName: '',
                            ruleType: this.getRuleType(rule.value?.toString().trim() || ''),
                            ruleDescription: '',
                            subObj: [],
                            conditions: [],
                            actions: []
                        };

                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                            const cellValue = cell.value?.toString().trim() || '';

                            if (colNumber === 1) {
                                rowData.ruleDescription = cellValue;
                            } else if (colNumber === 2) {
                                rowData.ruleName = cellValue;
                            } else if (colNumber > 2 && colNumber <= boundaries.subObj) {
                                const subObjIndex = colNumber - 3;
                                rowData.subObj.push({
                                    subObjName: subObj[subObjIndex] || '',
                                    subObjValue: cellValue
                                });
                            } else if (colNumber > boundaries.subObj && colNumber <= boundaries.conditions) {
                                const conditionIndex = colNumber - (boundaries.subObj + 1);
                                rowData.conditions.push({
                                    conditionName: conditions[conditionIndex] || '',
                                    conditionValue: cellValue
                                });
                            } else if (colNumber > boundaries.conditions && colNumber <= boundaries.actions) {
                                const actionIndex = colNumber - (boundaries.conditions + 1);
                                rowData.actions.push({
                                    actionName: actions[actionIndex] || '',
                                    actionValue: cellValue
                                });

                            } else {
                                return; // Skip any additional columns
                            }
                        });

                        ruleTableData.data.push(rowData);
                    }

                    console.log(`   Extracted ${ruleTableData.data.length} rows of data`);
                }
            }

            if (ruleTableData.data.length === 0) {
                console.log('ℹ️ No data rows found in the rule tables');
                return null;
            } else {
                console.log('✅ SUCCESS: Rule table data has been extracted!');
                console.log(`\n📊 Total Rule Table Data extracted: ${ruleTableData.data.length} rows`);
                return ruleTableData;
            }
        } catch (error) {
            console.error('❌ Get Rule Table Data operation failed:', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
}