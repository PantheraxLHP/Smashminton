import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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
    
    product_order: productOrderDto[];

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 100 }) // example total price
    totalprice: number;
}
