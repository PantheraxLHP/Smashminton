import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { DeviceController } from './device.controller';
import { AppGateway } from './app.gateway';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
    controllers: [MqttController, DeviceController],
    providers: [MqttService, AppGateway],
    exports: [MqttService, AppGateway],
    imports: [PrismaModule],
})
export class MqttModule { }
