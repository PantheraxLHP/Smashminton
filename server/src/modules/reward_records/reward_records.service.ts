import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRewardRecordDto } from './dto/create-reward_record.dto';
import { UpdateRewardRecordDto } from './dto/update-reward_record.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from 'src/interfaces/pagination.interface';

@Injectable()
export class RewardRecordsService {
  constructor(
    private prisma: PrismaService,
  ) { }
  async getEmployeesInRewardRecords(
    page: number = 1,
    pageSize: number = 12,
    filters?: {
      month?: number;
      year?: number;
      role?: string[];
      employee_type?: string[];
      rewardrecordstatus?: string[];
    }
  ): Promise<PaginatedResult<any>> {
    const skip = (page - 1) * pageSize;

    // Xây dựng điều kiện where động
    const whereCondition: any = {
      employees: {
        accounts: {
          status: 'Active'
        },
        AND: [
          // Luôn loại bỏ admin
          {
            role: { not: 'admin' }
          }
        ]
      }
    };

    // Filter theo tháng và năm
    if (filters?.month || filters?.year) {
      const currentDate = new Date();
      const filterMonth = filters.month || (currentDate.getMonth() + 1);
      const filterYear = filters.year || currentDate.getFullYear();

      whereCondition.rewarddate = {
        gte: new Date(filterYear, filterMonth - 1, 1), // Đầu tháng
        lt: new Date(filterYear, filterMonth, 1), // Đầu tháng tiếp theo
      };
    }

    // Filter theo role (có thể chọn nhiều) - nhưng vẫn loại bỏ admin
    if (filters?.role && filters.role.length > 0) {
      const nonAdminRoles = filters.role.filter(role => role !== 'admin');

      if (nonAdminRoles.length > 0) {
        whereCondition.employees.AND.push({
          role: { in: nonAdminRoles }
        });
      }
    }

    // Filter theo employee_type (có thể chọn nhiều)
    if (filters?.employee_type && filters.employee_type.length > 0) {
      whereCondition.employees.employee_type = { in: filters.employee_type };
    }

    // Filter theo rewardrecordstatus (có thể chọn nhiều)
    if (filters?.rewardrecordstatus && filters.rewardrecordstatus.length > 0) {
      whereCondition.rewardrecordstatus = { in: filters.rewardrecordstatus };
    }

    // Query với phân trang và filter
    const employees_reward_records = await this.prisma.reward_records.findMany({
      skip: skip,
      take: pageSize,
      where: whereCondition,
      include: {
        employees: {
          select: {
            employeeid: true,
            role: true,
            employee_type: true,
            accounts: {
              select: {
                fullname: true,
                accounttype: true,
                avatarurl: true,
              },
            }
          }
        },
        reward_rules: true,
      },
      orderBy: {
        rewarddate: 'desc'
      }
    });

    // Đếm tổng số records với cùng điều kiện filter
    const total = await this.prisma.reward_records.count({
      where: whereCondition
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: employees_reward_records,
      pagination: {
        page: page,
        totalPages: totalPages,
      },
    };
  }

  async searchEmployeesInRewardRecord(
    query: string = '',
    page: number = 1,
    pageSize: number = 12,
    filters?: {
      month?: number;
      year?: number;
      role?: string[];
      employee_type?: string[];
      rewardrecordstatus?: string[];
    }
  ): Promise<PaginatedResult<any>> {
    // Xây dựng điều kiện where động
    const whereCondition: any = {};

    // Filter theo employee (thông qua relation)
    const employeeCondition: any = {
      accounts: {
        status: 'Active'
      },
      role: { not: 'admin' }
    };

    // Xử lý search query theo format 'accountid-fullname'
    if (query && query.trim()) {
      const trimmedQuery = query.trim();
      let accountId: number | undefined;
      let namePart: string | undefined;

      if (trimmedQuery.includes('-')) {
        // Trường hợp có dấu gạch: "5-Nguyen" hoặc "5-Nguyen Van A"
        const parts = trimmedQuery.split('-', 2);
        const leftPart = parts[0].trim();
        const rightPart = parts[1] ? parts[1].trim() : '';

        // Kiểm tra phần trái có phải số không
        if (leftPart && !isNaN(parseInt(leftPart))) {
          accountId = parseInt(leftPart);
        }

        // Phần phải là tên
        if (rightPart) {
          namePart = rightPart;
        } else if (leftPart && isNaN(parseInt(leftPart))) {
          namePart = leftPart;
        }

        // Xử lý điều kiện search
        if (accountId !== undefined && namePart) {
          // Có cả accountid và fullname: tìm chính xác
          employeeCondition.AND = [
            { employeeid: accountId },
            { accounts: { ...employeeCondition.accounts, fullname: { contains: namePart, mode: 'insensitive' } } }
          ];
        } else if (accountId !== undefined && !namePart) {
          // Chỉ có accountid
          employeeCondition.employeeid = accountId;
        } else if (!accountId && namePart) {
          // Chỉ có fullname
          employeeCondition.accounts = {
            ...employeeCondition.accounts,
            fullname: { contains: namePart, mode: 'insensitive' }
          };
        }
      } else {
        // Không có dấu gạch: có thể là accountid hoặc fullname
        if (/^\d+$/.test(trimmedQuery)) {
          // Là số: tìm theo accountid
          employeeCondition.employeeid = parseInt(trimmedQuery);
        } else {
          // Là text: tìm theo fullname
          employeeCondition.accounts = {
            ...employeeCondition.accounts,
            fullname: { contains: trimmedQuery, mode: 'insensitive' }
          };
        }
      }
    }

    // Filter theo role (có thể chọn nhiều) - nhưng vẫn loại bỏ admin
    if (filters?.role && filters.role.length > 0) {
      const nonAdminRoles = filters.role.filter(role => role !== 'admin');
      if (nonAdminRoles.length > 0) {
        if (employeeCondition.AND) {
          // Nếu đã có AND condition từ search, thêm role vào
          employeeCondition.AND.push({ role: { in: nonAdminRoles } });
        } else {
          employeeCondition.role = { in: nonAdminRoles };
        }
      }
    }

    // Filter theo employee_type
    if (filters?.employee_type && filters.employee_type.length > 0) {
      if (employeeCondition.AND) {
        employeeCondition.AND.push({ employee_type: { in: filters.employee_type } });
      } else {
        employeeCondition.employee_type = { in: filters.employee_type };
      }
    }

    // Gán employee condition vào where
    whereCondition.employees = employeeCondition;

    // Filter theo tháng và năm
    if (filters?.month || filters?.year) {
      const currentDate = new Date();
      const filterMonth = filters.month || (currentDate.getMonth() + 1);
      const filterYear = filters.year || currentDate.getFullYear();

      whereCondition.rewardapplieddate = {
        gte: new Date(filterYear, filterMonth - 1, 1),
        lt: new Date(filterYear, filterMonth, 1),
      };
    }

    // Filter theo rewardrecordstatus
    if (filters?.rewardrecordstatus && filters.rewardrecordstatus.length > 0) {
      whereCondition.rewardrecordstatus = { in: filters.rewardrecordstatus };
    }

    // Đếm tổng số bản ghi với filter TRƯỚC KHI query
    const total = await this.prisma.reward_records.count({ where: whereCondition });
    const totalPages = Math.ceil(total / pageSize);

    // Reset page về 1 nếu vượt quá tổng số trang và có kết quả
    if (page > totalPages && totalPages >= 0) {
      page = 1;
    }

    // Tính skip sau khi đã reset page
    const skip = (page - 1) * pageSize;
    console.log(whereCondition);
    // Query với phân trang và filter
    const employees_reward_records = await this.prisma.reward_records.findMany({
      skip: skip,
      take: pageSize,
      where: whereCondition,
      include: {
        employees: {
          select: {
            employeeid: true,
            role: true,
            employee_type: true,
            accounts: {
              select: {
                fullname: true,
                accounttype: true,
                avatarurl: true,
              },
            }
          }
        },
        reward_rules: true,
      },
      orderBy: {
        rewarddate: 'desc'
      }
    });

    return {
      data: employees_reward_records,
      pagination: {
        page: page,
        totalPages: totalPages,
      },
    };
  }

  approvedReward(ids: number[]) {
    return this.prisma.reward_records.updateMany({
      where: {
        rewardrecordid: {
          in: ids
        }
      },
      data: { rewardrecordstatus: 'approved' }
    });
  }

  rejectedReward(ids: number[]) {
    return this.prisma.reward_records.updateMany({
      where: {
        rewardrecordid: {
          in: ids
        }
      },
      data: { rewardrecordstatus: 'rejected' }
    });
  }

  async getAllRewardRules() {
    const rewardRules = await this.prisma.reward_rules.findMany({
      select: {
        rewardruleid: true,
        rewardname: true,
        rewardvalue: true,
      },
      orderBy: {
        rewardruleid: 'asc'
      }
    });

    // Convert rewardvalue to number
    return rewardRules.map(rule => ({
      ...rule,
      rewardvalue: rule.rewardvalue ? Number(rule.rewardvalue) : 0
    }));
  }
  async create(createRewardRecordDto: CreateRewardRecordDto) {
    const rewardRecord = await this.prisma.reward_records.create({
      data: createRewardRecordDto,
    });

    if (!rewardRecord) {
      throw new Error('Failed to create reward record');
    }

    return rewardRecord;
  }

  async updateRewardNote(rewardrecordid: number, rewardnote: string) {
    const status = await this.prisma.reward_records.findUnique({
      where: { rewardrecordid: rewardrecordid },
    });
    if (status && status.rewardrecordstatus !== 'pending') {
      throw new BadRequestException('Reward record is not pending');
    }
    if (!status) {
      throw new BadRequestException('Reward record not found');
    }
    return this.prisma.reward_records.update({
      where: { rewardrecordid: rewardrecordid },
      data: { rewardnote: rewardnote }
    });
  }
}
