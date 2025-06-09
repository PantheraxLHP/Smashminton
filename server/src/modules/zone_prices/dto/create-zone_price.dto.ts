import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDecimal } from 'class-validator';

export class CreateZonePriceDto {
  @IsOptional()
  @IsString()
  dayfrom?: string;

  @IsOptional()
  @IsString()
  dayto?: string;

  @IsOptional()
  @IsString()
  starttime?: string;

  @IsOptional()
  @IsString()
  endtime?: string;

  @IsOptional()
  @ApiProperty({ type: Number, description: 'Price for the zone', example: 69000 })
  price?: number;

  @IsOptional()
  @IsString()
  zoneid?: number;
}