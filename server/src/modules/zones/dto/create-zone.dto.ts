import { IsOptional, IsString, IsNumber, IsEmail, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZoneDto {
    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'Zone C',
        description: 'Tên của khu vực (zone)',
    })
    zonename?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'VIP',
        description: 'Loại zone (Thường, VIP, etc.)',
    })
    zonetype?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Ảnh của zone (upload file)',
    })
    zoneimgurl?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: 'Sân cầu lông tiêu chuẩn thi đấu',
        description: 'Mô tả cho zone',
    })
    zonedescription?: string;
}
