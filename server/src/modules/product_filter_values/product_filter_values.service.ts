import { Injectable } from '@nestjs/common';
import { CreateProductFilterValueDto } from './dto/create-product_filter_value.dto';
import { UpdateProductFilterValueDto } from './dto/update-product_filter_value.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductFilterValuesService {
  constructor (private prisma: PrismaService) {}
  findAll() {
    return this.prisma.product_filter_values.findMany();
  }
}
