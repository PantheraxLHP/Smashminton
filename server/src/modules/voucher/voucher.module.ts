import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [VoucherController],
  providers: [VoucherService],
  imports: [PrismaModule],
  exports: [VoucherService],
})
export class VoucherModule {}
