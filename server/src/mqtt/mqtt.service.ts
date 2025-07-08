import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AppGateway } from './app.gateway';

@Injectable()
export class MqttService {
    private readonly logger = new Logger(MqttService.name);
    private pendingDeletions = new Map<number, {
        resolve: (value: any) => void;
        reject: (reason: any) => void;
        timeoutId: NodeJS.Timeout;
    }>();

    constructor(
        private readonly prisma: PrismaService,
        private readonly appGateway: AppGateway
    ) { }

    @Client({
        transport: Transport.MQTT,
        options: {
            url: 'mqtt://localhost:1883',
            clientId: 'smashminton-mqtt-client',
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
        },
    })
    private client: ClientProxy;

    async onModuleInit() {
        await this.client.connect();
        this.logger.log('MQTT client connected successfully');
    }

    async onModuleDestroy() {
        await this.client.close();
        this.logger.log('MQTT client disconnected');
    }

    /*
     * Send command to ESP8266 device
     */
    async sendCommand(deviceId: string, action: string, data?: any): Promise<void> {
        const command = {
            action,
            requestId: this.generateRequestId(),
            timestamp: Date.now(),
            ...data,
        };

        const topic = `smashminton/device/${deviceId}/command`;

        try {
            this.client.emit(topic, command);
            this.logger.log(`Command sent to ${deviceId}: ${action}`);
        } catch (error) {
            this.logger.error(`Failed to send command to ${deviceId}:`, error);
            throw error;
        }
    }

    /*
     * Send ping to ESP8266
     */
    async pingDevice(deviceId: string): Promise<void> {
        await this.sendCommand(deviceId, 'ping');
    }

    /*
     * Get device status
     */
    async getDeviceStatus(deviceId: string): Promise<void> {
        await this.sendCommand(deviceId, 'get_status');
    }

    /*
     * Reset device
     */
    async resetDevice(deviceId: string): Promise<void> {
        await this.sendCommand(deviceId, 'reset');
    }

    /*
     * Subscribe to device responses
     */
    subscribeToDeviceResponses(deviceId: string) {
        const topic = `smashminton/device/${deviceId}/response`;
        return this.client.send(topic, {});
    }

    /*
     * Subscribe to device status
     */
    subscribeToDeviceStatus(deviceId: string) {
        const topic = `smashminton/device/${deviceId}/status`;
        return this.client.send(topic, {});
    }

    /*
     * Subscribe to device heartbeat
     */
    subscribeToDeviceHeartbeat(deviceId: string) {
        const topic = `smashminton/device/${deviceId}/heartbeat`;
        return this.client.send(topic, {});
    }

    private generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    }

    async getNextAvailableFingerprintId() {
        try {
            const enrolledFingerprints = await this.prisma.employees.findMany({
                where: {
                    fingerprintid: {
                        not: null
                    }
                },
                orderBy: {
                    fingerprintid: 'asc'
                },
                select: {
                    fingerprintid: true
                }
            })

            if (enrolledFingerprints.length === 0) {
                this.logger.log('No fingerprints enrolled yet, starting from ID 1');
                return 1;
            }

            let availableFingerprintId = 1;
            let lastFingerprintId = 0
            for (const fingerprint of enrolledFingerprints) {
                const currentFingerprintId = fingerprint.fingerprintid!;
                if (currentFingerprintId != lastFingerprintId + 1) {
                    availableFingerprintId = lastFingerprintId + 1;
                    this.logger.log(`📍 Found gap: Next available fingerprint ID is ${availableFingerprintId}`);
                    return availableFingerprintId;
                } else {
                    lastFingerprintId = currentFingerprintId;
                }
            }

            const nextAvailableId = lastFingerprintId + 1;
            this.logger.log(`➡️ No gaps found, next fingerprint ID is ${nextAvailableId}`);
            return nextAvailableId;
        } catch (error) {
            this.logger.error('Failed to get next available fingerprint ID:', error);
            throw error;
        }
    }

    async handleEnrollFingerprint(deviceId: string, employeeID: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { employeeid: employeeID },
            });

            if (!employee) {
                throw new Error(`Employee with ID ${employeeID} not found`);
            }

            if (employee.fingerprintid) {
                this.logger.warn(`Employee ${employeeID} already has a fingerprint enrolled`);
                this.logger.warn(`Going to delete existing fingerprint before enrolling a new one`);
                await this.handleDeleteFingerprintAndWaitForConfirmation(deviceId, employeeID);
            }

            // Get next available fingerprint ID
            const nextFingerprintId = await this.getNextAvailableFingerprintId();

            // Send command to ESP8266 to start enrollment
            this.appGateway.enrollmentStarted(employeeID, nextFingerprintId);
            await this.sendCommand(deviceId, 'enroll_finger', {
                employeeID: employeeID,
                fingerID: nextFingerprintId,
            });

            return {
                success: true,
                message: `Enrollment started for employee ${employeeID}`,
                employeeID: employeeID,
                fingerprintID: nextFingerprintId
            };
        } catch (error) {
            this.logger.error(`❌ Failed to handle enroll fingerprint for employee ${employeeID}:`, error);
            throw error;
        }
    }

    async enrollEmployeeFingerprint(employeeID: number, fingerprintID: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { employeeid: employeeID },
            });

            if (!employee) {
                throw new Error(`Employee with ID ${employeeID} not found`);
            }

            await this.prisma.employees.update({
                where: { employeeid: employeeID },
                data: {
                    fingerprintid: fingerprintID
                }
            });

            this.logger.log(`✅ Fingerprint ${fingerprintID} has been registered for employee ${employeeID}`);
            return { success: true, message: `Fingerprint registered successfully` };
        } catch (error) {
            this.logger.error(`❌ Failed to register fingerprint for employee ${employeeID}:`, error);
            throw error;
        }
    }

    async deleteDeviceFingerprint(deviceId: string, fingerprintID: number) {
        try {
            await this.sendCommand(deviceId, 'delete_finger', {
                fingerID: fingerprintID,
            });

            this.logger.log(`🔄 Fingerprint deletion command sent for ID ${fingerprintID} on device ${deviceId}`);
            return { success: true, message: `Fingerprint deletion command sent for ID ${fingerprintID}` };
        } catch (error) {
            this.logger.error(`❌ Failed to delete fingerprint ${fingerprintID} on device ${deviceId}:`, error);
            throw error;
        }
    }

    async handleDeleteFingerprint(deviceId: string, employeeID: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { employeeid: employeeID },
            });

            if (!employee) {
                throw new Error(`Employee with ID ${employeeID} not found`);
            }

            if (!employee.fingerprintid) {
                this.logger.warn(`No fingerprint found for employee ${employeeID}`);
                return { success: false, message: `No fingerprint to delete for employee ${employeeID}` };
            }

            const fingerprintID = employee.fingerprintid;

            // Send command to ESP8266
            await this.sendCommand(deviceId, 'delete_finger', {
                fingerID: fingerprintID,
                employeeID: employeeID,
            });
            
            this.logger.log(`🔄 Fingerprint deletion command sent for employee ${employeeID}`);

            return {
                success: true,
                message: `Fingerprint deletion command sent for employee ${employeeID}`,
                fingerprintID: fingerprintID
            }
        } catch (error) {
            this.logger.error(`❌ Failed to handle delete fingerprint for employee ${employeeID}:`, error);
            throw error;
        }
    }

    async handleDeleteFingerprintAndWaitForConfirmation(deviceId: string, employeeID: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const employee = await this.prisma.employees.findUnique({
                    where: { employeeid: employeeID },
                });

                if (!employee) {
                    reject(new Error(`Employee with ID ${employeeID} not found`));
                    return;
                }

                if (!employee.fingerprintid) {
                    this.logger.warn(`No fingerprint found for employee ${employeeID}`);
                    resolve({ success: false, message: `No fingerprint to delete for employee ${employeeID}` });
                    return;
                }

                // Set up timeout (10 seconds)
                const timeoutId = setTimeout(() => {
                    this.pendingDeletions.delete(employeeID);
                    reject(new Error(`Device ${deviceId} deletion timeout for employee ${employeeID}`));
                }, 10000);

                // Store the promise resolver
                this.pendingDeletions.set(employeeID, { resolve, reject, timeoutId });

                // Send delete command
                const fingerprintID = employee.fingerprintid;
                await this.sendCommand(deviceId, 'delete_finger', {
                    fingerID: fingerprintID,
                    employeeID: employeeID,
                });

                this.logger.log(`🔄 Waiting for device ${deviceId} confirmation for employee ${employeeID} deletion...`);

            } catch (error) {
                reject(error);
            }
        });
    }

    async deleteEmployeeFingerprint(employeeID: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { employeeid: employeeID },
            });

            if (!employee) {
                throw new Error(`Employee with ID ${employeeID} not found`);
            }

            await this.prisma.employees.update({
                where: { employeeid: employeeID },
                data: {
                    fingerprintid: null
                }
            });

            this.logger.log(`✅ Fingerprint has been deleted for employee ${employeeID}`);
            return { success: true, message: `Fingerprint deleted successfully` };
        } catch (error) {
            this.logger.error(`❌ Failed to delete fingerprint for employee ${employeeID}:`, error);
            throw error;
        }
    }

    async handleEsp8266DeletionConfirmation(employeeID: number, success: boolean, message?: string): Promise<boolean> {
        const pending = this.pendingDeletions.get(employeeID);
        if (!pending) {
            this.logger.warn(`No pending deletion found for employee ${employeeID}`);
            return false; // No pending deletion found
        }

        // Clear timeout and remove from pending
        clearTimeout(pending.timeoutId);
        this.pendingDeletions.delete(employeeID);

        if (success) {
            try {
                await this.deleteEmployeeFingerprint(employeeID);
                this.logger.log(`✅ Fingerprint deletion confirmed and database updated for employee ${employeeID}`);
                pending.resolve({ success: true, message: 'Fingerprint deleted successfully' });
            } catch (error) {
                this.logger.error(`❌ Database update failed after ESP8266 deletion for employee ${employeeID}:`, error);
                pending.reject(error);
            }
        } else {
            this.logger.error(`❌ ESP8266 deletion failed for employee ${employeeID}: ${message}`);
            pending.reject(new Error(`ESP8266 deletion failed: ${message}`));
        }

        return true;
    }

    stringTimeToMinutes(timeString: string): number {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    async getEmployeeAssignments(employeeID: number, shiftdate: Date) {
        try {
            const assignments = await this.prisma.shift_assignment.findMany({
                where: {
                    employeeid: employeeID,
                    shiftdate: shiftdate,
                },
                include: {
                    shift_date: {
                        include: {
                            shift: true
                        }
                    },
                    timesheet: true
                },
                orderBy: {
                    shiftid: 'asc'
                }
            });

            return assignments;
        } catch (error) {
            this.logger.error(`❌ Failed to get assignments for employee ${employeeID} on ${shiftdate.toLocaleDateString("vi-VN")}:`, error);
            throw error;
        }
    }

    async getEmployeeNearAssignments(assignments: any[], scanTime: Date, timeBuffer: number = 30) {
        let nearAssignment: any[] = [];
        for (const assignment of assignments) {
            const shiftStartMinutes = this.stringTimeToMinutes(assignment.shift_date?.shift?.shiftstarthour);
            const shiftEndMinutes = this.stringTimeToMinutes(assignment.shift_date?.shift?.shiftendhour);
            const scanTimeMinutes = scanTime.getHours() * 60 + scanTime.getMinutes();

            // Trong khoảng thời gian có thể check-in/check-out
            const isWithinTimeBuffer = scanTimeMinutes >= shiftStartMinutes - timeBuffer &&
                scanTimeMinutes <= shiftEndMinutes;

            if (!isWithinTimeBuffer) {
                continue;
            }

            const hasNoTimesheet = !assignment.timesheet?.length;

            if (hasNoTimesheet) {
                nearAssignment.push(assignment);
            } else if (assignment.timesheet.length > 0) {
                const timesheet = assignment.timesheet[0];
                if (timesheet.checkin_time && !timesheet.checkout_time) {
                    nearAssignment.push(assignment);
                }
            }
        }
        return nearAssignment;
    }

    async addEmployeeLatePenaltyRecord(employeeID: number, lateTime: Date) {
        const lateRule = await this.prisma.penalty_rules.findFirst({
            where: {
                penaltyname: 'Late for work',
            },
        });

        if (lateRule) {
            const currentMonthStart = new Date(lateTime.getFullYear(), lateTime.getMonth(), 1);
            currentMonthStart.setHours(0, 0, 0, 0);
            const currentMonthEnd = new Date(lateTime.getFullYear(), lateTime.getMonth() + 1, 0);
            currentMonthEnd.setHours(23, 59, 59, 999);
            const currentMonthLateCount = await this.prisma.penalty_records.count({
                where: {
                    penaltyruleid: lateRule.penaltyruleid,
                    employeeid: employeeID,
                    violationdate: {
                        gte: currentMonthStart,
                        lte: currentMonthEnd
                    }
                },
            });
            let finalPenaltyAmount: number | null = null;
            if (lateRule.basepenalty !== null && lateRule.incrementalpenalty !== null && lateRule.maxiumpenalty !== null) {
                const basePenalty = Number(lateRule.basepenalty);
                const incrementalPenalty = Number(lateRule.incrementalpenalty);
                const maxPenalty = Number(lateRule.maxiumpenalty);

                // + 1 Cho lần vi phạm hiện tại
                const totalLateCount = currentMonthLateCount + 1;

                if (totalLateCount === 1) {
                    finalPenaltyAmount = basePenalty;
                } else {
                    // - 1 để bớt đi lần tính base penalty
                    const tmp = basePenalty + incrementalPenalty * (totalLateCount - 1);
                    // Giới hạn không vượt quá max penalty
                    finalPenaltyAmount = tmp > maxPenalty ? maxPenalty : tmp;
                }

                await this.prisma.penalty_records.create({
                    data: {
                        penaltyruleid: lateRule.penaltyruleid,
                        employeeid: employeeID,
                        violationdate: lateTime,
                        finalpenaltyamount: finalPenaltyAmount
                    }
                });
            }
        }
    }

    async handleFingerprintScan(deviceId: string, fingerprintID: number, scanTime: Date) {
        try {
            const currentDate = new Date(scanTime);
            // Chỉnh về thời gian đầu ngày
            currentDate.setHours(0, 0, 0, 0);

            // Lấy nhân viên theo fingerprint ID
            const employee = await this.prisma.employees.findUnique({
                where: { fingerprintid: fingerprintID },
                include: { accounts: true }
            });

            if (!employee) {
                this.logger.error(`❌ Employee with fingerprint ID ${fingerprintID} not found`);
                return {
                    success: false,
                    error: `Employee with fingerprint ID ${fingerprintID} not found`,
                    action: 'none'
                };
            }

            this.logger.log(`👤 Employee found: ${employee.employeeid} (${employee.accounts?.fullname || 'Unknown'}), Type: ${employee.employee_type}`);

            // Lấy các ca làm việc được phân công cho nhân viên này trong ngày hiện tại
            const assignments = await this.getEmployeeAssignments(employee.employeeid, currentDate);

            if (assignments.length === 0) {
                this.logger.warn(`⚠️  No assignments found for employee ${employee.employeeid} on ${scanTime.toLocaleDateString("vi-VN")}`);
                return {
                    success: false,
                    error: `No shift assignments found for today`,
                    action: 'none',
                    employeeId: employee.employeeid
                };
            }

            // Hàm check đi trễ hơn giờ bắt đầu ca (timeBuffer mặc định = 15 phút)
            const isLate = (shiftStart: string, checkin: Date, timeBuffer: number = 15) => {
                const [h, m] = shiftStart.split(":").map(Number);
                const shiftStartDate = new Date(checkin);
                shiftStartDate.setHours(h, m + timeBuffer, 0, 0);
                return checkin > shiftStartDate;
            };

            const isTooLate = (shiftStart: string, checkin: Date, timeBuffer: number = 120) => {
                const [h, m] = shiftStart.split(":").map(Number);
                const shiftStartDate = new Date(checkin);
                shiftStartDate.setHours(h, m + timeBuffer, 0, 0);
                return checkin > shiftStartDate;
            }

            // Trường hợp nhân viên là nhân viên toàn thời gian
            if (employee.employee_type?.toLowerCase() === "full-time") {
                // Chỉ có tối đa 1 ca làm việc trong ngày
                if (assignments.length > 1) {
                    this.logger.error(`❌ Multiple assignments found for full-time employee ${employee.employeeid}`);
                    return {
                        success: false,
                        error: `Full-time employee cannot have multiple shifts per day`,
                        action: 'none',
                        employeeId: employee.employeeid
                    };
                }

                const assignment = assignments[0];

                // Kiểm tra bảng chấm công 
                const existingTimesheet = await this.prisma.timesheet.findUnique({
                    where: {
                        employeeid_shiftid_shiftdate: {
                            employeeid: assignment.employeeid,
                            shiftid: assignment.shiftid,
                            shiftdate: assignment.shiftdate,
                        }
                    }
                });

                if (!existingTimesheet) {
                    const late = assignment.shift_date?.shift?.shiftstarthour ? isLate(assignment.shift_date.shift.shiftstarthour, scanTime) : false;
                    const tooLate = assignment.shift_date?.shift?.shiftstarthour ? isTooLate(assignment.shift_date.shift.shiftstarthour, scanTime) : false;
                    
                    if (late && !tooLate) {
                        // Nếu đi trễ thì ghi lại vi phạm
                        await this.addEmployeeLatePenaltyRecord(assignment.employeeid, scanTime);
                    }

                    if (tooLate) {
                        this.logger.warn(`⚠️  Full-time Employee ${employee.employeeid} is too late to check in at ${scanTime.toLocaleTimeString("vi-VN")}`);

                        await this.prisma.timesheet.upsert({
                            where: {
                                employeeid_shiftid_shiftdate: {
                                    employeeid: assignment.employeeid,
                                    shiftid: assignment.shiftid,
                                    shiftdate: assignment.shiftdate,
                                }
                            },
                            update: {},
                            create: {
                                employeeid: assignment.employeeid,
                                shiftid: assignment.shiftid,
                                shiftdate: assignment.shiftdate,
                            }
                        });

                        return {
                            success: false,
                            error: `Employee ${employee.employeeid} checks in too late`,
                            action: 'none',
                            employeeId: employee.employeeid,
                            employeeName: employee.accounts?.fullname || 'Unknown',
                            shiftId: assignment.shiftid,
                            time: scanTime,
                            tooLate: true,
                        };
                    }

                    // Nếu chưa có bảng chấm công thì tạo mới và ghi giờ chấm công vào
                    await this.prisma.timesheet.upsert({
                        where: {
                            employeeid_shiftid_shiftdate: {
                                employeeid: assignment.employeeid,
                                shiftid: assignment.shiftid,
                                shiftdate: assignment.shiftdate,
                            }
                        },
                        update: {},
                        create: {
                            employeeid: assignment.employeeid,
                            shiftid: assignment.shiftid,
                            shiftdate: assignment.shiftdate,
                            checkin_time: scanTime
                        }
                    });

                    this.logger.log(`🟢 Check-in recorded for full-time employee ${employee.employeeid} at ${scanTime.toLocaleTimeString("vi-VN")}${late ? ' (LATE)' : ''}`);
                    return {
                        success: true,
                        action: 'check_in',
                        employeeId: employee.employeeid,
                        employeeName: employee.accounts?.fullname || 'Unknown',
                        shiftId: assignment.shiftid,
                        time: scanTime,
                        late: late,
                        message: late ? `Check-in successful (LATE)` : `Check-in successful`
                    };
                } else if (existingTimesheet.checkin_time && !existingTimesheet.checkout_time) {
                    // Nếu đã có bảng chấm công và đã check-in nhưng chưa check-out thì ghi giờ chấm công ra
                    await this.prisma.timesheet.update({
                        where: {
                            employeeid_shiftid_shiftdate: {
                                employeeid: assignment.employeeid,
                                shiftid: assignment.shiftid,
                                shiftdate: assignment.shiftdate,
                            }
                        },
                        data: {
                            checkout_time: scanTime
                        }
                    });

                    this.logger.log(`🔵 Check-out recorded for full-time employee ${employee.employeeid} at ${scanTime.toLocaleTimeString("vi-VN")}`);
                    return {
                        success: true,
                        action: 'check_out',
                        employeeId: employee.employeeid,
                        employeeName: employee.accounts?.fullname || 'Unknown',
                        shiftId: assignment.shiftid,
                        time: scanTime,
                        message: `Check-out successful`
                    };
                } 
            }
            // Trường hợp nhân viên là nhân viên bán thời gian
            else if (employee.employee_type?.toLowerCase() === "part-time") {
                const nearAssignment = await this.getEmployeeNearAssignments(assignments, scanTime);

                if (nearAssignment.length === 0) {
                    this.logger.warn(`⚠️  No current assignments found for employee ${employee.employeeid} to check in/out at this time (${scanTime.toLocaleTimeString("vi-VN")})`);
                    return {
                        success: false,
                        error: `No current shift assignments found to check in/out at this time`,
                        action: 'none',
                        employeeId: employee.employeeid
                    };
                }

                // Lấy ca làm việc đầu tiên trong danh sách có thể chấm công
                const nextAssignment = nearAssignment[0];
                const existingTimesheet = nextAssignment.timesheet?.[0];

                if (!existingTimesheet) {
                    const late = nextAssignment.shift_date?.shift?.shiftstarthour ? isLate(nextAssignment.shift_date.shift.shiftstarthour, scanTime) : false;
                    const tooLate = nextAssignment.shift_date?.shift?.shiftstarthour ? isTooLate(nextAssignment.shift_date.shift.shiftstarthour, scanTime) : false;

                    if (late && !tooLate) {
                        // Nếu đi trễ thì ghi lại vi phạm
                        await this.addEmployeeLatePenaltyRecord(nextAssignment.employeeid, scanTime);
                    }

                    if (tooLate) {
                        this.logger.warn(`⚠️  Part-time Employee ${employee.employeeid} is too late to check in Shift ${nextAssignment.shiftid} at ${scanTime.toLocaleTimeString("vi-VN")}`);

                        await this.prisma.timesheet.upsert({
                            where: {
                                employeeid_shiftid_shiftdate: {
                                    employeeid: nextAssignment.employeeid,
                                    shiftid: nextAssignment.shiftid,
                                    shiftdate: nextAssignment.shiftdate,
                                }
                            },
                            update: {},
                            create: {
                                employeeid: nextAssignment.employeeid,
                                shiftid: nextAssignment.shiftid,
                                shiftdate: nextAssignment.shiftdate,
                            }
                        });

                        return {
                            success: false,
                            error: `Employee ${employee.employeeid} checks in too late`,
                            action: 'none',
                            employeeId: employee.employeeid,
                            employeeName: employee.accounts?.fullname || 'Unknown',
                            shiftId: nextAssignment.shiftid,
                            time: scanTime,
                            tooLate: true,
                        };
                    }

                    // Nếu chưa có bảng chấm công thì tạo mới và ghi giờ chấm công vào
                    await this.prisma.timesheet.upsert({
                        where: {
                            employeeid_shiftid_shiftdate: {
                                employeeid: nextAssignment.employeeid,
                                shiftid: nextAssignment.shiftid,
                                shiftdate: nextAssignment.shiftdate,
                            }
                        },
                        update: {},
                        create: {
                            employeeid: nextAssignment.employeeid,
                            shiftid: nextAssignment.shiftid,
                            shiftdate: nextAssignment.shiftdate,
                            checkin_time: scanTime
                        }
                    });

                    this.logger.log(`🟢 Check-in recorded for part-time employee ${employee.employeeid} (Shift ${nextAssignment.shiftid}) at ${scanTime.toLocaleTimeString("vi-VN")}${late ? ' (LATE)' : ''}`);
                    return {
                        success: true,
                        action: 'check_in',
                        employeeId: employee.employeeid,
                        employeeName: employee.accounts?.fullname || 'Unknown',
                        shiftId: nextAssignment.shiftid,
                        time: scanTime,
                        late: late,
                        message: late ? `Check-in successful (LATE) for Shift ${nextAssignment.shiftid}` : `Check-in successful for Shift ${nextAssignment.shiftid}`
                    };
                } else if (existingTimesheet.checkin_time && !existingTimesheet.checkout_time) {
                    // Nếu đã có bảng chấm công và đã check-in nhưng chưa check-out thì ghi giờ chấm công ra
                    await this.prisma.timesheet.update({
                        where: {
                            employeeid_shiftid_shiftdate: {
                                employeeid: nextAssignment.employeeid,
                                shiftid: nextAssignment.shiftid,
                                shiftdate: nextAssignment.shiftdate,
                            }
                        },
                        data: {
                            checkout_time: scanTime,
                            updatedat: new Date()
                        }
                    });

                    this.logger.log(`🔵 Check-out recorded for part-time employee ${employee.employeeid} (Shift ${nextAssignment.shiftid}) at ${scanTime.toLocaleTimeString("vi-VN")}`);
                    return {
                        success: true,
                        action: 'check_out',
                        employeeId: employee.employeeid,
                        employeeName: employee.accounts?.fullname || 'Unknown',
                        shiftId: nextAssignment.shiftid,
                        time: scanTime,
                        message: `Check-out successful for Shift ${nextAssignment.shiftid}`
                    };
                } else {
                    // Trường hợp đã có bảng chấm công và đã check-out, thông báo và không cập nhật lại
                    this.logger.warn(`⚠️  Part-time employee ${employee.employeeid} has already completed attendance for to day current shift (Shift ${nextAssignment.shiftid})`);
                    return {
                        success: false,
                        error: `Already checked out for today (Shift ${nextAssignment.shiftid})`,
                        action: 'none',
                        employeeId: employee.employeeid,
                        employeeName: employee.accounts?.fullname || 'Unknown',
                        checkInTime: existingTimesheet.checkin_time,
                        checkOutTime: existingTimesheet.checkout_time
                    };
                }
            }
            // Trường hợp nhân viên có loại khác "full-time" hoặc "part-time"
            else {
                this.logger.error(`❌ Unknown employee type: ${employee.employee_type} for employee ${employee.employeeid}`);
                return {
                    success: false,
                    error: `Unknown employee type: ${employee.employee_type}`,
                    action: 'none',
                    employeeId: employee.employeeid,
                    employeeName: employee.accounts?.fullname || 'Unknown'
                };
            }
        } catch (error) {
            this.logger.error(`❌ Failed to handle fingerprint scan for device ${deviceId} and fingerprint ID ${fingerprintID}:`, error);
            return {
                success: false,
                error: error.message || 'Internal server error during fingerprint scan',
                action: 'none'
            };
        }
    }
}
