import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierWithProductsDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) { }

  @Post('new-supplier')
  @ApiOperation({ summary: 'Create new supplier with productid + costprice' })
  create(@Body() dto: CreateSupplierWithProductsDto) {
    return this.suppliersService.createSupplierWithProducts(dto);
  }

  @Get('all-suppliers')
  @ApiOperation({ summary: 'Get all suppliers' })
  findAll(@Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '12',) {

    const pageNumber = parseInt(page) || 1;
    const pageSizeNumber = parseInt(pageSize) || 12;
    // Validation
    if (pageNumber < 1) {
      throw new Error('Page number must be greater than 0');
    }
    if (pageSizeNumber < 1 || pageSizeNumber > 100) {
      throw new Error('Page size must be between 1 and 100');
    }

    return this.suppliersService.findAll(pageNumber, pageSizeNumber);
  }

  @Get(':productid/suppliers')
  @ApiOperation({ summary: 'Find supplierid, suppliername, costprice' })
  getSuppliersByProduct(@Param('productid') productid: string) {
    return this.suppliersService.findSuppliersByProduct(+productid);
  }

  @Patch(':supplierid')
  @ApiOperation({ summary: 'Update supplier & update/insert costprice' })
  // @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update supplier & update/insert costprice',
    type: UpdateSupplierDto,
  })
  update(@Param('supplierid') supplierid: number,
    @Body() updateSupplierDto: UpdateSupplierDto,) {
    return this.suppliersService.update(+supplierid, updateSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá supplier theo ID' })
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }
}
