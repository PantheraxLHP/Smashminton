import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    const filter = await this.prisma.product_filter.findUnique({
      where: {
        productfilterid: id,
      },
      include: {
        product_filter_values: true
      },
    });

    if (!filter) {
      throw new NotFoundException(`Không tìm thấy product_filter id = ${id}`);
    }

    return filter;
  }
}
