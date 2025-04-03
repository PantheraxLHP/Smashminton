import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomerModule } from '../customers/customers.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
    controllers: [AccountsController],
    providers: [AccountsService],
    imports: [PrismaModule, CustomerModule, EmployeesModule],
    exports: [AccountsService],
})
export class AccountsModule {}
