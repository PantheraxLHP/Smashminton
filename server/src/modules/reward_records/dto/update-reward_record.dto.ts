import { PartialType } from '@nestjs/mapped-types';
import { CreateRewardRecordDto } from './create-reward_record.dto';

export class UpdateRewardRecordDto extends PartialType(CreateRewardRecordDto) {}
