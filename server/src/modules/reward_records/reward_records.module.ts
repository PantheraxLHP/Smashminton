import { Module } from '@nestjs/common';
import { RewardRecordsService } from './reward_records.service';
import { RewardRecordsController } from './reward_records.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [RewardRecordsController],
  providers: [RewardRecordsService],
  imports: [PrismaModule],
  exports: [RewardRecordsService],
})
export class RewardRecordsModule {}
