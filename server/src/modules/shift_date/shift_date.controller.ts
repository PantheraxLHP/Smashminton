import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShiftDateService } from './shift_date.service';
import { CreateShiftDateDto } from './dto/create-shift_date.dto';
import { UpdateShiftDateDto } from './dto/update-shift_date.dto';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('shift-date')
export class ShiftDateController {
  constructor(private readonly shiftDateService: ShiftDateService) { }

  @Get()
  @ApiQuery({
    name: 'dayfrom',
    required: true,
    description: 'Start date in format YYYY-MM-DD',
    example: '2025-05-25',
  })
  @ApiQuery({
    name: 'dayto',
    required: true,
    description: 'End date in format YYYY-MM-DD',
    example: '2025-05-30',
  })
  getShiftDateByDayFromDayToForHrManager(
    @Query('dayfrom') dayfrom: string,
    @Query('dayto') dayto: string,
  ) {
    return this.shiftDateService.getShiftDateByDayFromDayTo(dayfrom, dayto);
  }

  @Get(':employeeid')
  @ApiParam({
    name: 'employeeid',
    required: true,
    description: 'Employee ID to filter shifts',
    example: 123,
  })
  @ApiQuery({
    name: 'dayfrom',
    required: true,
    description: 'Start date in format YYYY-MM-DD',
    example: '2025-05-25',
  })
  @ApiQuery({
    name: 'dayto',
    required: true,
    description: 'End date in format YYYY-MM-DD',
    example: '2025-05-30',
  })
  getShiftDateByDayFromDayToByEmployee(
    @Param('employeeid') employeeid: number,
    @Query('dayfrom') dayfrom: string,
    @Query('dayto') dayto: string,
  ) {
    return this.shiftDateService.getShiftDateByDayFromDayToByEmployee(dayfrom, dayto, +employeeid);
  }

  @Get('employees-not-in-shift')
  @ApiQuery({
    name: 'dayfrom',
    required: true,
    description: 'Start date in format YYYY-MM-DD',
    example: '2025-05-25',
  })
  @ApiQuery({
    name: 'dayto',
    required: true,
    description: 'End date in format YYYY-MM-DD',
    example: '2025-05-30',
  })
  getEmployeesNotInShift(
    @Query('dayfrom') dayfrom: string,
    @Query('dayto') dayto: string,
  ) {
    return this.shiftDateService.getEmployeesNotInShift(dayfrom, dayto);
  }

  @Post()
  create(@Body() createShiftDateDto: CreateShiftDateDto) {
    return this.shiftDateService.create(createShiftDateDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shiftDateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShiftDateDto: UpdateShiftDateDto) {
    return this.shiftDateService.update(+id, updateShiftDateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shiftDateService.remove(+id);
  }
}
