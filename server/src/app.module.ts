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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
