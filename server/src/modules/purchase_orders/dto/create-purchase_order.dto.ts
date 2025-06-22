import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseOrderDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  productid: number;

  @IsString()
  @ApiProperty({ example: 'Trà sữa' })
  productname: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 2 })
  employeeid: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 3 })
  supplierid: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 100 })
  quantity: number;
}
