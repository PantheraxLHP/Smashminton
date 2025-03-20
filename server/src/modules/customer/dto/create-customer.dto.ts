import { IsInt, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @IsInt()
  accountId: number; // accountId bắt buộc, trùng với customerid

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 0 })
  totalPurchase?: number;
}
