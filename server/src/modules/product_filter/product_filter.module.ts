import { Module } from '@nestjs/common';
import { ProductFilterService } from './product_filter.service';
import { ProductFilterController } from './product_filter.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ProductFilterController],
  providers: [ProductFilterService],
  imports: [PrismaModule],
  exports: [ProductFilterService],
})
export class ProductFilterModule {}
