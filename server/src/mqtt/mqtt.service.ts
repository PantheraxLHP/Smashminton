import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';

@Injectable()
export class MqttService {
    private readonly logger = new Logger(MqttService.name);

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
    }

    /**
     * Register device
     */
    async registerDevice(deviceId: string, deviceName: string, location: string): Promise<void> {
        await this.sendCommand(deviceId, 'register', {
            deviceName,
            location,
        });
    }

    /**
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
}
