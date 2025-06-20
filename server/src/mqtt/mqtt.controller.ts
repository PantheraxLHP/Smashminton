import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern } from '@nestjs/microservices';

@Controller()
export class MqttController {
    private readonly logger = new Logger(MqttController.name);

    /*
     * Handle ESP8266 responses
     */
    @EventPattern('smashminton/device/+/response')
    handleDeviceResponse(@Payload() data: any) {
        this.logger.log('Device Response:', JSON.stringify(data, null, 2));

        // Process different types of responses
        if (data.status === 'pong') {
            this.logger.log(`Ping response from device: ${data.timestamp}`);
        } else if (data.status === 'error') {
            this.logger.error(`Device error: ${data.message}`);
        } else if (data.action === 'enroll_finger') {
            if (data.status === 'success') {
                this.logger.log(`✅ Fingerprint enrollment successful: ID=${data.fingerID}`);
            } else {
                this.logger.error(`❌ Fingerprint enrollment failed: ID=${data.fingerID}, Error: ${data.message}`);
            }
        } else if (data.action === 'delete_finger') {
            if (data.status === 'success') {
                this.logger.log(`✅ Fingerprint deleted successfully: ID=${data.fingerID}`);
            } else {
                this.logger.error(`❌ Fingerprint deletion failed: ID=${data.fingerID}, Error: ${data.message}`);
            }
        } else if (data.action === 'get_finger_count') {
            if (data.status === 'success') {
                this.logger.log(`📊 Fingerprint count: ${data.enrolledCount}/${data.capacity} enrolled`);
            } else {
                this.logger.error(`❌ Failed to get fingerprint count: ${data.message}`);
            }
        }

        return data;
    }

    /*
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

    /*
     * Handle ESP8266 heartbeat
     */
    @EventPattern('smashminton/device/+/heartbeat')
    handleDeviceHeartbeat(@Payload() data: any) {
        this.logger.debug(`Heartbeat from ${data.deviceId}: uptime=${data.uptime}ms, heap=${data.freeHeap}`);
        return data;
    }

    /*
     * Handle ESP8266 device info
     */
    @EventPattern('smashminton/device/+/info')
    handleDeviceInfo(@Payload() data: any) {
        this.logger.log('Device Info:', JSON.stringify(data, null, 2));
        return data;
    }

    /*
     * Handle any MQTT message for debugging
     */
    @EventPattern('smashminton/+/+/+')
    handleAllMessages(@Payload() data: any) {
        this.logger.debug('MQTT Message:', JSON.stringify(data, null, 2));
        return data;
    }

    /*
     * Handle ESP8266 fingerprint events
     */
    @EventPattern('smashminton/device/+/fingerprint')
    handleFingerprintEvent(@Payload() data: any) {
        this.logger.log('Fingerprint Event:', JSON.stringify(data, null, 2));

        if (data.eventType === 'match') {
            this.logger.log(`🎯 Fingerprint match: ID=${data.fingerID}, Confidence=${data.confidence}`);
            // Handle successful fingerprint authentication
            // You can trigger court access, user login, etc.
        } else if (data.eventType === 'unknown') {
            this.logger.log('👤 Unknown fingerprint detected');
            // Handle unknown fingerprint (access denied, log attempt, etc.)
        }

        return data;
    }
}
