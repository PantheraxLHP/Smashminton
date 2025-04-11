import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prismaService: PrismaService) {}

  async getEmployeeRoles(employeeId: number): Promise<string> {
    const employeeRole = await this.prismaService.employees.findUnique({
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
