import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSupplierWithProductsDto } from './create-supplier.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSupplierDto {
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
}
