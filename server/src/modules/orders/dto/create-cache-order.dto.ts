import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class productOrderDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    productid: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'https://res.cloudinary.com/dnagyxwcl/image/upload/v1746447341/quan-can-vot-cau-long-yonex-ac147ex-2_mzac1e.webp' }) // example image URL
    productimgurl: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Quấn cán cầu lông Yonex AC147EX' }) // example product name
    productname: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 1 }) // example quantity
    quantity: number;
}

export class cacheOrderDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'nguyenvun' }) // example username
    username: string;

    @ApiProperty({ type: productOrderDto })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => productOrderDto)
    product_order: productOrderDto;
}

export class addProductOrderDto {
    @ApiProperty({ example: 'nguyenvun' }) // example username
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: 26 }) // example product ID
    @IsNotEmpty()
    @IsNumber()
    productid: number;

    @ApiProperty({ example: '2025-08-22', description: 'Return date in YYYY-MM-DD format', required: false })
    returndate: string;
}

export class deleteProductOrderDto {
    @ApiProperty({ example: 'nguyenvun' }) // example username
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: 1 }) // example product ID
    @IsNotEmpty()
    @IsNumber()
    productid: number;
}
