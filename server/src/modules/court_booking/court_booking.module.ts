import { Module } from '@nestjs/common';
import { CourtBookingService } from './court_booking.service';
import { CourtBookingController } from './court_booking.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CourtBookingController],
  providers: [CourtBookingService],
  imports: [PrismaModule],
})
export class CourtBookingModule {}
