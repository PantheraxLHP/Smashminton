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
  @ApiQuery({
    name: 'employee_type',
    required: false,
    type: String,
    example: 'Full-time'
  })
  getShiftDateByDayFromDayToForHrManager(
    @Query('dayfrom') dayfrom: string,
    @Query('dayto') dayto: string,
    @Query('employee_type') employee_type: string,
  ) {
    return this.shiftDateService.getShiftDateByDayFromDayTo(dayfrom, dayto, employee_type);
  }

  @Get('shift-assignment/:employeeid')
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
    name: 'date',
    required: true,
    description: 'Date in format YYYY-MM-DD',
    example: '2025-05-25',
  })
  @ApiQuery({
    name: 'starttime',
    required: true,
    description: 'Start time in format HH:MM',
    example: '06:00',
  })
  @ApiQuery({
    name: 'endtime',
    required: true,
    description: 'End time in format HH:MM',
    example: '10:00',
  })
  @ApiQuery({
    name: 'employee_type',
    required: false,
    description: 'Type of employee to filter',
    example: 'Full-time',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
    example: 6,
  })
  getEmployeesNotInShift(
    @Query('date') date: string,
    @Query('starttime') starttime: string,
    @Query('endtime') endtime: string,
    @Query('employee_type') employee_type: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.shiftDateService.getEmployeesNotInShift(date, starttime, endtime, employee_type, +page, +pageSize);
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
