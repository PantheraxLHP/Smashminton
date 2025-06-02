import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from 'src/interfaces/pagination.interface';
import { Employee } from 'src/interfaces/employees.interface';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) { }

  async getAllEmployees(page: number = 1, limit: number = 12): Promise<PaginatedResult<Employee[]>> {
    const skip = (page - 1) * limit;

    const employees = await this.prisma.employees.findMany({
      skip: skip,
      take: limit,
      where: {
        accounts: {
          status: 'Active',
        },
      },
      select: {
        // Employee fields
        employeeid: true,
        fingerprintid: true,
        last_week_shift_type: true,
        employee_type: true,
        role: true,
        cccd: true,
        expiry_cccd: true,
        taxcode: true,
        salary: true,

        // Account fields (flatten)
        accounts: {
          select: {
            username: true,
            fullname: true,
            gender: true,
            email: true,
            dob: true,
            phonenumber: true,
            address: true,
            avatarurl: true,
            status: true,
            createdat: true,
          },
        },

        // Relations
        bank_detail: {
          select: {
            bankdetailid: true,
            bankname: true,
            banknumber: true,
            bankholder: true,
          },
          where: {
            active: true, // Chỉ lấy bank details đang active
          }
        },
        reward_records: {
          select: {
            rewardrecordid: true,
            rewarddate: true,
            finalrewardamount: true,
            rewardapplieddate: true,
            rewardruleid: true,
            employeeid: true,
          },
          where: {
            rewarddate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            },
          },
        },

        penalty_records: {
          select: {
            penaltyrecordid: true,
            penaltyruleid: true,
            employeeid: true,
            violationdate: true,
            finalpenaltyamount: true,
            penaltyapplieddate: true,
          },
          where: {
            violationdate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
            },
          }
        },
      },
      orderBy: {
        employeeid: 'asc',
      },
    });

    // Làm phẳng với spread operator
    const flattenedEmployees: any[] = employees.map(employee => {
      const { accounts, ...employeeData } = employee;
      return {
        ...employeeData,
        ...accounts, // Spread tất cả fields từ accounts
      };
    });

    const total = await this.prisma.employees.count();

    const totalPages = Math.ceil(total / limit);

    return {
      data: flattenedEmployees,
      pagination: {
        page: page,
        totalPages: totalPages,
        //hasNext: page < totalPages,
      },
    };
  }

  async getEmployeeRoles(employeeId: number): Promise<string> {
    const employeeRole = await this.prisma.employees.findUnique({
      where: { employeeid: employeeId },
      select: {
        role: true
      },
    });

    if (!employeeRole) {
      return '';
    }

    return employeeRole.role || '';
  }

  async getEmployeeIdNotInArrayId(employeeIdsInShifts: number[]): Promise<any> {
    const employees = await this.prisma.employees.findMany({
      where: {
        employeeid: {
          notIn: employeeIdsInShifts,
        },
      },
      select: {
        employeeid: true,
        employee_type: true,
        accounts: {
          select: {
            fullname: true,
            avatarurl: true,
          },
        },
      },
    });
    return employees;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
