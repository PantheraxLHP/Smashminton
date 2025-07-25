import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber, IsOptional, IsNotEmpty, isArray, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class SingleRowSetting {
    @ApiProperty({
        description: 'Type for inserting correct RuleTable',
        example: 'shift',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    type: string;

    @ApiProperty({
        description: 'Single row data (data of 1 row in multiple columns)',
        type: Array,
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Array)
    cols: any[];
}

export class UpdateAutoAssignmentDto {
    @ApiProperty({
        description: 'Rows data',
        type: Array,
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Array)
    data: SingleRowSetting[];
}