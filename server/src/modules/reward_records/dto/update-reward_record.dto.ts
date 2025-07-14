import { PartialType } from '@nestjs/mapped-types';
import { CreateRewardRecordDto } from './create-reward_record.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateRewardRecordDto {
    @ApiProperty({
        description: 'Reward record ID',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    rewardrecordid: number;

    @ApiProperty({
        description: 'Reward note',
        example: 'Reward note',
    })
    @IsString()
    rewardnote: string;
}
