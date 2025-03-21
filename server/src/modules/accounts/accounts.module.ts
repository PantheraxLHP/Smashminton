import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { Customer } from '../customer/entities/customer.entity';

@Module({
    controllers: [AccountsController],
    providers: [AccountsService],
    imports: [PrismaModule, Customer],
})
export class AccountsModule {}
