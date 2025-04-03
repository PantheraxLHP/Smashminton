import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prismaService: PrismaService) {}

  async getEmployeeRoles(employeeId: number): Promise<string> {
    const employee = await this.prismaService.employees.findUnique({
      where: { employeeid: employeeId },
      select: {
        roles: {
          select: {
            rolename: true,
          },
        },
      },
    });
  
    // Kiểm tra nếu không tìm thấy nhân viên hoặc không có vai trò
    if (!employee || !employee.roles) {
      return '';
    }
  
    // Trích xuất danh sách rolename và nối thành chuỗi
    const roleNames = employee.roles ? employee.roles.rolename || '' : '';
    return roleNames;
  }


  create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new employee';
  }

  findAll() {
    return `This action returns all employees`;
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
