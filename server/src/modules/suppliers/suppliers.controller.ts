import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) { }

  @Post('new-supplier')
  @ApiOperation({ summary: 'Create a supplier' })
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.createSupplierWithProducts(createSupplierDto);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update supplier' })
  // @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update supplier data',
    type: UpdateSupplierDto,
  })
  update(@Param('id') id: number, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá supplier theo ID' })
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }
}
