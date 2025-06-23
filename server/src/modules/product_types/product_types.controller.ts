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
  constructor(private readonly productTypesService: ProductTypesService) { }

  @Get('all-product-filters')
  findAllProductFilters() {
    return this.productTypesService.findAllProductFilters();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productTypesService.getProductById(+id);
  }

  @Get('/:id/products')
  @ApiQuery({
    name: 'productfiltervalue',
    required: false,
    type: String,
    description: 'Comma-separated list of productfiltervalue IDs',
  })
  findAllProductsFromProductType(@Param('id') id: number,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '12',
    @Query('productfiltervalue') productFilterValueQuery?: string) {
    const pageNumber = parseInt(page) || 1;
    const pageSizeNumber = parseInt(pageSize) || 12;
    // Validation
    if (pageNumber < 1) {
      throw new Error('Page number must be greater than 0');
    }
    if (pageSizeNumber < 1 || pageSizeNumber > 100) {
      throw new Error('Page size must be between 1 and 100');
    }

    const filterValues: number[] | undefined = productFilterValueQuery
      ? productFilterValueQuery.split(',').map((v) => +v)
      : undefined;
    return this.productTypesService.findAllProductsFromProductType(+id, filterValues, pageNumber, pageSizeNumber);
  }

  @Get('/:id/products/v2')
  @ApiQuery({
    name: 'productfiltervalue',
    required: false,
    type: String,
    description: 'Comma-separated list of productfiltervalue IDs',
  })
  @ApiOperation({ summary: 'Get products from product type + filtervalueid, value' })
  findAllProductsFromProductType_V2(@Param('id') id: number,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '12',
    @Query('productfiltervalue') productFilterValueQuery?: string) {
    const pageNumber = parseInt(page) || 1;
    const pageSizeNumber = parseInt(pageSize) || 12;
    // Validation
    if (pageNumber < 1) {
      throw new Error('Page number must be greater than 0');
    }
    if (pageSizeNumber < 1 || pageSizeNumber > 100) {
      throw new Error('Page size must be between 1 and 100');
    }

    const filterValues: number[] | undefined = productFilterValueQuery
      ? productFilterValueQuery.split(',').map((v) => +v)
      : undefined;
    return this.productTypesService.findAllProductsFromProductType_V2(+id, filterValues, pageNumber, pageSizeNumber);
  }


  @Get('/:id/products/v3')
  @ApiQuery({
    name: 'productfiltervalue',
    required: false,
    type: String,
    description: 'Comma-separated list of productfiltervalue IDs',
  })
  @ApiOperation({ summary: 'Get products from product type + filtervalueid, value + batches info' })
  findAllProductsFromProductType_V3(@Param('id') id: number,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '12',
    @Query('productfiltervalue') productFilterValueQuery?: string) {
    const pageNumber = parseInt(page) || 1;
    const pageSizeNumber = parseInt(pageSize) || 12;
    // Validation
    if (pageNumber < 1) {
      throw new Error('Page number must be greater than 0');
    }
    if (pageSizeNumber < 1 || pageSizeNumber > 100) {
      throw new Error('Page size must be between 1 and 100');
    }

    const filterValues: number[] | undefined = productFilterValueQuery
      ? productFilterValueQuery.split(',').map((v) => +v)
      : undefined;
    return this.productTypesService.findAllProductsFromProductType_V3(+id, filterValues, pageNumber, pageSizeNumber);
  }
}



