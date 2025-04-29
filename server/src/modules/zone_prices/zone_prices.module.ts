import { Module } from '@nestjs/common';
import { ZonePricesService } from './zone_prices.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    providers: [ZonePricesService],
    imports: [PrismaModule],
    exports: [ZonePricesService],
})
export class ZonePricesModule { }
