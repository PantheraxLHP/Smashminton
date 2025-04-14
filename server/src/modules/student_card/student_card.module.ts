import { Module } from '@nestjs/common';
import { StudentCardService } from './student_card.service';
import { StudentCardController } from './student_card.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [StudentCardController],
  providers: [StudentCardService],
  imports: [PrismaModule], // Add any necessary imports here
  exports: [StudentCardService], // Export service if needed in other modules
})
export class StudentCardModule {}
