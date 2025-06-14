import { Controller, Get, Post, Body,  Query, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
    ApiTags,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CacheService } from '../cache/cache.service';
import { Public } from 'src/decorators/public.decorator';
@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cacheService: CacheService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a product' })
    @ApiCreatedResponse({
        description: 'Product was created',
        type: CreateProductDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    async create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }
    @Get('all-products')
    @ApiOperation({ summary: 'Get all products' })
    getAllBasicProducts() {
        return this.productsService.findAllBasicProducts();
    }

    @Get('all-products-with-batches')
    @ApiOperation({ summary: 'Get all products with batches' })
    getProductsWithBatches(@Query('page') page: string = '1',
        @Query('pageSize') pageSize: string = '12') {
        const pageNumber = parseInt(page) || 1;
        const pageSizeNumber = parseInt(pageSize) || 12;
        // Validation
        if (pageNumber < 1) {
            throw new Error('Page number must be greater than 0');
        }
        if (pageSizeNumber < 1 || pageSizeNumber > 100) {
            throw new Error('Page size must be between 1 and 100');
        }
        return this.productsService.getProductsWithBatches(pageNumber, pageSizeNumber);
    }
}
