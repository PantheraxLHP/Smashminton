import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminController } from './admin.controller';
import { PredictionService } from './prediction.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ZonePricesModule } from '../zone_prices/zone_prices.module';

@Module({
  controllers: [AdminController],
  providers: [DashboardService, PredictionService],
  exports: [DashboardService, PredictionService],
  imports: [PrismaModule, ZonePricesModule],
})
export class AdminModule { }
