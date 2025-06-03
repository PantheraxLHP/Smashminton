import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all employees',
    description: 'Retrieve a paginated list of all employees with their account details.'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of employees.',
    type: [CreateEmployeeDto], // Assuming CreateEmployeeDto is the DTO for employee data
    isArray: true
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters provided.'
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    type: Number
  })
  @ApiQuery({
    name: 'pageSize',
    required: true,
    description: 'Số lượng items mỗi trang',
    example: 12,
    type: Number
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Lọc theo vai trò (có thể truyền nhiều giá trị)',
    type: String,
    isArray: true,
    example: ['hr_manager', 'wh_manager']
  })
  @ApiQuery({
    name: 'employee_type',
    required: false,
    description: 'Lọc theo loại nhân viên (có thể truyền nhiều giá trị)',
    type: String,
    isArray: true,
    example: ['Full-time', 'Part-time']
  })
  @ApiQuery({
    name: 'fingerprintid',
    required: false,
    description: 'Lọc theo fingerprintid (có thể truyền nhiều giá trị, ví dụ: 123, 456, null, notnull)',
    type: String,
    isArray: true,
    example: ['null', 'notnull']
  })
  async getAllEmployees(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '12',
    @Query('role') role?: string[] | string,
    @Query('employee_type') employee_type?: string[] | string,
    @Query('fingerprintid') fingerprintid?: string[] | string
  ) {
    const pageNumber = parseInt(page) || 1;
    const pageSizeNumber = parseInt(pageSize) || 12;

    // Đảm bảo các filter là mảng nếu có nhiều giá trị, hoặc undefined nếu không truyền
    const roleArr = Array.isArray(role) ? role : (role ? String(role).split(',') : undefined);
    const employeeTypeArr = Array.isArray(employee_type) ? employee_type : (employee_type ? String(employee_type).split(',') : undefined);
    const fingerprintidArr = Array.isArray(fingerprintid) ? fingerprintid : (fingerprintid ? String(fingerprintid).split(',') : undefined);

    // Validation
    if (pageNumber < 1) {
      throw new Error('Page number must be greater than 0');
    }
    if (pageSizeNumber < 1 || pageSizeNumber > 100) {
      throw new Error('Page size must be between 1 and 100');
    }

    // Truyền filter vào service
    return await this.employeesService.getAllEmployees(
      pageNumber,
      pageSizeNumber,
      {
        role: roleArr,
        employee_type: employeeTypeArr,
        fingerprintid: fingerprintidArr,
      }
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }

  @Post()
  @ApiOperation({
    summary: 'Add new employee',
    description: 'Create a new employee account with automatic username and password generation'
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo nhân viên thành công',
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ hoặc username/email đã tồn tại'
  })
  async addEmployee(@Body() addEmployeeDto: AddEmployeeDto) {
    try {
      const result = await this.employeesService.addEmployee(addEmployeeDto);

      return {
        success: true,
        message: 'Tạo nhân viên thành công',
        data: {
          employeeid: result.employee.employeeid,
          username: result.account.username,
          fullname: result.account.fullname,
          email: result.account.email,
          role: result.employee.role,
        }
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
