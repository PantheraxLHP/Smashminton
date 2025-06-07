import { Injectable } from '@nestjs/common';
import { CreateRewardRecordDto } from './dto/create-reward_record.dto';
import { UpdateRewardRecordDto } from './dto/update-reward_record.dto';
import { Prisma } from '@prisma/client';
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
}
