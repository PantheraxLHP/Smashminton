import { Module } from '@nestjs/common';
import { ShiftDateService } from './shift_date.service';
import { ShiftDateController } from './shift_date.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  controllers: [ShiftDateController],
  providers: [ShiftDateService],
  imports: [PrismaModule, EmployeesModule],
  exports: [ShiftDateService],
})
export class ShiftDateModule {}
