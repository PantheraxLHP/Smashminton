import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query, UseGuards } from '@nestjs/common';
import { RewardRecordsService } from './reward_records.service';
import { CreateRewardRecordDto } from './dto/create-reward_record.dto';
import { UpdateRewardRecordDto } from './dto/update-reward_record.dto';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Public } from 'src/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reward-records')
export class RewardRecordsController {
  constructor(private readonly rewardRecordsService: RewardRecordsService) { }

  @Get('employees')
  @Roles('hr_manager')
  @ApiBearerAuth()
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

  @Get('search-employees-in-reward-records')
  @Roles('hr_manager')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search employees in reward records',
    description: 'Search employees in reward records with advanced query support. Supports format: "accountid-fullname", "accountid", or "fullname".'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the search results.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              rewardrecordid: { type: 'number' },
              rewarddate: { type: 'string', format: 'date-time' },
              rewardrecordstatus: { type: 'string', enum: ['approved', 'pending', 'rejected'] },
              employees: {
                type: 'object',
                properties: {
                  employeeid: { type: 'number' },
                  role: { type: 'string' },
                  employee_type: { type: 'string' },
                  accounts: {
                    type: 'object',
                    properties: {
                      fullname: { type: 'string' },
                      accounttype: { type: 'string' },
                      avatarurl: { type: 'string' }
                    }
                  }
                }
              },
              reward_rules: {
                type: 'object',
                properties: {
                  rewardruleid: { type: 'number' },
                  rewardname: { type: 'string' },
                  rewardvalue: { type: 'number' }
                }
              }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            totalPages: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters provided.'
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Search query. Supports formats: "accountid-fullname" (e.g., "22-User"), "accountid" (e.g., "22"), or "fullname" (e.g., "User"). Returns first 5 results when empty.',
    example: '22-User',
    type: String
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
  async searchEmployeesInRewardRecords(
    @Query('query') query: string = '',
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

    // Validate pageSize
    if (pageSizeNum < 1 || pageSizeNum > 100) {
      throw new BadRequestException('Page size must be between 1 and 100');
    }

    const filters = {
      month: monthNum,
      year: yearNum,
      role: roleArray,
      employee_type: employeeTypeArray,
      rewardrecordstatus: rewardStatusArray,
    };

    return this.rewardRecordsService.searchEmployeesInRewardRecord(query, pageNum, pageSizeNum, filters);
  }

  @Patch('approve')
  @Roles('hr_manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve multiple reward records' })
  @ApiBody({
    schema: {
      type: 'array',
      items: { type: 'number' },
      example: [5, 6, 7]
    }
  })
  async approveRewardRecords(@Body() ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid IDs array');
    }

    const result = await this.rewardRecordsService.approvedReward(ids);

    return result;
  }

  @Patch('reject')
  @Roles('hr_manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject multiple reward records' })
  @ApiBody({
    schema: {
      type: 'array',
      items: { type: 'number' },
      example: [5, 6, 7]
    }
  })
  async rejectRewardRecords(@Body() ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Invalid IDs array');
    }

    const result = await this.rewardRecordsService.rejectedReward(ids);

    return result;
  }

  @Get('reward-rules')
  @Roles('hr_manager')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all reward rules',
    description: 'Retrieve a list of all reward rules available in the system.'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of reward rules.',
  })
  async getAllRewardRules() {
    return this.rewardRecordsService.getAllRewardRules();
  }

  @Post()
  @Roles('hr_manager')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new reward record',
    description: 'Tạo reward record mới cho nhân viên'
  })
  @ApiBody({
    type: CreateRewardRecordDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Reward record created successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async createRewardRecord(@Body() createRewardRecordDto: CreateRewardRecordDto) {
    return this.rewardRecordsService.create(createRewardRecordDto);
  }

  @Patch('update-reward-note')
  @Roles('hr_manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update reward note' })
  @ApiBody({
    type: UpdateRewardRecordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Reward note updated successfully'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async updateRewardNote(@Body() updateRewardRecordDto: UpdateRewardRecordDto) {
    return this.rewardRecordsService.updateRewardNote(updateRewardRecordDto.rewardrecordid, updateRewardRecordDto.rewardnote);
  }
}
