import { Controller, Get, Post, Body, Patch, Param, Query, Delete, UseGuards } from '@nestjs/common';
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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) { }

  @Get('all-product-filters')
  @Public()
  findAllProductFilters() {
    return this.productTypesService.findAllProductFilters();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productTypesService.getProductById(+id);
  }

  @Get('/:id/products')
  @Public()
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
  @Roles('wh_manager')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'productfiltervalue',
    required: false,
    type: String,
    description: 'Comma-separated list of productfiltervalue IDs',
  })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Search keyword for productname' })
  @ApiOperation({ summary: 'Get products from product type + filtervalueid, value' })
  findAllProductsFromProductType_V2(
    @Param('id') id: number,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '12',
    @Query('productfiltervalue') productFilterValueQuery?: string,
    @Query('q') q?: string) {
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
    return this.productTypesService.findAllProductsFromProductType_V2(+id, filterValues, q, pageNumber, pageSizeNumber);
  }


  @Get('/:id/products/v3')
  @Roles('wh_manager')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'productfiltervalue',
    required: false,
    type: String,
    description: 'Comma-separated list of productfiltervalue IDs',
  })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Search keyword for productname' })
  @ApiOperation({ summary: 'Get products from product type + filtervalueid, value + batches info' })
  findAllProductsFromProductType_V3(@Param('id') id: number,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '12',
    @Query('productfiltervalue') productFilterValueQuery?: string,
    @Query('q') q?: string) {
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
    return this.productTypesService.findAllProductsFromProductType_V3(+id, filterValues, q, pageNumber, pageSizeNumber);
  }
}



