import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierWithProductsDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';

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
  @ApiQuery({ name: 'q1', required: false, type: String, description: 'Search keyword for suppliername' })
  @ApiQuery({ name: 'q2', required: false, type: String, description: 'Search keyword for productname' })

  findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '12',
    @Query('q1') q1?: string,
    @Query('q2') q2?: string,) {

    const pageNumber = parseInt(page) || 1;
    const pageSizeNumber = parseInt(pageSize) || 12;
    // Validation
    if (pageNumber < 1) {
      throw new Error('Page number must be greater than 0');
    }
    if (pageSizeNumber < 1 || pageSizeNumber > 100) {
      throw new Error('Page size must be between 1 and 100');
    }

    return this.suppliersService.findAll(pageNumber, pageSizeNumber, q1 || '', q2 || '');
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

  @Patch('delete-supplier/:supplierid')
  @ApiOperation({ summary: 'Delete supplier (set isdeleted=true)' })
  deleteProduct(@Param('supplierid') supplierid: number) {
    return this.suppliersService.deleteSupplier(+supplierid);
  }

  @Delete('supply-products')
  @ApiOperation({ summary: 'Delete supply_products' })
  async deleteSupplyProduct(
    @Query('productid') productid: number,
    @Query('supplierid') supplierid: number
  ) {
    return this.suppliersService.deleteSupplyProduct(+productid, +supplierid);
  }
}
