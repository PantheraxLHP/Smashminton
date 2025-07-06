import { Module } from '@nestjs/common';
import { CourtBookingService } from './court_booking.service';
import { CourtBookingController } from './court_booking.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CourtsModule } from '../courts/courts.module';
import { CacheModule } from '../cache/cache.module';
import { MqttModule } from 'src/mqtt/mqtt.module';

@Module({
  controllers: [CourtBookingController],
  providers: [CourtBookingService],
  imports: [PrismaModule, CourtsModule, CacheModule, MqttModule],
  exports: [CourtBookingService], // Export the service if needed in other modules
})
export class CourtBookingModule {}
