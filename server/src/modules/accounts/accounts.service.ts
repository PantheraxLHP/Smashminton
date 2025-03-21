import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
    constructor(private prisma: PrismaService) {}

    //CRUD operations
    create(createAccountDto: CreateAccountDto) {
        return this.prisma.accounts.create({ data: createAccountDto });
    }

    findAll() {
        return this.prisma.accounts.findMany();
    }

    findOne(id: number) {
        return this.prisma.accounts.findUnique({ where: { accountid: id } });
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
