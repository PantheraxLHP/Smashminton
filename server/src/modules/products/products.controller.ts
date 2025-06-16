import { Controller, Get, Post, Body, Query, Param, Delete, Put, NotFoundException, UploadedFile, UseInterceptors, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateRentalPriceDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CacheService } from '../cache/cache.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('products')

export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cacheService: CacheService,
    ) { }

    @Post('new-product')
    @ApiOperation({ summary: 'Create new product with productfiltervalueid' })
    @UseInterceptors(
        FileInterceptor('productimgurl', {
            limits: {
                fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file: 5MB
            },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 201,
        description: 'Product created successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid file or data'
    })
    async create(
        @Body() createProductDto: CreateProductDto,
        @Query('productfiltervalueid') productfiltervalueid: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        const _productfiltervalueid = +productfiltervalueid; // Ép kiểu number
        return this.productsService.create(createProductDto, file, _productfiltervalueid);
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

    @Patch(':id/rental-price')
    @ApiOperation({ summary: 'Update rental price of a product' })
    updateRentalPrice(
        @Param('id') productid: string,
        @Body() body: UpdateRentalPriceDto
    ) {
        return this.productsService.updateRentalPrice(+productid, body.rentalprice);
    }

}
