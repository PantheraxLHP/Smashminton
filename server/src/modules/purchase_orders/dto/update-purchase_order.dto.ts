import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt } from 'class-validator';

export class UpdateDeliverySuccessfullyDto {
    @ApiProperty({ example: 100, description: 'Số lượng thực tế nhận được' })
    @IsInt()
    realityQuantity: number;

    @ApiProperty({ example: '2025-08-15', description: 'Hạn sử dụng thực tế (yyyy-mm-dd)' })
    @IsDateString()
    realityExpiryDate: string;
}
