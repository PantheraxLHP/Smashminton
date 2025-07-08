import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSupplierWithProductsDto } from './create-supplier.dto';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
    @IsOptional()
    @ApiProperty({
        description: 'Danh sách các sản phẩm và giá nhập tương ứng',
        example: [
            { productid: 1, costprice: 50000 },
            { productid: 2, costprice: 40000 },
        ],
    })
    @ValidateNested({ each: true })
    @Type(() => ProductCostDto)
    products_costs?: ProductCostDto[];
}

export class ProductCostDto {
    @IsNumber()
    productid: number;

    @IsNumber()
    costprice: number;
}