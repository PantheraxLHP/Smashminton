import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    ValidateNested,
    IsString,
    IsNumber,
    IsDateString,
    IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class courtBookingDto {
    @IsDateString()
    @IsNotEmpty()
    date: string; // YYYY-MM-DD format (ISO 8601)

    @IsString()
    @IsNotEmpty()
    starttime: string; // e.g. '09:00'

    @IsNumber()
    @IsNotEmpty()
    duration: number; // in hours, e.g. 1.5

    @IsOptional()
    @IsString()
    endtime?: string; // optional
}

export class cacheBookingDTO {
    @IsInt()
    @IsNotEmpty()
    customerid: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => courtBookingDto)
    court_booking: courtBookingDto[];
}