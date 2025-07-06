import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern } from '@nestjs/microservices';
import { MqttService } from './mqtt.service';
import { AppGateway } from './app.gateway';

@Controller()
export class MqttController {
    private readonly logger = new Logger(MqttController.name);

    constructor(
        private readonly mqttService: MqttService,
        private readonly appGateway: AppGateway
    ) { }

    /*
     * Handle ESP8266 responses
     */
    @EventPattern('smashminton/device/+/response')
    async handleDeviceResponse(@Payload() data: any) {
        this.logger.log('Device Response:', JSON.stringify(data, null, 2));
        try {

            // Process different types of responses
            if (data.status === 'pong') {
                this.logger.log(`Ping response from device: ${data.timestamp}`);
            } else if (data.action === 'error_response') {
                this.logger.error(`Device error: ${data.message}`);           
            } else if (data.action === 'enroll_finger') {
                if (data.status === 'success') {
                    this.logger.log(`✅ Fingerprint enrollment successful: ID=${data.fingerID}`);
                    await this.mqttService.enrollEmployeeFingerprint(data.employeeID, data.fingerID);
                    this.appGateway.enrollmentSuccess(data.employeeID, data.fingerID);
                } else {
                    this.logger.error(`❌ Fingerprint enrollment failed: ID=${data.fingerID}, Error: ${data.message}`);
                    this.appGateway.enrollmentFailure(data.employeeID, data.message || 'Enrollment failed');
                }
            } else if (data.action === 'enroll_step') {
                this.logger.log(`🔄 Enrollment step: ${data.step} for employee ${data.employeeID}`);
                if (data.step === 'remove_finger') {
                    this.appGateway.enrollmentStep(data.employeeID, 'remove_finger');
                } else if (data.step === 'place_again') {
                    this.appGateway.enrollmentStep(data.employeeID, 'place_again');
                }              
            } else if (data.action === 'delete_finger') {
                if (data.status === 'success') {
                    this.logger.log(`✅ Fingerprint deleted successfully: ID=${data.fingerID}`);

                    const hasPendingDeletion = await this.mqttService.handleEsp8266DeletionConfirmation(data.employeeID, true);

                    if (!hasPendingDeletion && data.employeeID > 0) {
                        await this.mqttService.deleteEmployeeFingerprint(data.employeeID);
                    }
                } else {
                    this.logger.error(`❌ Fingerprint deletion failed: ID=${data.fingerID}, Error: ${data.message}`);

                    const hasPendingDeletion = await this.mqttService.handleEsp8266DeletionConfirmation(data.employeeID, false, data.message);

                    if (!hasPendingDeletion) {
                        this.logger.error(`❌ Regular fingerprint deletion failed: ID=${data.fingerID}, Error: ${data.message}`);
                    }
                }
            } else if (data.action === 'get_finger_count') {
                if (data.status === 'success') {
                    this.logger.log(`📊 Fingerprint count: ${data.enrolledCount}/${data.capacity} enrolled`);
                } else {
                    this.logger.error(`❌ Failed to get fingerprint count: ${data.message}`);
                }
            }

            return data;
        } catch (error) {
            this.logger.error('Error processing device response:', error);
        }
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
     * Handle ESP8266 fingerprint events
     */
    @EventPattern('smashminton/device/+/fingerprint')
    async handleFingerprintEvent(@Payload() data: any) {
        this.logger.log('Fingerprint Event:', JSON.stringify(data, null, 2));

        try {
            if (data.eventType === 'match') {
                this.logger.log(`🎯 Fingerprint match: ID=${data.fingerID}, Confidence=${data.confidence}`);
                await this.mqttService.handleFingerprintScan(data.deviceId, data.fingerID, new Date());
            } else if (data.eventType === 'unknown') {
                this.logger.log('👤 Unknown fingerprint detected');
            }
            
            return data;
        } catch (error) {
            this.logger.error('❌ Error processing fingerprint event:', error);
        }
    }

    /*
     * Handle any MQTT message for debugging
     */
    @EventPattern('smashminton/+/+/+')
    handleAllMessages(@Payload() data: any) {
        this.logger.debug('MQTT Message:', JSON.stringify(data, null, 2));
        return data;
    }
}
