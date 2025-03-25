import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    controllers: [CustomerController],
    providers: [CustomerService],
    imports: [PrismaModule],
    exports: [CustomerService]
})
export class CustomerModule {}
