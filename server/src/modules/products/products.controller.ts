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
    ) {}

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

    @Get('BadmintonEquipments')
    @ApiOperation({ summary: 'Find all badminton equipments' })
    @ApiOkResponse({ description: 'Find all badminton equipments' })
    async findAllBadmintonEquipments() {
        const products = await this.productsService.findAllBadmintonEquipments();
        if (!products) {
            throw new NotFoundException('No badminton equipments');
        }
        return products;
    }

    @Get('BadmintonTubes')
    @ApiOperation({ summary: 'Find all badminton tubes' })
    @ApiOkResponse({ description: 'Find all badminton tubess' })
    async findAllBadmintonTube() {
        const products = await this.productsService.findAllBadmintonTube();
        if (!products) {
            throw new NotFoundException('No badminton tubes');
        }
        return products;
    }

    @Get('foods-snacks-beverages')
    @ApiOperation({ summary: 'Find all foods, snacks and beverages' })
    @ApiOkResponse({ description: 'Find all foods, snacks and beverages' })
    async findAllFoodsSnacksBeverages() {
        const products = await this.productsService.findAllFoodsSnacksBeverages();
        if (!products) {
            throw new NotFoundException('No foods, snacks and beverages found');
        }
        return products;
    }

    @Get('foods')
    @ApiOperation({ summary: 'Find all foods' })
    @ApiOkResponse({ description: 'Find all foods' })
    async findAllFoods() {
        const products = await this.productsService.findAllFoods();
        if (!products) {
            throw new NotFoundException('No foods');
        }
        return products;
    }

    @Get('snacks')
    @ApiOperation({ summary: 'Find all snacks' })
    @ApiOkResponse({ description: 'Find all snacks' })
    async findAllSnacks() {
        const products = await this.productsService.findAllSnacks();
        if (!products) {
            throw new NotFoundException('No snacks');
        }
        return products;
    }

    @Get('breverages')
    @ApiOperation({ summary: 'Find all breverages' })
    @ApiOkResponse({ description: 'Find all breverages' })
    async findAllBreverages() {
        const products = await this.productsService.findAllBreverages();
        if (!products) {
            throw new NotFoundException('No breverages');
        }
        return products;
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Find one product' })
    @ApiOkResponse({ description: 'Found the product' })
    @ApiBadRequestResponse({ description: 'Invalid ID' })
    @ApiNotFoundResponse({ description: 'Product not found' })
    async findOne(@Param('id') id: number) {
        const product = await this.productsService.findOne(+id);
        const user={ id:1, name:'test'};
        await this.cacheService.setStudentCard('test-key', user, 1000);
        const result = await this.cacheService.getStudentCard('test-key');
        console.log(result);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a product' })
    @ApiOkResponse({ description: 'Product was updated' })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    @ApiNotFoundResponse({ description: 'Product not found' })
    async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
        const product = await this.productsService.findOne(+id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return this.productsService.update(+id, updateProductDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove a product' })
    @ApiOkResponse({ description: 'Product was removed' })
    @ApiBadRequestResponse({ description: 'Invalid ID' })
    @ApiNotFoundResponse({ description: 'Product not found' })
    async remove(@Param('id') id: string) {
        const product = await this.productsService.findOne(+id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return this.productsService.remove(+id);
    }
}
