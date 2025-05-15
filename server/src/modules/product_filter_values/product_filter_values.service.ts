import { Injectable } from '@nestjs/common';
import { CreateProductFilterValueDto } from './dto/create-product_filter_value.dto';
import { UpdateProductFilterValueDto } from './dto/update-product_filter_value.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductFilterValuesService {
  constructor (private prisma: PrismaService) {}

  create(createProductFilterValueDto: CreateProductFilterValueDto) {
    return 'This action adds a new productFilterValue';
  }

  findAll() {
    return this.prisma.product_filter_values.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} productFilterValue`;
  }

  update(id: number, updateProductFilterValueDto: UpdateProductFilterValueDto) {
    return `This action updates a #${id} productFilterValue`;
  }

  remove(id: number) {
    return `This action removes a #${id} productFilterValue`;
  }
}
