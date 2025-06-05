import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBankDetailDto {
    @ApiPropertyOptional({
        description: 'ID chi tiết ngân hàng',
        example: 1,
        type: Number
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    bankdetailid?: number;

    @ApiPropertyOptional({
        description: 'Trạng thái hoạt động của tài khoản',
        example: true,
        default: false,
        type: Boolean
    })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    active?: boolean;
}
