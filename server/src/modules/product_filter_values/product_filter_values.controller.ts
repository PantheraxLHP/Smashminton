  import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductFilterValuesService } from './product_filter_values.service';
import { CreateProductFilterValueDto } from './dto/create-product_filter_value.dto';
import { UpdateProductFilterValueDto } from './dto/update-product_filter_value.dto';

@Controller('product-filter-values')
export class ProductFilterValuesController {
  constructor(private readonly productFilterValuesService: ProductFilterValuesService) {}

  @Post()
  create(@Body() createProductFilterValueDto: CreateProductFilterValueDto) {
    return this.productFilterValuesService.create(createProductFilterValueDto);
  }

  @Get()
  findAll() {
    return this.productFilterValuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productFilterValuesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductFilterValueDto: UpdateProductFilterValueDto) {
    return this.productFilterValuesService.update(+id, updateProductFilterValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productFilterValuesService.remove(+id);
  }
}
