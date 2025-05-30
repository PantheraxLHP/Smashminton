import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { addProductOrderDto, cacheOrderDTO, deleteProductOrderDto } from './dto/create-cache-order.dto';
import { CacheOrder } from 'src/interfaces/orders.interface';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new booking' })
    @ApiBody({ type: CreateOrderDto })
    @ApiResponse({ status: 201, description: 'Booking created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.addOrderToDatabase(createOrderDto);
    }

    @Post('cache-order')
    @ApiOperation({ summary: 'Add order to redis' })
    @ApiBody({ type: addProductOrderDto })
    @ApiResponse({ status: 201, description: 'Add successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async addOrderToCache(@Body() addProductOrderDto: addProductOrderDto): Promise<CacheOrder> {
        return this.ordersService.addOrderToCache(addProductOrderDto);
    }

    @Get('cache-order')
    @ApiOperation({ summary: 'Get order from redis' })
    @ApiQuery({ name: 'username', type: String, example: 'nguyenvun', description: 'Tên người dùng' })
    @ApiResponse({ status: 200, description: 'Get successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async getOrderFromCache(@Query('username') username: string): Promise<CacheOrder> {
        return this.ordersService.getOrderFromCache(username);
    }

    @Delete('cache-order')
    @ApiOperation({ summary: 'Delete product order from redis' })
    @ApiBody({ type: deleteProductOrderDto })
    @ApiResponse({ status: 200, description: 'Delete successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async deleteOrderFromCache(@Body() deleteProductOrderDto: deleteProductOrderDto): Promise<CacheOrder> {
        const { username, productid } = deleteProductOrderDto;
        return this.ordersService.removeProductOrderFromCache(username, productid);
    }

    @Delete('remove-rental-products/:username')
    @ApiOperation({
        summary: 'Delete all rental products from user order cache',
        description: 'Delete all rental products from user order cache by username',
    })
    @ApiParam({
        name: 'username',
        example: 'nguyenvun',
    })
    @ApiResponse({ status: 200, description: 'All rental products removed successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiParam({
        name: 'username',
        example: 'nguyenvun'
    })
    async removeAllRentalProducts(@Param('username') username: string): Promise<CacheOrder> {
        return this.ordersService.removeAllRentalProductsInOrder(username);
    }
}

