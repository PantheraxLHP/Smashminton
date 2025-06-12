import { Injectable } from '@nestjs/common';
import { CreateShiftDateDto } from './dto/create-shift_date.dto';
import { UpdateShiftDateDto } from './dto/update-shift_date.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeesService } from '../employees/employees.service';
import { UpdateShiftAssignmentDto } from './dto/update-shift_assignment.dto';

@Injectable()
export class ShiftDateService {
  constructor(
    private prisma: PrismaService,
    private employeesService: EmployeesService,
  ) { }
  getShiftDateByDayFromDayTo(dayfrom: string, dayto: string, employee_type: string) {
    const dayFromDate = new Date(dayfrom + 'T00:00:00');
    const dayToDate = new Date(dayto + 'T23:59:59');

    // Xác định shiftid cần lấy theo loại nhân viên
    let shiftIds: number[] = [];
    if (employee_type === 'Full-time') {
      shiftIds = [1, 2];
    } else if (employee_type === 'Part-time') {
      shiftIds = [3, 4, 5, 6];
    }

    return this.prisma.shift_date.findMany({
      where: {
        shiftdate: {
          gte: dayFromDate,
          lte: dayToDate,
        },
        shiftid: {
          in: shiftIds,
        },
      },
      select: {
        shiftid: true,
        shiftdate: true,
        shift: {
          select: {
            shiftstarthour: true,
            shiftendhour: true,
          },
        },
        shift_assignment: {
          select: {
            assignmentstatus: true,
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
    })
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

  async getEmployeesNotInShift(shiftdate: string, shiftid: number, page: number = 1, pageSize: number = 6) {
    // Lấy shift để lấy starttime và endtime
    const shift = await this.prisma.shift.findUnique({
      where: { shiftid },
      select: {
        shifttype: true
      },
    });
    const employee_type = shift?.shifttype ?? 'Full-time';
    const shiftdate_utc = new Date(shiftdate);

    // Lấy danh sách employeeid đã có trong shift_assignment
    const employeesInShifts = await this.prisma.shift_date.findMany({
      where: {
        shiftid: shiftid,
        shiftdate: shiftdate_utc,
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

    // Tìm tất cả các employee không có trong danh sách trên
    const employeesNotInShifts = await this.employeesService.getEmployeeIdNotInArrayId(employeeIdsInShifts, employee_type, page, pageSize);
    return employeesNotInShifts;
  }

  async updateShiftEnrollment(updateShiftAssignmentDto: UpdateShiftAssignmentDto) {
    const { employeeid, shiftid, shiftdate, assignmentstatus } = updateShiftAssignmentDto;

    // Cập nhật assignmentstatus cho shift_assignment theo khóa chính (employeeid, shiftid, shiftdate)
    return this.prisma.shift_assignment.update({
      where: {
        employeeid_shiftid_shiftdate: {
          employeeid,
          shiftid,
          shiftdate: new Date(shiftdate),
        },
      },
      data: {
        assignmentstatus,
      },
    });
  }

  async addEmployeeToShiftAssignment(shiftid: number, shiftdate: string, employeeid: number) {
    // Kiểm tra xem đã có bản ghi nào với employeeid, shiftid, shiftdate chưa
    const existingAssignment = await this.prisma.shift_assignment.findUnique({
      where: {
        employeeid_shiftid_shiftdate: {
          employeeid,
          shiftid,
          shiftdate: new Date(shiftdate),
        },
      },
    });

    if (existingAssignment) {
      // Nếu đã có, trả về thông báo hoặc xử lý theo yêu cầu
      return { message: 'Employee is already assigned to this shift.' };
    }

    // Nếu chưa có, thêm mới bản ghi
    return this.prisma.shift_assignment.create({
      data: {
        employeeid,
        shiftid,
        shiftdate: new Date(shiftdate),
        assignmentstatus: 'approved',
      },
    });
  }

  removeEmployeeFromShiftAssignment(shiftid: number, shiftdate: string, employeeid: number) {
    // Xóa bản ghi shift_assignment theo khóa chính (employeeid, shiftid, shiftdate)
    return this.prisma.shift_assignment.delete({
      where: {
        employeeid_shiftid_shiftdate: {
          employeeid,
          shiftid,
          shiftdate: new Date(shiftdate),
        },
      },
    });
  }

  async searchEmployees(query: string, employee_type?: string, page: number = 1, pageSize: number = 6) {
    const where: any = {};

    // Lọc theo loại nhân viên nếu có
    if (employee_type) {
      where.employee_type = employee_type;
    }

    // Xử lý query
    query = query.trim();
    let idPart: number | undefined;
    let namePart: string | undefined;

    // Trường hợp: "2", "2-", "2-Hoang", "2 Hoang"
    const match = query.match(/^(\d+)[-\s]?(.*)$/);
    if (match) {
      idPart = parseInt(match[1], 10);
      namePart = match[2]?.trim();
      if (namePart) {
        // Tìm theo id và tên
        where.AND = [
          { employeeid: idPart },
          { accounts: { fullname: { contains: namePart, mode: 'insensitive' } } }
        ];
      } else {
        // Chỉ id
        where.employeeid = idPart;
      }
    } else if (query.startsWith('-')) {
      // Trường hợp: "-Hoang"
      namePart = query.slice(1).trim();
      where.accounts = { fullname: { contains: namePart, mode: 'insensitive' } };
    } else {
      // Trường hợp: "Hoang", "Hoang Duc"
      namePart = query;
      where.accounts = { fullname: { contains: namePart, mode: 'insensitive' } };
    }

    // Phân trang
    const skip = (page - 1) * pageSize;
    const employees = await this.prisma.employees.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { employeeid: 'asc' }
    });

    return employees;
  }
}
