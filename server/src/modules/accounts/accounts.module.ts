import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomerModule } from '../customers/customer.module';

@Module({
    controllers: [AccountsController],
    providers: [AccountsService],
    imports: [PrismaModule, CustomerModule],
})
export class AccountsModule {}
