import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductFilterService } from './product_filter.service';
import { CreateProductFilterDto } from './dto/create-product_filter.dto';
import { UpdateProductFilterDto } from './dto/update-product_filter.dto';

@Controller('product-filter')
export class ProductFilterController {
  constructor(private readonly productFilterService: ProductFilterService) {}

  @Post()
  create(@Body() createProductFilterDto: CreateProductFilterDto) {
    return this.productFilterService.create(createProductFilterDto);
  }

  @Get()
  findAll() {
    return this.productFilterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productFilterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductFilterDto: UpdateProductFilterDto) {
    return this.productFilterService.update(+id, updateProductFilterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productFilterService.remove(+id);
  }
}
