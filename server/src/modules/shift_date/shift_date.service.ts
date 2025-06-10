import { Injectable } from '@nestjs/common';
import { CreateShiftDateDto } from './dto/create-shift_date.dto';
import { UpdateShiftDateDto } from './dto/update-shift_date.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class ShiftDateService {
  constructor(
    private prisma: PrismaService,
    private employeesService: EmployeesService,
  ) { }
  getShiftDateByDayFromDayTo(dayfrom: string, dayto: string) {
    const dayFromDate = new Date(dayfrom + 'T00:00:00');
    const dayToDate = new Date(dayto + 'T23:59:59');
    return this.prisma.shift_date.findMany({
      where: {
        shiftdate: {
          gte: dayFromDate,
          lte: dayToDate,
        },
      },
      select: {
        shiftid: true,
        shiftdate: true,
        shift_assignment: {
          select: {
            employees: {
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
            },
          },
        },
      },
    });
  }

  getShiftDateByDayFromDayToByEmployee(dayfrom: string, dayto: string, employeeid: number) {
    const dayFromDate = new Date(dayfrom + 'T00:00:00');
    const dayToDate = new Date(dayto + 'T23:59:59');
    return this.prisma.shift_assignment.findMany({
      where: {
        employeeid: employeeid,
        shiftdate: {
          gte: dayFromDate,
          lte: dayToDate,
        },
      },
    });
  }

  async getEmployeesNotInShift(dayfrom: string, dayto: string, page: number = 1, pageSize: number = 6) {
    const dayFromDate = new Date(dayfrom + 'T00:00:00');
    const dayToDate = new Date(dayto + 'T23:59:59');
    // Lấy danh sách employeeid đã có trong shift_assignment
    const employeesInShifts = await this.prisma.shift_date.findMany({
      where: {
        shiftdate: {
          gte: dayFromDate,
          lte: dayToDate,
        },
      },
      select: {
        shift_assignment: {
          select: {
            employees: {
              select: {
                employeeid: true,
              },
            },
          },
        },
      },
    });

    // Trích xuất danh sách employeeid từ kết quả
    const employeeIdsInShifts = employeesInShifts
      .flatMap((shift) => shift.shift_assignment)
      .flatMap((assignment) => assignment.employees)
      .map((employee) => employee.employeeid);
    console.log('employeeIdsInShifts', employeeIdsInShifts);

    // Tìm tất cả các employee không có trong danh sách trên
    const employeesNotInShifts = await this.employeesService.getEmployeeIdNotInArrayId(employeeIdsInShifts, page, pageSize);

    return employeesNotInShifts;
  }
  create(createShiftDateDto: CreateShiftDateDto) {
    return 'This action adds a new shiftDate';
  }

  findAll() {
    return `This action returns all shiftDate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shiftDate`;
  }

  update(id: number, updateShiftDateDto: UpdateShiftDateDto) {
    return `This action updates a #${id} shiftDate`;
  }

  remove(id: number) {
    return `This action removes a #${id} shiftDate`;
  }
}
