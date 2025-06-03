import { IsOptional, IsString, IsDecimal } from 'class-validator';

export class CreateZonePriceDto {
  // @IsOptional()
  // @IsString()
  // starttime?: string;

  // @IsOptional()
  // @IsString()
  // endtime?: string;

  @IsOptional()
  price?: number;
}