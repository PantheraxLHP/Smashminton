import { Module } from '@nestjs/common';
import { ProductFilterValuesService } from './product_filter_values.service';
import { ProductFilterValuesController } from './product_filter_values.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ProductFilterValuesController],
  providers: [ProductFilterValuesService],
  imports: [PrismaModule],
  exports: [ProductFilterValuesService]
})
export class ProductFilterValuesModule {}
