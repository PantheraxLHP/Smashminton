import { Injectable } from '@nestjs/common';
import { CreateProductFilterDto } from './dto/create-product_filter.dto';
import { UpdateProductFilterDto } from './dto/update-product_filter.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductFilterService {
  constructor (private prisma: PrismaService) {
    }
  
  create(createProductFilterDto: CreateProductFilterDto) {
    return 'This action adds a new productFilter';
  }

  findAll() {
    return this.prisma.product_filter.findMany({
      include: {
        product_filter_values: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} productFilter`;
  }

  update(id: number, updateProductFilterDto: UpdateProductFilterDto) {
    return `This action updates a #${id} productFilter`;
  }

  remove(id: number) {
    return `This action removes a #${id} productFilter`;
  }
}
