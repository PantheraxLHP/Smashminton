import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRentalPriceDto {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ example: 12000 })
  rentalprice: number;
}
