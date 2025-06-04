import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBankDetailDto {
    @ApiPropertyOptional({
        description: 'Tên ngân hàng',
        example: 'Ngân hàng BIDV',
        type: String
    })
    @IsOptional()
    @IsString()
    bankname?: string;

    @ApiPropertyOptional({
        description: 'Số tài khoản ngân hàng',
        example: '1234567890123456',
        type: String
    })
    @IsOptional()
    @IsString()
    banknumber?: string;

    @ApiPropertyOptional({
        description: 'Tên chủ tài khoản',
        example: 'NGUYEN VAN A',
        type: String
    })
    @IsOptional()
    @IsString()
    bankholder?: string;

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

    @ApiPropertyOptional({
        description: 'ID nhân viên sở hữu tài khoản',
        example: 1,
        type: Number
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    employeeid?: number;
    static active: boolean;
}
