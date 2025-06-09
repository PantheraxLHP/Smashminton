import { Module } from '@nestjs/common';
import { ProductBatchService } from './product_batch.service';
import { ProductBatchController } from './product_batch.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ProductBatchController],
  providers: [ProductBatchService],
  imports: [PrismaModule],
  exports: [ProductBatchService],
})
export class ProductBatchModule {}
