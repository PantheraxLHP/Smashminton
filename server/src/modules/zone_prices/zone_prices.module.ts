import { Module } from '@nestjs/common';
import { ZonePricesService } from './zone_prices.service';
import { ZonePricesController } from './zone_prices.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ZonePricesController],
  providers: [ZonePricesService],
  imports: [PrismaModule],
  exports: [ZonePricesService],
})
export class ZonePricesModule {}
