import { Module } from '@nestjs/common';
import { CustomerService } from './customers.service';
import { CustomerController } from './customers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    controllers: [CustomerController],
    providers: [CustomerService],
    imports: [PrismaModule],
    exports: [CustomerService],
})
export class CustomerModule {}
