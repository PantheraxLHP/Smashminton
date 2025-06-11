import { Injectable } from '@nestjs/common';
import { CreateProductFilterDto } from './dto/create-product_filter.dto';
import { UpdateProductFilterDto } from './dto/update-product_filter.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductFilterService {
  constructor(private prisma: PrismaService) {
  }
  findAll() {
    return this.prisma.product_filter.findMany({
      include: {
        product_filter_values: true,
      },
    });
  }
}
