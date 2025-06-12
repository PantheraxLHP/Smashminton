import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class CreateSupplierDto {
    @IsOptional()
    @ApiProperty({ type: String, description: 'Tên nhà cung cấp', required: false })
    @IsString()
    suppliername?: string;

    @IsOptional()
    @ApiProperty({ type: String, description: 'Tên người liên hệ', required: false })
    @IsString()
    contactname?: string;

    @IsOptional()
    @ApiProperty({ type: String, description: 'Số điện thoại liên hệ', required: false })
    @IsString()
    phonenumber?: string;

    @IsOptional()
    @ApiProperty({ type: String, description: 'Email liên hệ', required: false })
    @IsString()
    email?: string;

    @IsOptional()
    @ApiProperty({ type: String, description: 'Địa chỉ nhà cung cấp', required: false })
    @IsString()
    address?: string;

    @ApiProperty({ type: [Number], description: 'Danh sách productid mà supplier cung cấp', required: false })
    @IsArray()
    @IsInt({ each: true })
    productids: number[];
}