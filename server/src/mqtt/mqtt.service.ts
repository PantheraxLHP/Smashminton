import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class MqttService {
    private readonly logger = new Logger(MqttService.name);

    constructor(
        private readonly prisma: PrismaService
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

    /**
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

    /**
     * Send ping to ESP8266
     */
    async pingDevice(deviceId: string): Promise<void> {
        await this.sendCommand(deviceId, 'ping');
    }

    /**
     * Get device status
     */
    async getDeviceStatus(deviceId: string): Promise<void> {
        await this.sendCommand(deviceId, 'get_status');
    }    /**
     * Reset device
     */
    async resetDevice(deviceId: string): Promise<void> {
        await this.sendCommand(deviceId, 'reset');
    }

    /**
     * Subscribe to device responses
     */
    subscribeToDeviceResponses(deviceId: string) {
        const topic = `smashminton/device/${deviceId}/response`;
        return this.client.send(topic, {});
    }

    /**
     * Subscribe to device status
     */
    subscribeToDeviceStatus(deviceId: string) {
        const topic = `smashminton/device/${deviceId}/status`;
        return this.client.send(topic, {});
    }

    /**
     * Subscribe to device heartbeat
     */
    subscribeToDeviceHeartbeat(deviceId: string) {
        const topic = `smashminton/device/${deviceId}/heartbeat`;
        return this.client.send(topic, {});
    }

    private generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    }

    async registerEmployeeFingerprint(employeeId: number, fingerprintId: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { employeeid: employeeId },
            });

            if (!employee) {
                this.logger.error(`Employee with ID ${employeeId} not found`);
                throw new Error(`Employee with ID ${employeeId} not found`);
            }

            await this.prisma.employees.update({
                where: { employeeid: employeeId },
                data: {
                    fingerprintid: fingerprintId
                }
            });

            this.logger.log(`✅ Fingerprint ${fingerprintId} has been registered for employee ${employeeId}`);
            return { success: true, message: `Fingerprint registered successfully` };
        } catch (error) {
            this.logger.error(`❌ Failed to register fingerprint for employee ${employeeId}:`, error);
            throw error;
        }
    }

    async deleteEmployeeFingerprint(employeeId: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { employeeid: employeeId },
            });

            if (!employee) {
                this.logger.error(`Employee with ID ${employeeId} not found`);
                throw new Error(`Employee with ID ${employeeId} not found`);
            }

            await this.prisma.employees.update({
                where: { employeeid: employeeId },
                data: {
                    fingerprintid: null
                }
            });

            this.logger.log(`✅ Fingerprint has been deleted for employee ${employeeId}`);
            return { success: true, message: `Fingerprint deleted successfully` };
        } catch (error) {
            this.logger.error(`❌ Failed to delete fingerprint for employee ${employeeId}:`, error);
            throw error;
        }
    }

    async timeTracking(fingerprintId: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { fingerprintid: fingerprintId },
            });

            if (!employee) {
                this.logger.error(`❌ Employee with fingerprint ID ${fingerprintId} not found`);
                throw new Error(`Employee with fingerprint ID ${fingerprintId} not found`);
            }

            const result = await this.updateTimeSheet(employee.employeeid);
            this.logger.log(`✅ Timesheet updated successfully for employee ${employee.employeeid}`);

            return { success: true, message: `Time tracking updated successfully`, employee: employee.employeeid };

        } catch (error) {
            this.logger.error(`❌ Failed to track time for fingerprint ID ${fingerprintId}:`, error);
            throw error;
        }
    }

    async updateTimeSheet(employeeId: number) {
        try {
            const employee = await this.prisma.employees.findUnique({
                where: { employeeid: employeeId },
            });

            if (!employee) {
                this.logger.error(`Employee with ID ${employeeId} not found`);
                throw new Error(`Employee with ID ${employeeId} not found`);
            }

            const currentTime = new Date();
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            // Check if timesheet exists for today
            const existingTimesheet = await this.prisma.timesheet.findUnique({
                where: {
                    employeeid_timesheetdate: {
                        employeeid: employeeId,
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

                this.logger.log(`⏰ Clock-out recorded for employee ${employeeId} at ${currentTime.toISOString()}`);
                return { action: 'clock-out', time: currentTime };

            } else {
                // First time today - create new timesheet (clock-in)
                const newTimesheet = await this.prisma.timesheet.create({
                    data: {
                        employeeid: employeeId,
                        timesheetdate: currentDate,
                        starthour: currentTime,
                        endhour: null,
                    }
                });

                this.logger.log(`🟢 Clock-in recorded for employee ${employeeId} at ${currentTime.toISOString()}`);
                return { action: 'clock-in', time: currentTime };
            }

        } catch (error) {
            this.logger.error(`❌ Failed to update timesheet for employee ${employeeId}:`, error);
            throw error;
        }
    }
}
