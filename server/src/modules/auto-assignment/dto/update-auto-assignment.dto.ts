import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber, IsOptional, IsNotEmpty, isArray, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class SingleColumnSetting {
    @ApiProperty({
        description: 'Type for inserting correct RuleTable',
        example: 'shift',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    type: string;

    @ApiPropertyOptional({
        description: 'Columns data (data of 1 single row)',
        type: Array,
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Array)
    cols: any[];
}

export class UpdateAutoAssignmentDto {
    @ApiPropertyOptional({
        description: 'Columns data (data of 1 single row)',
        type: Array,
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => Array)
    data: SingleColumnSetting[];
}