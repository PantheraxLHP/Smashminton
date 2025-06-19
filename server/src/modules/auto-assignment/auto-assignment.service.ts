import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExcelManipulationService } from './excel-manipulation.service';
import { UpdateAutoAssignmentDto } from './dto/update-auto-assignment.dto';
import * as path from 'path';

@Injectable()
export class AutoAssignmentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly excelManipulationService: ExcelManipulationService
    ) { }

    async autoAssignParttimeShifts(sortOption: number) {
        try {
            const response = await fetch(`${process.env.DROOLS}/api/auto-assignment/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sortOption: sortOption,
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                return {
                    message: `Failed to assign part-time shifts: ${errorText}`,
                    status: response.status,
                    success: false
                };
            }

            console.log("Part-time shifts assigned successfully");

            const responseData = await response.json();
            return {
                message: "Auto assignment for part-time shifts completed successfully.",
                status: response.status,
                success: true,
                data: responseData
            };

        } catch (error) {
            console.error("Error while assigning part-time shifts:", error);
            return {
                message: `Error while assigning part-time shifts: ${error.message}`,
                status: 500,
                success: false
            };
        }
    }

    async autoAssignFulltimeShifts(assignmentStrategy: string, maxEmpPerShift: number = 1) {
        try {
            if (maxEmpPerShift <= 0) {
                throw new Error("Max employees per fulltime shift must be greater than 0");
            }

            // Lấy danh sách nhân viên full-time trừ Admin (employeeid = 1)
            const fullTimeEmployees = await this.prisma.employees.findMany({
                where: {
                    employee_type: "Full-time",
                    employeeid: {
                        not: 1
                    }
                },
            });

            const nextWeekStart = new Date();
            const currentDay = nextWeekStart.getDay();
            const dayToMonday = currentDay === 0 ? 1 : 8 - currentDay;
            nextWeekStart.setDate(nextWeekStart.getDate() + dayToMonday);
            nextWeekStart.setHours(0, 0, 0, 0);

            const nextWeekEnd = new Date();
            nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
            nextWeekEnd.setHours(23, 59, 59, 999);

            const nextWeekFullimeAssignments = await this.prisma.shift_assignment.findMany({
                where: {
                    shiftdate: {
                        gte: nextWeekStart,
                        lte: nextWeekEnd,
                    },
                    shift_date: {
                        shift: {
                            shifttype: "Full-time",
                        },
                    }
                },
                orderBy: [
                    { shiftdate: "asc" },
                    { shiftid: "asc" },
                ],
            });

            if (nextWeekFullimeAssignments.length > 0) {
                return {
                    message: "There are already assignments for full-time shifts in the next week.",
                    status: 200,
                    success: true
                };
            }

            const nextWeekShifts = await this.prisma.shift_date.findMany({
                where: {
                    shiftdate: {
                        gte: nextWeekStart,
                        lte: nextWeekEnd,
                    },
                    shift: {
                        shifttype: "Full-time",
                    },
                },
                include: {
                    shift: true,
                },
                orderBy: [
                    { shiftdate: "asc" },
                    { shiftid: "asc" },
                ],
            });

            if (fullTimeEmployees.length === 0) {
                throw new Error("No full-time employees found");
            }

            if (nextWeekShifts.length === 0) {
                throw new Error("No shifts to be assigned for the next week");
            }

            switch (assignmentStrategy) {
                case "same":
                    // Phân công ca làm việc theo chiến lược "same"
                    await this.assignSameShift(nextWeekStart);
                    break;
                case "random":
                    // Phân công ca làm việc theo chiến lược "random"
                    await this.assignRandomShift(nextWeekShifts, fullTimeEmployees, maxEmpPerShift);
                    break;
                case "rotate":
                    // Phân công ca làm việc theo chiến lược "rotate"
                    await this.assignRotateShift(nextWeekShifts, fullTimeEmployees, maxEmpPerShift);
                    break;
                default:
                    throw new Error("Invalid assignment strategy. Use 'same', 'rotate', or 'random'.");
            }

            return {
                message: `Auto assignment for full-time shifts with strategy "${assignmentStrategy.toUpperCase()}" completed successfully.`,
                status: 200,
                success: true
            };

        } catch (error) {
            console.error("Error while assigning fulltime shift:", error);
            return {
                message: `Error while assigning full-time shifts: ${error.message}`,
                status: 500,
                success: false
            };
        }
    }

    async assignSameShift(nextWeekStart) {
        const assignments: any[] = [];
        const currentWeekStart = new Date();
        currentWeekStart.setDate(nextWeekStart.getDate() - 7);
        currentWeekStart.setHours(0, 0, 0, 0);
        const currentWeekEnd = new Date();
        currentWeekEnd.setDate(nextWeekStart.getDate() - 1);
        currentWeekEnd.setHours(23, 59, 59, 999);
        try {
            // Lấy phân công của tuần trước
            const currentWeekAssignments = await this.prisma.shift_assignment.findMany({
                where: {
                    shiftdate: {
                        gte: currentWeekStart,
                        lte: currentWeekEnd,
                    },
                    shift_date: {
                        shift: {
                            shifttype: "Full-time",
                        },
                    }
                },
                orderBy: [
                    { shiftdate: "asc" },
                    { shiftid: "asc" },
                ],
            });

            if (currentWeekAssignments.length === 0) {
                throw new Error("No assignments found for the last week.");
            }

            // Phân công ca làm việc cho tuần tới dựa trên ca làm việc của tuần trước
            for (const assignment of currentWeekAssignments) {
                const nextWeekShiftDate = new Date();
                nextWeekShiftDate.setDate(assignment.shiftdate.getDate() + 7);
                assignments.push({
                    employeeid: assignment.employeeid,
                    shiftid: assignment.shiftid,
                    shiftdate: nextWeekShiftDate,
                    assignmentstatus: "confirmed",
                })
            }

            if (assignments.length === 0) {
                throw new Error("No assignments for the next week, check last week shift assignment, something went wrong.");
            }

            await this.prisma.shift_assignment.createMany({
                data: assignments,
            });
            console.log("Next week assignments assigned \"SAME\" have been created successfully.");

        } catch (error) {
            console.error("Error in assignSameShift:", error);
            throw error; // Re-throw to be caught by the calling function
        }
    }

    async assignRandomShift(nextWeekShifts, fullTimeEmployees, maxEmpPerShift: number) {
        const assignments: any[] = [];
        try {
            const assignedShifts = new Map<number, number>();
            for (const employee of fullTimeEmployees) {
                assignedShifts.set(employee.employeeid, 0);
            }
            const shuffleArray = <T>(array: T[]) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };

            const sortEmployeesByAssignedShifts = (employees: any[]) => {
                return employees.sort((a, b) => {
                    const assignedA = assignedShifts.get(a.employeeid) || 0;
                    const assignedB = assignedShifts.get(b.employeeid) || 0;
                    return assignedA - assignedB;
                });
            }

            const shuffledShifts: any[] = shuffleArray(nextWeekShifts);
            for (const shift of shuffledShifts) {
                const sortedEmployees = sortEmployeesByAssignedShifts(fullTimeEmployees);
                let count = 0;
                for (const employee of sortedEmployees) {
                    if (count >= maxEmpPerShift) {
                        break;
                    }

                    if (
                        !assignments.some(
                            a => a.employeeid === employee.employeeid &&
                                a.shiftid === shift.shiftid &&
                                a.shiftdate.toISOString() === shift.shiftdate.toISOString()
                        )
                    ) {
                        assignments.push({
                            employeeid: employee.employeeid,
                            shiftid: shift.shiftid,
                            shiftdate: shift.shiftdate,
                            assignmentstatus: "confirmed",
                        });
                        assignedShifts.set(employee.employeeid, (assignedShifts.get(employee.employeeid) || 0) + 1);
                        count++;
                    } else {
                        continue;
                    }
                }
            }

            if (assignments.length === 0) {
                throw new Error("No assignments for the next week, something went wrong.");
            }

            await this.prisma.shift_assignment.createMany({
                data: assignments,
            });
            console.log("Next week assignments assigned \"RANDOM\" have been created successfully.");

        } catch (error) {
            console.error("Error in assignRandomShift:", error);
            throw error; // Re-throw to be caught by the calling function
        }
    }

    async assignRotateShift(nextWeekShifts, fullTimeEmployees, maxEmpPerShift: number) {
        const assignments: any[] = [];

        try {
            // Xác định loại buổi làm việc cho từng nhân viên
            // Morning chỉ được phân ca sáng
            // Evening chỉ được phân ca chiều
            // Mix có thể phân ca sáng hoặc chiều
            // Xoay tua qua các loại buổi làm việc: 
            // "Morning" --> "Evening"
            // "Evening" --> "Mix"
            // "Mix" --> "Morning"
            const initialShiftTypes = ["Morning", "Evening", "Mix"];
            let initialShiftIndex = 0;

            const preferredShiftType = new Map<number, string>();

            fullTimeEmployees.forEach((employees) => {
                if (employees.last_week_shift_type) {
                    const preferredShiftIndex = (initialShiftTypes.indexOf(employees.last_week_shift_type) + 1) % initialShiftTypes.length;
                    preferredShiftType.set(employees.employeeid, initialShiftTypes[preferredShiftIndex]);
                } else {
                    preferredShiftType.set(employees.employeeid, initialShiftTypes[initialShiftIndex]);
                    initialShiftIndex = (initialShiftIndex + 1) % initialShiftTypes.length;
                }
            });

            const shuffleArray = <T>(array: T[]) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };

            // Sắp xếp ngẫu nhiên danh sách ca làm việc
            const morningShifts: any[] = shuffleArray(nextWeekShifts.filter((shift) => shift.shiftid === 1));
            const eveningShifts: any[] = shuffleArray(nextWeekShifts.filter((shift) => shift.shiftid === 2));

            // Phân loại nhân viên theo loại ca làm việc
            const morningEmployees = Array.from(preferredShiftType.entries()).filter(([_, value]) => value === "Morning");
            const eveningEmployees = Array.from(preferredShiftType.entries()).filter(([_, value]) => value === "Evening");
            const mixEmployees = Array.from(preferredShiftType.entries()).filter(([_, value]) => value === "Mix");

            // Phân công ca sáng cho nhân viên Morning và Mix
            let count = 0;
            for (const shift of morningShifts) {
                let assignmentCount = 0;
                while (assignmentCount < maxEmpPerShift) {
                    if (count < 5) {
                        for (const [empId, _] of morningEmployees) {
                            assignments.push({
                                employeeid: empId,
                                shiftid: shift.shiftid,
                                shiftdate: shift.shiftdate,
                                assignmentstatus: "confirmed",
                            });
                            assignmentCount++;
                            if (assignmentCount >= maxEmpPerShift)
                                break;
                        }
                    }
                    else {
                        for (const [empId, _] of mixEmployees) {
                            assignments.push({
                                employeeid: empId,
                                shiftid: shift.shiftid,
                                shiftdate: shift.shiftdate,
                                assignmentstatus: "confirmed",
                            });
                            assignmentCount++;
                            if (assignmentCount >= maxEmpPerShift)
                                break;
                        }
                    }
                    count++;
                }
            }


            // Phân công ca chiều cho nhân viên Evening và Mix
            count = 0;
            for (const shift of eveningShifts) {
                let assignmentCount = 0;
                while (assignmentCount < maxEmpPerShift) {
                    if (count < 5) {
                        for (const [empId, _] of eveningEmployees) {
                            assignments.push({
                                employeeid: empId,
                                shiftid: shift.shiftid,
                                shiftdate: shift.shiftdate,
                                assignmentstatus: "confirmed",
                            });
                            assignmentCount++;
                            if (assignmentCount >= maxEmpPerShift)
                                break;
                        }
                    }
                    else {
                        for (const [empId, _] of mixEmployees) {
                            assignments.push({
                                employeeid: empId,
                                shiftid: shift.shiftid,
                                shiftdate: shift.shiftdate,
                                assignmentstatus: "confirmed",
                            });
                            assignmentCount++;
                            if (assignmentCount >= maxEmpPerShift)
                                break;
                        }
                    }
                    count++;
                }
            } if (assignments.length === 0) {
                throw new Error("No assignments for the next week, check last week shift type, something went wrong.");
            }

            await this.prisma.shift_assignment.createMany({
                data: assignments,
            });

            // Cập nhật loại ca làm việc cho từng nhân viên
            for (const [employeeId, shiftType] of preferredShiftType) {
                await this.prisma.employees.update({
                    where: { employeeid: employeeId },
                    data: { last_week_shift_type: shiftType },
                });
            }

            console.log("Next week assignments assigned \"ROTATE\" have been created successfully.");

        } catch (error) {
            console.error("Error in assignRotateShift:", error);
            throw error; // Re-throw to be caught by the calling function
        }
    }

    async updateAutoAssignmentSettings(updateAutoAssignmentDto: UpdateAutoAssignmentDto) {
        if (!updateAutoAssignmentDto.data) {
            throw new Error("Invalid input data. 'data' are required.");
        }

        const basePath = "droolsServer/src/main/resources/dtables/";
        const fileName = "drools_decisiontable.drl.xlsx";
        const filePath = path.join(__dirname, "../../../../../", basePath, fileName);

        const deleteResult = await this.excelManipulationService.deleteRuleTableRowsWithBackup("DroolsRules", filePath);

        if (!deleteResult || deleteResult.deletedRows === undefined) {
            throw new Error("Failed to delete rule table rows or no rows deleted.");
        }

        const insertResult = await this.excelManipulationService.insertRuleTableData("DroolsRules", filePath, updateAutoAssignmentDto);

        if (!insertResult || insertResult.insertedRows === undefined) {
            throw new Error("Failed to insert rule table data or no rows inserted.");
        }

        return {
            deleteResult,
            insertResult
        };
    }

    async getAutoAssignmentSettings() {
        const basePath = "droolsServer/src/main/resources/dtables/";
        const fileName = "drools_decisiontable.drl.xlsx";
        const filePath = path.join(__dirname, "../../../../../", basePath, fileName);

        const ruleTableData = await this.excelManipulationService.getRuleTableData("DroolsRules", filePath);

        if (!ruleTableData) {
            throw new Error("No auto assignment settings found.");
        }

        return ruleTableData;
    }

    async updateNextWeekEnrollment() {
        // Xác định tuần sau dựa vào ngày hiện tại
        const today = new Date();
        const currentDay = today.getDay();
        const dayToMonday = currentDay === 0 ? 1 : 8 - currentDay;
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() + dayToMonday);
        nextWeekStart.setUTCHours(0, 0, 0, 0);
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 7);
        nextWeekEnd.setUTCHours(0, 0, 0, 0);

        // Lấy tất cả shift_assignment tuần sau
        const assignments = await this.prisma.shift_assignment.findMany({
            where: {
                shiftdate: { gte: nextWeekStart, lt: nextWeekEnd }
            },
            select: { employeeid: true, shiftid: true, shiftdate: true }
        });

        if (assignments.length === 0) {
            return { updated: 0, message: 'No shift_assignment found for next week.' };
        }
        let totalUpdated = 0;
        for (const a of assignments) {
            const updated = await this.prisma.shift_enrollment.updateMany({
                where: {
                    employeeid: a.employeeid,
                    shiftid: a.shiftid,
                    shiftdate: a.shiftdate
                },
                data: { enrollmentstatus: 'assigned' }
            });
            totalUpdated += updated.count;
        }
        if (totalUpdated === 0) {
            return { updated: 0, message: 'No shift_enrollment found to update.' };
        }
        return { updated: totalUpdated };
    }
}