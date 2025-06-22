import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductServiceDto {
  @IsString()
  @ApiProperty({ example: 'Pepsi' })
  productname: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Hình ảnh sản phẩm',
  })
  productimgurl?: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number, example: 8000, required: false })
  rentalprice?: number;
}

export class UpdateFoodAccessoryDto {
  @IsString()
  @ApiProperty({ example: 'Pepsi' })
  productname: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Hình ảnh sản phẩm',
  })
  productimgurl?: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number, example: 8000, required: false })
  sellingprice?: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number, example: 8000, required: false })
  discount?: number;
}
