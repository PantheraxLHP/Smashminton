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
  price?: number;

  @IsOptional()
  @IsString()
  zoneid?: number;
}