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

  @Get()
  findAll() {
    return this.productBatchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productBatchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductBatchDto: UpdateProductBatchDto) {
    return this.productBatchService.update(+id, updateProductBatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productBatchService.remove(+id);
  }
}
