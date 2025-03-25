import { IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsInt()
    accountId: number; // accountId bắt buộc, trùng với customerid
}
