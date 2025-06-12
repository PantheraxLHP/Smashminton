import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  findAll() {
    return this.suppliersService.findAll();
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
