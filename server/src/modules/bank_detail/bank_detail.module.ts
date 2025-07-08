import { Module } from '@nestjs/common';
import { BankDetailService } from './bank_detail.service';
import { BankDetailController } from './bank_detail.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [BankDetailController],
  providers: [BankDetailService],
  exports: [BankDetailService],
  imports: [PrismaModule],
})
export class BankDetailModule {}
