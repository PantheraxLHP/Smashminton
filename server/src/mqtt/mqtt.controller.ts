import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern } from '@nestjs/microservices';

@Controller()
export class MqttController {
    private readonly logger = new Logger(MqttController.name);

    /**
     * Handle ESP8266 responses
     */
    @EventPattern('smashminton/device/+/response')
    handleDeviceResponse(@Payload() data: any) {
        this.logger.log('Device Response:', JSON.stringify(data, null, 2));

        // Process different types of responses
        if (data.status === 'pong') {
            this.logger.log(`Ping response from device: ${data.timestamp}`);
        } else if (data.status === 'success' && data.userId) {
            this.logger.log(`Device registration successful: ${data.userId}`);
        } else if (data.status === 'error') {
            this.logger.error(`Device error: ${data.message}`);
        }

        return data;
    }

    /**
     * Handle ESP8266 status updates
     */
    @EventPattern('smashminton/device/+/status')
    handleDeviceStatus(@Payload() data: any) {
        this.logger.log('Device Status:', JSON.stringify(data, null, 2));

        if (data.status === 'online') {
            this.logger.log(`Device ${data.deviceId} is online`);
        } else if (data.status === 'offline') {
            this.logger.log(`Device ${data.deviceId} is offline`);
        }

        return data;
    }

    /**
     * Handle ESP8266 heartbeat
     */
    @EventPattern('smashminton/device/+/heartbeat')
    handleDeviceHeartbeat(@Payload() data: any) {
        this.logger.debug(`Heartbeat from ${data.deviceId}: uptime=${data.uptime}ms, heap=${data.freeHeap}`);
        return data;
    }

    /**
     * Handle ESP8266 device info
     */
    @EventPattern('smashminton/device/+/info')
    handleDeviceInfo(@Payload() data: any) {
        this.logger.log('Device Info:', JSON.stringify(data, null, 2));

        // Store device info in database or cache
        // You can integrate with your existing device management system

        return data;
    }

    /**
     * Handle any MQTT message for debugging
     */
    @EventPattern('smashminton/+/+/+')
    handleAllMessages(@Payload() data: any) {
        this.logger.debug('MQTT Message:', JSON.stringify(data, null, 2));
        return data;
    }
}
