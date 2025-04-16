import { Module } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CourtsController],
  providers: [CourtsService],
  imports: [PrismaModule]
})
export class CourtsModule {}
