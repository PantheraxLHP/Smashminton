import { Controller, Post, Body, Param, Get, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { MqttService } from './mqtt.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';

@ApiTags('ESP8266 Device Control')
@Controller('devices')
export class DeviceController {
    constructor(
        private readonly mqttService: MqttService,
    ) { }

    @Post(':deviceId/ping')
    @ApiOperation({ summary: 'Ping ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)', example: 'esp01' })
    async pingDevice(@Param('deviceId') deviceId: string) {
        await this.mqttService.pingDevice(deviceId);
        return {
            success: true,
            message: `Ping command sent to ${deviceId}`,
            timestamp: new Date().toISOString()
        };
    }

    @Post(':deviceId/status')
    @ApiOperation({ summary: 'Get ESP8266 device status' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)', example: 'esp01' })
    async getDeviceStatus(@Param('deviceId') deviceId: string) {
        await this.mqttService.getDeviceStatus(deviceId);
        return {
            success: true,
            message: `Status request sent to ${deviceId}`,
            timestamp: new Date().toISOString()
        };
    }

    @Post(':deviceId/reset')
    @ApiOperation({ summary: 'Reset ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)', example: 'esp01' })
    async resetDevice(@Param('deviceId') deviceId: string) {
        await this.mqttService.resetDevice(deviceId);
        return {
            success: true,
            message: `Reset command sent to ${deviceId}`,
            warning: 'Device will restart in 2 seconds',
            timestamp: new Date().toISOString()
        };
    }

    @Post(':deviceId/command')
    @ApiOperation({ summary: 'Send custom command to ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)', example: 'esp01' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                action: { type: 'string', example: 'custom_action' },
                data: { type: 'object', example: { key: 'value' } }
            }
        }
    }) 
    async sendCustomCommand(
        @Param('deviceId') deviceId: string,
        @Body() body: { action: string; data?: any }
    ) {
        await this.mqttService.sendCommand(deviceId, body.action, body.data);
        return {
            success: true,
            message: `Custom command '${body.action}' sent to ${deviceId}`,
            timestamp: new Date().toISOString()
        };
    }

    @Post(':deviceId/fingerprint/enroll')
    @Roles('hr_manager')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Enroll new fingerprint on ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)', example: 'esp01' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                employeeID: { type: 'number', example: 1, description: 'Employee ID for enrolling fingerprint' }
            }
        }
    })    
    async enrollFingerprint(
        @Param('deviceId') deviceId: string,
        @Body() body: { roomID: number, employeeID: number }
    ) {
        await this.mqttService.handleEnrollFingerprint(deviceId, body.roomID, body.employeeID);
        return {
            success: true,
            message: `Fingerprint enrollment started for employee ID ${body.employeeID} on ${deviceId}`,
            employeeID: body.employeeID,
            instructions: 'Place finger on sensor when prompted',
            timestamp: new Date().toISOString()
        };
    }

    @Delete(':deviceId/fingerprint/delete')
    @ApiOperation({ summary: 'Delete fingerprint from ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)', example: 'esp01' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                employeeID: { type: 'number', example: 1, description: 'EmployeeID with fingerprint to be deleted' },
                waitForConfirmation: { type: 'boolean', example: false, description: 'Wait for ESP8266 confirmation before returning' }
            }
        }
    })
    async deleteFingerprint(
        @Param('deviceId') deviceId: string,
        @Body() body: { employeeID: number; waitForConfirmation?: boolean }
    ) {
        try {
            if (body.waitForConfirmation) {
                // Wait for confirmation
                await this.mqttService.handleDeleteFingerprintAndWaitForConfirmation(deviceId, body.employeeID);
                return {
                    success: true,
                    message: `Employee ID ${body.employeeID} fingerprint deleted successfully on ${deviceId}`,
                    employeeID: body.employeeID,
                    timestamp: new Date().toISOString()
                };
            } else {
                await this.mqttService.handleDeleteFingerprint(deviceId, body.employeeID);
                return {
                    success: true,
                    message: `Employee ID ${body.employeeID} fingerprint deletion requested on ${deviceId}`,
                    employeeID: body.employeeID,
                    note: 'Command sent, check MQTT logs for confirmation',
                    timestamp: new Date().toISOString()
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Failed to delete fingerprint for employee ${body.employeeID}`,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    @Delete(':deviceId/fingerprint/simple-delete')
    @ApiOperation({ summary: 'Delete fingerprint by FingerprintID from ESP8266' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)', example: 'esp01' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fingerprintID: { type: 'number', example: 1, description: 'Fingerprint ID to be deleted' }
            }
        }
    })
    async simpleDeleteFingerprint(
        @Param('deviceId') deviceId: string,
        @Body() body: { fingerprintID: number }
    ) {
        try {
            await this.mqttService.deleteDeviceFingerprint(deviceId, body.fingerprintID);
            return {
                success: true,
                message: `Fingerprint ID ${body.fingerprintID} deletion requested on ${deviceId}`,
                fingerprintID: body.fingerprintID,
                note: 'Command sent, check MQTT logs for confirmation',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to delete fingerprint ID ${body.fingerprintID}`,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    @Get(':deviceId/fingerprint/count')
    @ApiOperation({ summary: 'Get enrolled fingerprint count from ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)', example: 'esp01' })
    async getFingerprintCount(
        @Param('deviceId') deviceId: string
    ) {
        await this.mqttService.sendCommand(deviceId, 'get_finger_count');
        return {
            success: true,
            message: `Fingerprint count request sent to ${deviceId}`,
            note: 'Check MQTT logs for response',
            timestamp: new Date().toISOString()
        };
    }

    @Get('available-finger-id')
    @ApiOperation({ summary: 'Get next available fingerprint ID' })
    async getNextAvailableFingerprintId() {
        try {
            const nextAvailableId = await this.mqttService.getNextAvailableFingerprintId();
            return {
                success: true,
                message: `Next available fingerprint ID is ${nextAvailableId}`,
                nextAvailableId: nextAvailableId
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to get next available fingerprint ID',
                error: error.message
            };
        }
    }
}
