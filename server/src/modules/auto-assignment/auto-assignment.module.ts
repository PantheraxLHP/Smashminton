import { Module } from '@nestjs/common';
import { AutoAssignmentService } from './auto-assignment.service';
import { AutoAssignmentController } from './auto-assignment.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    controllers: [AutoAssignmentController],
    providers: [AutoAssignmentService],
    exports: [AutoAssignmentService],
    imports: [PrismaModule],
})
export class AutoAssignmentModule { }