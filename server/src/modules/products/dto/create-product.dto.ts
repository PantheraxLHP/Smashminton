import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @ApiProperty({ example: 'Pepsi' })
  productname: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Nước ngọt có ga' })
  producttype?: string;

  @IsString()
  @ApiProperty({ example: 'Lô 1', required: false })
  batch?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: '2025-03-18T13:03:54Z', required: false })
  expirydate?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Còn hàng' })
  status?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 100 })
  stockquantity?: number;

  @IsNumber()
  @ApiProperty({ example: 10000, required: false })
  sellingprice?: number;

  @IsNumber()
  @ApiProperty({ example: 8000, required: false })
  rentalprice?: number;

  @IsNumber()
  @ApiProperty({ example: 5000, required: false })
  costprice?: number;
}
