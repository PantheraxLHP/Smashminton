import { Module } from '@nestjs/common';
import { ProductTypesService } from './product_types.service';
import { ProductTypesController } from './product_types.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ProductTypesController],
  providers: [ProductTypesService],
  imports: [PrismaModule],
  exports: [ProductTypesService],
})
export class ProductTypesModule {}
