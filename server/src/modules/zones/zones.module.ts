import { Module } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [ZonesController],
  providers: [ZonesService],
  imports: [PrismaModule, CloudinaryModule],
  exports: [ZonesService],
  // If you have any other modules that need to be imported, add them here
})
export class ZonesModule {}
