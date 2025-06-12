import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class CreateSupplierDto {
  @IsOptional()
  @IsString()
  suppliername?: string;

  @IsOptional()
  @IsString()
  contactname?: string;

  @IsOptional()
  @IsString()
  phonenumber?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ type: [Number], description: 'Danh sách productid mà supplier cung cấp' })
  @IsArray()
  @IsInt({ each: true })
  productids: number[];
}