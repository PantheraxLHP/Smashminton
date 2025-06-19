import { Controller, Post, Body, Param, Get } from '@nestjs/common';
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

    @Post(':deviceId/register')
    @ApiOperation({ summary: 'Register ESP8266 device' })
    @ApiParam({ name: 'deviceId', description: 'Device ID (e.g., esp01)' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                deviceName: { type: 'string', example: 'Court 1 Sensor' },
                location: { type: 'string', example: 'Main Court' }
            }
        }
    })
    async registerDevice(
        @Param('deviceId') deviceId: string,
        @Body() body: { deviceName: string; location: string }
    ) {
        await this.mqttService.registerDevice(deviceId, body.deviceName, body.location);
        return {
            success: true,
            message: `Registration request sent to ${deviceId}`,
            deviceName: body.deviceName,
            location: body.location,
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
}
