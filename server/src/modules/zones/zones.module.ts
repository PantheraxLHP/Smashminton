import { Module } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ZonesController],
  providers: [ZonesService],
  imports: [PrismaModule]
})
export class ZonesModule {}
