import { Injectable } from '@nestjs/common';
import { CreateZonePriceDto } from './dto/create-zone_price.dto';
import { UpdateZonePriceDto } from './dto/update-zone_price.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZonePricesService {
  constructor (private prisma: PrismaService) {}

  create(createZonePriceDto: CreateZonePriceDto) {
    return 'This action adds a new zonePrice';
  }

  findAll() {
    return `This action returns all zonePrices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zonePrice`;
  }

  update(id: number, updateZonePriceDto: UpdateZonePriceDto) {
    return `This action updates a #${id} zonePrice`;
  }

  remove(id: number) {
    return `This action removes a #${id} zonePrice`;
  }
}
