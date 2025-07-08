import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductBatchService } from './product_batch.service';
import { CreateProductBatchDto } from './dto/create-product_batch.dto';
import { UpdateProductBatchDto } from './dto/update-product_batch.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('product-batch')
export class ProductBatchController {
  constructor(private readonly productBatchService: ProductBatchService) { }

  @Patch('decrease-stock')
  @ApiOperation({ summary: 'Decrease stock quantity of product_batch' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productid: { type: 'number', example: 10 },
        quantity: { type: 'number', example: 2 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Decrease stock successfully' })
  @ApiResponse({ status: 400, description: 'Not enough stock or invalid data' })
  async decreaseStockQuantity(
    @Body() body: { productid: number; quantity: number }
  ) {
    const { productid, quantity } = body;
    return this.productBatchService.decreaseStockQuantity(productid, quantity);
  }

  @Patch('batch/update-all-status')
  @ApiOperation({ summary: 'Quét toàn bộ batch và cập nhật statusbatch' })
  updateAllBatchStatus() {
    return this.productBatchService.updateAllBatchStatus();
  }

}
