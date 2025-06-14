import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @ApiProperty({ example: 'Pepsi' })
  productname: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Available' })
  status?: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({type: Number, example: 10000, required: false })
  sellingprice?: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({type: Number, example: 8000, required: false })
  rentalprice?: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({type: Number, example: 5000, required: false })
  costprice?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Hình ảnh sản phẩm',
  })
  productimgurl?: string;
}
