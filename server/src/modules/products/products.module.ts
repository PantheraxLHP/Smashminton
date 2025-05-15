import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [PrismaModule, CacheModule],
    exports: [ProductsService],
})
export class ProductsModule {}
