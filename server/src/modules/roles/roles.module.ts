import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [RolesService], // Khai báo RolesService
  exports: [RolesService], // Export RolesService để sử dụng ở module khác
  imports: [PrismaModule], // Import PrismaModule để sử dụng PrismaService
})
export class RolesModule {}