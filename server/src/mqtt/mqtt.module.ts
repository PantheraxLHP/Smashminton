import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { DeviceController } from './device.controller';
import { FingerprintGateway } from './fingerprint.gateway';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
    controllers: [MqttController, DeviceController],
    providers: [MqttService, FingerprintGateway],
    exports: [MqttService, FingerprintGateway],
    imports: [PrismaModule],
})
export class MqttModule { }
