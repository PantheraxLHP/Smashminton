import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { FingerprintGateway } from './fingerprint.gateway';

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
        private readonly fingerprintGateway: FingerprintGateway
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
                this.logger.error(`Employee with ID ${employeeID} not found`);
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
            this.fingerprintGateway.enrollmentStarted(employeeID, nextFingerprintId);
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
                this.logger.error(`Employee with ID ${employeeID} not found`);
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

    async handleDeleteFingerprint(deviceId: string, employeeID: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { employeeid: employeeID },
            });

            if (!employee) {
                this.logger.error(`Employee with ID ${employeeID} not found`);
                throw new Error(`Employee with ID ${employeeID} not found`);
            }

            if (!employee.fingerprintid) {
                this.logger.warn(`No fingerprint found for employee ${employeeID}`);
                return { success: true, message: `No fingerprint to delete for employee ${employeeID}` };
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
                    resolve({ success: true, message: `No fingerprint to delete for employee ${employeeID}` });
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
                this.logger.error(`Employee with ID ${employeeID} not found`);
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
                // Update database after ESP8266 confirms deletion
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

        return true; // Had pending deletion
    }

    async timeTracking(fingerprintID: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { fingerprintid: fingerprintID },
            });

            if (!employee) {
                this.logger.error(`❌ Employee with fingerprint ID ${fingerprintID} not found`);
                throw new Error(`Employee with fingerprint ID ${fingerprintID} not found`);
            }

            await this.updateTimeSheet(employee.employeeid);
        } catch (error) {
            this.logger.error(`❌ Failed to track time for fingerprint ID ${fingerprintID}:`, error);
            throw error;
        }
    }

    async updateTimeSheet(employeeID: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { employeeid: employeeID },
            });

            if (!employee) {
                this.logger.error(`Employee with ID ${employeeID} not found`);
                throw new Error(`Employee with ID ${employeeID} not found`);
            }

            const currentTime = new Date();
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            // Check if timesheet exists for today
            const existingTimesheet = await this.prisma.timesheet.findUnique({
                where: {
                    employeeid_timesheetdate: {
                        employeeid: employeeID,
                        timesheetdate: currentDate
                    }
                }
            });

            if (existingTimesheet) {
                // Employee already clocked in today - update end time
                await this.prisma.timesheet.update({
                    where: { timesheetid: existingTimesheet.timesheetid },
                    data: {
                        endhour: currentTime, // Update end time
                    }
                });

                this.logger.log(`⏰ Clock-out recorded for employee ${employeeID} at ${currentTime.toISOString()}`);
                return { action: 'clock-out', time: currentTime };

            } else {
                // First time today - create new timesheet (clock-in)
                const newTimesheet = await this.prisma.timesheet.create({
                    data: {
                        employeeid: employeeID,
                        timesheetdate: currentDate,
                        starthour: currentTime,
                        endhour: null,
                    }
                });

                this.logger.log(`🟢 Clock-in recorded for employee ${employeeID} at ${currentTime.toISOString()}`);
                return { action: 'clock-in', time: currentTime };
            }

        } catch (error) {
            this.logger.error(`❌ Failed to update timesheet for employee ${employeeID}:`, error);
            throw error;
        }
    }
}
