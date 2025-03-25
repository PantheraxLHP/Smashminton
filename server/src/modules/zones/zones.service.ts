import { Injectable } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZonesService {
  constructor (private prisma: PrismaService) {

  }

  create(createZoneDto: CreateZoneDto) {
    return 'This action adds a new zone';
  }

  findAll() {
    return this.prisma.zones.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} zone`;
  }

  update(id: number, updateZoneDto: UpdateZoneDto) {
    return `This action updates a #${id} zone`;
  }

  remove(id: number) {
    return `This action removes a #${id} zone`;
  }
}
