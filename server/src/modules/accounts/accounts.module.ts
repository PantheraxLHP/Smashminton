import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomerModule } from '../customers/customers.module';
import { EmployeesModule } from '../employees/employees.module';
import { StudentCardModule } from '../student_card/student_card.module';
import { TesseractOcrModule } from '../tesseract-ocr/tesseract-ocr.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CacheModule } from '../cache/cache.module';

@Module({
    controllers: [AccountsController],
    providers: [AccountsService],
    imports: [PrismaModule, CustomerModule, EmployeesModule, StudentCardModule, TesseractOcrModule, CloudinaryModule, CacheModule],
    exports: [AccountsService],
})
export class AccountsModule {}
