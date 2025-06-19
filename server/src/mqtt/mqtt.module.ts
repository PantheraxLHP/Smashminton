import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { DeviceController } from './device.controller';

@Module({
    controllers: [MqttController, DeviceController],
    providers: [MqttService],
    exports: [MqttService],
})
export class MqttModule { }
