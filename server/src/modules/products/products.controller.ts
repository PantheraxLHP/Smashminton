import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException } from '@nestjs/common';
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
}
