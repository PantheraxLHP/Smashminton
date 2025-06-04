import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NodemailerModule } from '../nodemailer/nodemailer.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [PrismaModule,NodemailerModule,CloudinaryModule],
  exports: [EmployeesService],
})
export class EmployeesModule {}
