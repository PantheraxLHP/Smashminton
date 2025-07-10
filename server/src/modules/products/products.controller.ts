import { Controller, Get, Post, Body, Query, Param, UploadedFile, UseInterceptors, Patch, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductServiceDto } from './dto/update-product.dto';
import { UpdateFoodAccessoryDto } from './dto/update-product.dto';
import { UpdateFoodAccessoryWithoutBatchDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CacheService } from '../cache/cache.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly cacheService: CacheService,
    ) { }

    @Post('new-product')
    @Roles('wh_manager')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new product with value + productfilterid' })
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
        @Query('value') _value: string,
        @Query('productfilterid') productfilterid: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        const _productfilterid = +productfilterid; // Ép kiểu number
        return this.productsService.create(createProductDto, file, _value, _productfilterid);
    }

    @Get('all-products')
    @Roles('wh_manager')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all products' })
    getAllBasicProducts() {
        return this.productsService.findAllBasicProducts();
    }

    @Get('all-products-with-batches')
    @ApiOperation({ summary: 'Get all products with batches' })
    @Roles('wh_manager')
    @ApiBearerAuth()
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

    @Patch(':id/update-services')
    @Roles('wh_manager')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update product-services' })
    @ApiConsumes('multipart/form-data')
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
    updateProductService(
        @Param('id') productid: string,
        @Body() body: UpdateProductServiceDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.productsService.updateProductService(+productid, body, file);
    }


    @Patch('update-food-acccessory/:productid/:batchid')
    @Roles('wh_manager')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update food and accessory with discount (optional)'})
    @ApiConsumes('multipart/form-data')
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
    updateFoodAccessory(
        @Param('productid') productid: string,
        @Param('batchid') batchid: string,
        @Body() body: UpdateFoodAccessoryDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.productsService.updateFoodAccessory(+productid, +batchid, body, file);
    }

    @Patch('update-food-acccessory-without-batch/:productid')
    @Roles('wh_manager')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update food and accessory without batch' })
    @ApiConsumes('multipart/form-data')
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
    updateFoodAccessoryWithoutBatch(
        @Param('productid') productid: string,
        @Body() body: UpdateFoodAccessoryWithoutBatchDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.productsService.updateFoodAccessoryWithoutBatch(+productid, body, file);
    }

    @Patch('delete-product/:productid')
    @Roles('wh_manager')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete product (set isdeleted=true)' })
    deleteProduct(@Param('productid') productid: number) {
        return this.productsService.deleteProduct(+productid);
    }
}
