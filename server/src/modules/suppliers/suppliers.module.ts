import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService],
  imports: [PrismaModule],
  exports: [SuppliersService],
})
export class SuppliersModule {}
