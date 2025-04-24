import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    ValidateNested,
    IsString,
    IsNumber,
    IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class courtBookingDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    zoneid: number;
    
    @ApiProperty({ example: 8 })
    @IsInt()
    @IsNotEmpty()
    courtid: number;

    @ApiProperty({ example: '2025-05-15' }) // example date
    @IsDateString()
    @IsNotEmpty()
    date: string; // YYYY-MM-DD format (ISO 8601)

    @ApiProperty({ example: '19:00' }) // example time
    @IsString()
    @IsNotEmpty()
    starttime: string; // e.g. '09:00'

    @ApiProperty({ example: 2 }) // example duration
    @IsNumber()
    @IsNotEmpty()
    duration: number; // in hours, e.g. 1.5

    @ApiProperty({ example: '20:00' }) // example end time
    @IsOptional()
    @IsString()
    endtime?: string; // optional

    @ApiProperty({ example: 280000 }) // example price
    @IsOptional()
    @IsNumber()
    price?: number; // optional
}

export class cacheBookingDTO {
    @ApiProperty({ example: 'huyenvup' }) // example username
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ type: courtBookingDto })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => courtBookingDto)
    court_booking: courtBookingDto;
}