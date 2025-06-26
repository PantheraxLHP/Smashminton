import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { PurchaseOrdersService } from './purchase_orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase_order.dto';
import { UpdateDeliverySuccessfullyDto } from './dto/update-purchase_order.dto';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) { }

  @Post('new-purchase-order')
  @ApiOperation({ summary: 'Create purchase_order attached batch' })
  @ApiBody({
    description: 'Update supplier data',
    type: CreatePurchaseOrderDto,
  })
  create(@Body() dto: CreatePurchaseOrderDto) {
    return this.purchaseOrdersService.createPurchaseOrderWithBatch(dto);
  }

  @Get('all-purchase-orders')
  @ApiOperation({ summary: 'Get all purchase_order' })
  findAllPurchaseOrders(@Query('page') page: string = '1',
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
    return this.purchaseOrdersService.findAllPurchaseOrders(pageNumber, pageSizeNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrdersService.findOne(+id);
  }

  @Patch('successful-delivery/:id')
  @ApiOperation({ summary: 'Confirm purchase_order successfully' })
  @ApiBody({ description: 'fill', type: UpdateDeliverySuccessfullyDto })
  async confirmPurchaseOrderDelivery(
    @Param('id') poid: string,
    @Body() body: UpdateDeliverySuccessfullyDto
  ) {
    return this.purchaseOrdersService.confirmDelivery(+poid, body.realityQuantity, new Date(body.realityExpiryDate));
  }

  @Patch('cancel-purchaseOrder/:poid')
  @ApiOperation({ summary: 'Cancel purchase-order' })
  cancelPurchaseOrder(@Param('poid') poid: number) {
    return this.purchaseOrdersService.cancelPurchaseOrder(+poid);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrdersService.remove(+id);
  }
}
