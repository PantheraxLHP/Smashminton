import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { ProductTypesService } from './product_types.service';
import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post()
  create(@Body() createProductTypeDto: CreateProductTypeDto) {
    return this.productTypesService.create(createProductTypeDto);
  }

  @Get('all-product-filters')
  findAllProductFilters() {
    return this.productTypesService.findAllProductFilters();
  }

  @Get('/:id/products')
    @ApiQuery({
    name: 'productfiltervalue',
    required: false,
    type: String,
    description: 'Comma-separated list of productfiltervalue IDs',
  })
  findAllProductsFromProductType(@Param('id') id: number,
                                @Query('productfiltervalue') productFilterValueQuery?: string)
  {
    const filterValues: number[] | undefined = productFilterValueQuery
      ? productFilterValueQuery.split(',').map((v) => +v)
      : undefined;
    return this.productTypesService.findAllProductsFromProductType(+id, filterValues);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductTypeDto: UpdateProductTypeDto) {
    return this.productTypesService.update(+id, updateProductTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTypesService.remove(+id);
  }
}
