import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase_orders.service';
import { PurchaseOrdersController } from './purchase_orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService],
  imports: [PrismaModule, CloudinaryModule],
  exports: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}
