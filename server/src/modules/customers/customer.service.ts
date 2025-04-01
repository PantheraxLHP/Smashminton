import { Injectable } from '@nestjs/common';
// import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {
    constructor(private prisma: PrismaService) {}

    //CRUD operations
    create(accountId: number) {
        return this.prisma.customers.create({
            data: { customerid: accountId },
        });
    }

    findAll() {
        return this.prisma.customers.findMany();
    }

    findOne(id: number) {
        return `This action returns a #${id} customer`;
    }

    update(id: number, updateCustomerDto: UpdateCustomerDto) {
        return `This action updates a #${id} customer`;
    }

    remove(id: number) {
        return `This action removes a #${id} customer`;
    }
}
