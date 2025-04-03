import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerService } from '../customers/customers.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { EmployeesService } from '../employees/employees.service';
@Injectable()
export class AccountsService {
    constructor(
        private prisma: PrismaService,
        private customerService: CustomerService,
        private employeeService: EmployeesService, // Assuming you have an EmployeesModule
    ) {}

    //CRUD operations
    async createCustomer(createAccountDto: CreateAccountDto) {
        const data = createAccountDto;

        // Check username existed
        const user = await this.prisma.accounts.findFirst({
            where: { username: data.username },
        });
        if (user) {
            throw new BadRequestException('Username already existed');
        }
        // Check repassword
        if (data.password !== data.repassword) {
            throw new BadRequestException('Password not match');
        }

        // Hash password
        const password: string = data.password;
        const hashPassword = await bcrypt.hash(password, 10);
        const account = await this.prisma.accounts.create({
            data: {
                username: data.username,
                password: hashPassword,
                fullname: data.fullname,
                dob: data.dob,
                phonenumber: data.phonenumber,
                address: data.address,
                status: 'Active',
                accounttype: data.accounttype,
            },
        });
        const customer = await this.customerService.create(account.accountid);
        return { account, customer };
    }

    findAll() {
        return this.prisma.accounts.findMany();
    }

    findOne(id: number) {
        return this.prisma.accounts.findUnique({ where: { accountid: id } });
    }

    findByUsername(username: string) {
        return this.prisma.accounts.findFirst({
            where: { username: username },
        });
    }
    findRoleByEmployeeId(employeeId: number) {
        return this.employeeService.getEmployeeRoles(employeeId);
    }
    update(id: number, updateAccountDto: UpdateAccountDto) {
        return this.prisma.accounts.update({
            where: { accountid: id },
            data: updateAccountDto,
        });
    }

    remove(id: number) {
        return this.prisma.accounts.delete({ where: { accountid: id } });
    }
}
