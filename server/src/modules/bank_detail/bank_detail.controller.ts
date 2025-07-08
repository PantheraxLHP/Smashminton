import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { BankDetailService } from './bank_detail.service';
import { CreateBankDetailDto } from './dto/create-bank_detail.dto';
import { UpdateBankDetailDto } from './dto/update-bank_detail.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('bank-detail')
export class BankDetailController {
  constructor(private readonly bankDetailService: BankDetailService) { }

  @Post()
  @ApiOperation({
    summary: 'Create new bank detail',
  })
  @ApiBody({
    type: CreateBankDetailDto,
    description: 'Bank detail information to create'
  })
  @ApiResponse({
    status: 201,
    description: 'Bank detail successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or employeeid is not a number'
  })
  async create(@Body() createBankDetailDto: CreateBankDetailDto) {
    const result = await this.bankDetailService.create(createBankDetailDto);
    if (!result) {
      throw new BadRequestException('Invalid input data or employeeid is not a number');
    }
    return result;
  }

  @Get('employee/:employeeid')
  @ApiOperation({
    summary: 'Get all bank details by employee ID',
    description: 'Retrieve all bank details associated with a specific employee'
  })
  @ApiParam({
    name: 'employeeid',
    description: 'Employee ID to get bank details for',
    example: 1,
    type: Number
  })
  @ApiResponse({
    status: 200,
    description: 'Bank details successfully retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'No bank details found for this employee'
  })
  async findAllByEmployeeID(@Param('employeeid') employeeid: number) {
    const bankDetails = await this.bankDetailService.findAllByEmployeeID(Number(employeeid));

    if (bankDetails.length === 0) {
      throw new NotFoundException(`No bank details found for employee ID ${employeeid}`);
    }

    return bankDetails;
  }
  // @Get()
  // findAll() {
  //   return this.bankDetailService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bankDetailService.findOne(+id);
  // }

  @Put(':employeeid')
  @ApiOperation({
    summary: 'Update bank detail by employee ID',
    description: 'Update the bank detail for a specific employee'
  })
  @ApiParam({
    name: 'employeeid',
    description: 'Employee ID to update bank detail for',
    example: 1,
    type: Number
  })
  @ApiBody({
    type: UpdateBankDetailDto,
    description: 'Bank detail information to update'
  })
  @ApiResponse({
    status: 200,
    description: 'Bank detail successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or employeeid is not a number'
  })
  update(@Param('employeeid') employeeid: string, @Body() updateBankDetailDto: UpdateBankDetailDto) {
    return this.bankDetailService.update(+employeeid, updateBankDetailDto);
  }

  @Delete(':employeeid')
  @ApiOperation({
    summary: 'Remove bank detail by employee ID',
    description: 'Deactivate the bank detail for a specific employee'
  })
  @ApiParam({
    name: 'employeeid',
    description: 'Employee ID to remove bank detail for',
    example: 1,
    type: Number
  })
  @ApiBody({
    type: UpdateBankDetailDto,
    description: 'Bank detail information to update before removal'
  })
  @ApiResponse({
    status: 200,
    description: 'Bank detail successfully removed',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or employeeid is not a number'
  })
  remove(@Param('employeeid') employeeid: string, @Body() updateBankDetailDto: UpdateBankDetailDto) {
    return this.bankDetailService.remove(+employeeid, updateBankDetailDto);
  }
}
