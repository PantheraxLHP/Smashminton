import { Module } from '@nestjs/common';
import { AutoAssignmentService } from './auto-assignment.service';
import { AutoAssignmentController } from './auto-assignment.controller';
import { ExcelManipulationService } from './excel-manipulation.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    controllers: [AutoAssignmentController],
    providers: [AutoAssignmentService, ExcelManipulationService],
    exports: [AutoAssignmentService, ExcelManipulationService],
    imports: [PrismaModule],
})
export class AutoAssignmentModule { }