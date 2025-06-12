import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShiftDateService } from './shift_date.service';
import { CreateShiftDateDto } from './dto/create-shift_date.dto';
import { UpdateShiftDateDto } from './dto/update-shift_date.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UpdateShiftAssignmentDto } from './dto/update-shift_assignment.dto';

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
    name: 'shiftdate',
    required: true,
    description: 'Date in format YYYY-MM-DD',
    example: '2025-06-25',
  })
  @ApiQuery({
    name: 'shiftid',
    required: true,
    description: 'Shift ID to filter employees not in this shift',
    example: 3,
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
    @Query('shiftdate') shiftdate: string,
    @Query('shiftid') shiftid: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.shiftDateService.getEmployeesNotInShift(shiftdate,  +shiftid, +page, +pageSize);
  }

  @Patch('update-shift-assignment')
  @ApiOperation({ summary: 'Update shift assignment status' })
  @ApiBody({ type: UpdateShiftAssignmentDto })
  @ApiResponse({
    status: 200,
    description: 'Update shift assignment status successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async updateShiftAssignment(
    @Body() updateShiftAssignmentDto: UpdateShiftAssignmentDto
  ) {
    return this.shiftDateService.updateShiftEnrollment(updateShiftAssignmentDto);
  }
}
