import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateMomoPaymentDto {
  @ApiProperty({ description: 'Amount to be paid', example: 100000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}