import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsArray, IsInt, IsNumber } from 'class-validator';

class ProductSupply {
    @Type(() => Number)
    @IsNumber()
    @ApiProperty({ example: 3 })
    productid: number;

    @Type(() => Number)
    @IsNumber()
    @ApiProperty({ example: 10000 })
    costprice: number;
}

export class CreateSupplierWithProductsDto  {
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

    @IsArray()
    @Type(() => ProductSupply)
    @ApiProperty({
        type: [ProductSupply],
        description: 'Danh sách productid và costprice',
    })
    supplies: ProductSupply[];
}