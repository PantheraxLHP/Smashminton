import { IsDateString, IsDecimal, IsString, IsInt, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateRewardRecordDto {
    @ApiPropertyOptional({
        description: 'Số tiền thưởng cuối cùng',
        example: 500000,
        type: Number
    })
    @IsOptional()
    @Transform(({ value }) => value ? parseFloat(value) : value)
    finalrewardamount?: number;

    @ApiPropertyOptional({
        description: 'Ghi chú về phần thưởng',
        example: 'Hoàn thành xuất sắc công việc trong tháng',
    })
    @IsOptional()
    @IsString()
    rewardnote?: string;

    @ApiPropertyOptional({
        description: 'Trạng thái của record thưởng',
        example: 'pending',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    })
    @IsOptional()
    @IsString()
    @IsIn(['pending', 'approved', 'rejected'])
    rewardrecordstatus?: string;

    @ApiPropertyOptional({
        description: 'Ngày áp dụng thưởng',
        example: '2025-06-20T00:00:00.000Z',
        type: String,
        format: 'date-time'
    })
    @IsOptional()
    @IsDateString()
    rewardapplieddate?: string;

    @ApiProperty({
        description: 'ID của reward rule',
        example: 1,
        type: Number
    })
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    rewardruleid: number;

    @ApiProperty({
        description: 'ID của nhân viên',
        example: 2,
        type: Number
    })
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    employeeid: number;
}