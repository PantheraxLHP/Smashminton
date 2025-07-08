import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductFilterValuesService } from './product_filter_values.service';
import { CreateProductFilterValueDto } from './dto/create-product_filter_value.dto';
import { UpdateProductFilterValueDto } from './dto/update-product_filter_value.dto';

@Controller('product-filter-values')
export class ProductFilterValuesController {
  constructor(private readonly productFilterValuesService: ProductFilterValuesService) { }
  @Get()
  findAll() {
    return this.productFilterValuesService.findAll();
  }
}
