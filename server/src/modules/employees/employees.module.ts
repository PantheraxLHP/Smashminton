import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NodemailerModule } from '../nodemailer/nodemailer.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [PrismaModule,NodemailerModule],
  exports: [EmployeesService],
})
export class EmployeesModule {}
