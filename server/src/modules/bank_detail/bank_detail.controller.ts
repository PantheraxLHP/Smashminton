import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankDetailService } from './bank_detail.service';
import { CreateBankDetailDto } from './dto/create-bank_detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank_detail.dto';

@Controller('bank-detail')
export class BankDetailController {
  constructor(private readonly bankDetailService: BankDetailService) {}

  @Post()
  create(@Body() createBankDetailDto: CreateBankDetailDto) {
    return this.bankDetailService.create(createBankDetailDto);
  }

  // @Get()
  // findAll() {
  //   return this.bankDetailService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bankDetailService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBankDetailDto: UpdateBankDetailDto) {
  //   return this.bankDetailService.update(+id, updateBankDetailDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.bankDetailService.remove(+id);
  // }
}
