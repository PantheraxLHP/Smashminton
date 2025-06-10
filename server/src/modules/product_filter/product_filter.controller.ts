import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductFilterService } from './product_filter.service';
import { CreateProductFilterDto } from './dto/create-product_filter.dto';
import { UpdateProductFilterDto } from './dto/update-product_filter.dto';

@Controller('product-filter')
export class ProductFilterController {
  constructor(private readonly productFilterService: ProductFilterService) {}

  @Get()
  findAll() {
    return this.productFilterService.findAll();
  }
}
