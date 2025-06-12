import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShiftDateService } from './shift_date.service';
import { CreateShiftDateDto } from './dto/create-shift_date.dto';
import { UpdateShiftDateDto } from './dto/update-shift_date.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UpdateShiftAssignmentDto } from './dto/update-shift_assignment.dto';
import { CreateShiftAssignmentDto } from './dto/create-shift_assignment.dto';

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
    return this.shiftDateService.getEmployeesNotInShift(shiftdate, +shiftid, +page, +pageSize);
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

  @Post('assignment/add')
  @ApiBody({ type: CreateShiftAssignmentDto })
  async addEmployeeToShiftAssignment(@Body() body: CreateShiftAssignmentDto) {
    const { shiftid, shiftdate, employeeid } = body;
    return this.shiftDateService.addEmployeeToShiftAssignment(shiftid, shiftdate, employeeid);
  }

  @Delete('assignment/remove')
  @ApiBody({ type: CreateShiftAssignmentDto })
  async removeEmployeeFromShiftAssignment(@Body() body: CreateShiftAssignmentDto) {
    const { shiftid, shiftdate, employeeid } = body;
    return this.shiftDateService.removeEmployeeFromShiftAssignment(shiftid, shiftdate, employeeid);
  }
  @Get('search-employees-not-in-shift')
  @ApiQuery({
    name: 'shiftdate',
    required: true,
    description: 'Ngày ca làm việc (YYYY-MM-DD)',
    example: '2025-06-25',
  })
  @ApiQuery({
    name: 'shiftid',
    required: true,
    description: 'ID ca làm việc',
    example: 3,
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Tìm kiếm theo tên (fullname)',
    example: 'Hoang',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Số lượng mỗi trang',
    example: 10,
    type: Number,
  })
  @ApiOperation({ summary: 'Search employees not in shift (with pagination)' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách nhân viên chưa có trong ca, có thể lọc theo tên, có phân trang',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              employeeid: { type: 'number', example: 4 },
              employee_type: { type: 'string', example: 'Full-time' },
              accounts: {
                type: 'object',
                properties: {
                  fullname: { type: 'string', example: 'Nguyễn Văn D' },
                  avatarurl: { type: 'string', example: 'avatar4.jpg' }
                }
              }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            pageSize: { type: 'number', example: 10 },
            total: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 3 },
            hasNextPage: { type: 'boolean', example: true },
            hasPreviousPage: { type: 'boolean', example: false }
          }
        }
      }
    }
  })
  async searchEmployeesNotInShift(
    @Query('shiftdate') shiftdate: string,
    @Query('shiftid') shiftid: number,
    @Query('q') q?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.shiftDateService.searchEmployeesNotInShift(
      shiftdate,
      +shiftid,
      q || '',
      +page,
      +pageSize
    );
  }
}
