import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsModule } from '../products/products.module';
import { CacheModule } from '../cache/cache.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductBatchModule } from '../product_batch/product_batch.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // Export OrdersService if needed in other modules
  imports: [ProductsModule, CacheModule, PrismaModule, ProductBatchModule], // Import other modules if OrdersService depends on them
})
export class OrdersModule {}
