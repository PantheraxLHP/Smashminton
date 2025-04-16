import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { ZonePricesModule } from '../zone_prices/zone_prices.module';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
  imports: [PrismaModule, CacheModule, ZonePricesModule],
})
export class BookingsModule {}
