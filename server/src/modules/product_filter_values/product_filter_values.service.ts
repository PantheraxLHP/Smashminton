import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ProductFilterValuesService {
  constructor (private prisma: PrismaService) {}
  findAll() {
    return this.prisma.product_filter_values.findMany();
  }
}
