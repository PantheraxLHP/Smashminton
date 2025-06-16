import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ZonesModule } from './modules/zones/zones.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from './modules/cache/cache.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { TesseractOcrModule } from './modules/tesseract-ocr/tesseract-ocr.module';
import { StudentCardModule } from './modules/student_card/student_card.module';
import { CourtBookingModule } from './modules/court_booking/court_booking.module';
import { CourtsModule } from './modules/courts/courts.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductTypesModule } from './modules/product_types/product_types.module';
import { ProductFilterModule } from './modules/product_filter/product_filter.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductFilterValuesModule } from './modules/product_filter_values/product_filter_values.module';
import { ShiftDateModule } from './modules/shift_date/shift_date.module';
import { VoucherModule } from './modules/voucher/voucher.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { ZonePricesModule } from './modules/zone_prices/zone_prices.module';
import { NodemailerModule } from './modules/nodemailer/nodemailer.module';
import { BankDetailModule } from './modules/bank_detail/bank_detail.module';
import { RewardRecordsModule } from './modules/reward_records/reward_records.module';
import { ProductBatchModule } from './modules/product_batch/product_batch.module';
import { AutoAssignmentModule } from './modules/auto-assignment/auto-assignment.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule,
        PrismaModule,
        ProductsModule,
        AccountsModule,
        ZonesModule,
        AuthModule,
        CacheModule,
        CloudinaryModule,
        TesseractOcrModule,
        StudentCardModule,
        CourtBookingModule,
        CourtsModule,
        BookingsModule,
        OrdersModule,
        ProductTypesModule,
        ProductFilterModule,
        ProductFilterValuesModule,
        PaymentModule,
        ShiftDateModule,
        VoucherModule,
        SuppliersModule,
        ZonePricesModule,
        NodemailerModule,
        BankDetailModule,
        RewardRecordsModule,
        ProductBatchModule,
        AutoAssignmentModule,
        AdminModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}