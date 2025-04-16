import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZonePricesService {
    constructor(
        private prisma: PrismaService,
    ) { }
    async getZonePrices() {
        return this.prisma.zone_prices.findMany();
    }
}
