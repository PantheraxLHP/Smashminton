import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { MqttService } from './mqtt.service';

@ApiTags('ESP8266 Device Control')
@Controller('devices')
export class DeviceController {
    constructor(private readonly mqttService: MqttService) { }

    @Post(':deviceId/ping')
    @ApiOperation({ summary: 'Ping ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)' })
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
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)' })
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
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)' })
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
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)' })
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
    @ApiOperation({ summary: 'Enroll new fingerprint on ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fingerID: { type: 'number', example: 1, description: 'Fingerprint ID (1-127)' }
            }
        }
    })
    async enrollFingerprint(
        @Param('deviceId') deviceId: string,
        @Body() body: { fingerID: number }
    ) {
        await this.mqttService.sendCommand(deviceId, 'enroll_finger', { fingerID: body.fingerID });
        return {
            success: true,
            message: `Fingerprint enrollment started for ID ${body.fingerID} on ${deviceId}`,
            fingerID: body.fingerID,
            instructions: 'Place finger on sensor when prompted',
            timestamp: new Date().toISOString()
        };
    }

    @Delete(':deviceId/fingerprint/:fingerID')
    @ApiOperation({ summary: 'Delete fingerprint from ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)' })
    @ApiParam({ name: 'fingerID', description: 'Fingerprint ID to delete' })
    async deleteFingerprint(
        @Param('deviceId') deviceId: string,
        @Param('fingerID') fingerID: string
    ) {
        const id = parseInt(fingerID);
        await this.mqttService.sendCommand(deviceId, 'delete_finger', { fingerID: id });
        return {
            success: true,
            message: `Fingerprint ID ${id} deletion requested on ${deviceId}`,
            fingerID: id,
            timestamp: new Date().toISOString()
        };
    }

    @Get(':deviceId/fingerprint/count')
    @ApiOperation({ summary: 'Get enrolled fingerprint count from ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)' })
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
}
