import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query } from '@nestjs/common';
import { RewardRecordsService } from './reward_records.service';
import { CreateRewardRecordDto } from './dto/create-reward_record.dto';
import { UpdateRewardRecordDto } from './dto/update-reward_record.dto';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@Controller('reward-records')
export class RewardRecordsController {
  constructor(private readonly rewardRecordsService: RewardRecordsService) { }

  @Get('employees')
  @ApiOperation({
    summary: 'Get employees in reward records',
    description: 'Retrieve a paginated list of employees who have received rewards with filters.'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of employees in reward records.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters provided.'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    type: Number
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Số lượng items mỗi trang',
    example: 12,
    type: Number
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Lọc theo tháng (1-12)',
    example: 6,
    type: Number
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Lọc theo năm',
    example: 2025,
    type: Number
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Lọc theo vai trò (có thể truyền nhiều giá trị)',
    type: String,
    isArray: true,
    example: ['employee', 'wh_manager', 'hr_manager']
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
    name: 'rewardrecordstatus',
    required: false,
    description: 'Lọc theo trạng thái reward record (có thể truyền nhiều giá trị)',
    type: String,
    isArray: true,
    example: ['approved', 'pending', 'rejected']
  })
  async getEmployeesInRewardRecords(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '12',
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('role') role?: string | string[],
    @Query('employee_type') employee_type?: string | string[],
    @Query('rewardrecordstatus') rewardrecordstatus?: string | string[]
  ) {
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 12;
    const monthNum = month ? parseInt(month) : undefined;
    const yearNum = year ? parseInt(year) : undefined;

    // Normalize arrays
    const roleArray = Array.isArray(role) ? role : (role ? [role] : undefined);
    const employeeTypeArray = Array.isArray(employee_type) ? employee_type : (employee_type ? [employee_type] : undefined);
    const rewardStatusArray = Array.isArray(rewardrecordstatus) ? rewardrecordstatus : (rewardrecordstatus ? [rewardrecordstatus] : undefined);

    // Validate month
    if (monthNum && (monthNum < 1 || monthNum > 12)) {
      throw new BadRequestException('Month must be between 1 and 12');
    }

    // Validate year
    if (yearNum && (yearNum < 1900 || yearNum > 2100)) {
      throw new BadRequestException('Invalid year provided');
    }

    const filters = {
      month: monthNum,
      year: yearNum,
      role: roleArray,
      employee_type: employeeTypeArray,
      rewardrecordstatus: rewardStatusArray,
    };

    return this.rewardRecordsService.getEmployeesInRewardRecords(pageNum, pageSizeNum, filters);
  }
}
