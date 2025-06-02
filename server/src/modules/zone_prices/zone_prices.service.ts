import { Injectable } from '@nestjs/common';
import { CreateZonePriceDto } from './dto/create-zone_price.dto';
import { UpdateZonePriceDto } from './dto/update-zone_price.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZonePricesService {
  constructor(private prisma: PrismaService) { }

  create(createZonePriceDto: CreateZonePriceDto) {
    return 'This action adds a new zonePrice';
  }

  async getAllZonePrice() {
    const data = await this.prisma.zone_prices.findMany({
      include: {
        zones: true,
      },
      orderBy: {
        zoneid: 'asc',
      },
    });

    return data.map(item => ({
      zoneid: item.zoneid,
      zonename: item.zones?.zonename || null,
      zoneimgurl: item.zones?.zoneimgurl || null,
      dayfrom: item.dayfrom,
      dayto: item.dayto,
      starttime: item.starttime,
      endtime: item.endtime,
      price: item.price
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} zonePrice`;
  }

  update(id: number, updateZonePriceDto: UpdateZonePriceDto) {
    return this.prisma.zone_prices.update({
      where: { zonepriceid: id },
      data: {
        ...updateZonePriceDto,
        updatedat: new Date(), // update lại timestamp
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} zonePrice`;
  }
}
