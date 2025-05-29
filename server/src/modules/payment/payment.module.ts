import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { OrdersModule } from '../orders/orders.module';
import { BookingsModule } from '../bookings/bookings.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentService],
  exports: [PaymentService],
  imports: [OrdersModule, BookingsModule, PrismaModule, CacheModule],
})
export class PaymentModule {}
