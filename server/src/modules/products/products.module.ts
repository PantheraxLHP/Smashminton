import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [PrismaModule, CacheModule, CloudinaryModule],
    exports: [ProductsService],
})
export class ProductsModule {}
