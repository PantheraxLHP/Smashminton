import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AutoAssignmentDto {
    @ApiProperty({
        description: 'Full-time shift option',
        example: 'random',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    fullTimeOption: string;

    @ApiProperty({
        description: 'Part-time shift option',
        example: 2,
        type: Number,
    })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    partTimeOption: number;
}