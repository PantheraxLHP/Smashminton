import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    // Get product price
    async getProductPrice(productid: number): Promise<number> {
        const product = await this.prisma.products.findUnique({
            where: { productid },
            select: { sellingprice: true },
        });
        return product && product.sellingprice !== null ? Number(product.sellingprice) : 0;
    }

    // CRUD operations
    create(createProductDto: CreateProductDto) {
        return this.prisma.products.create({ data: createProductDto });
    }

    // // Find all badminton equipments
    // findAllBadmintonEquipments() {
    //     return this.prisma.products.findMany({
    //         where: {
    //             product_types: {
    //                 producttypename: {
    //                     in: ["Shoe bag", "Badminton tube", "Badminton racket grip", "Badminton sock", "Badminton string"] // Lọc theo tên loại sản phẩm
    //                 }
    //             }
    //         },
    //         select: {
    //             productname: true,
    //             sellingprice: true
    //         }
    //     });
    // }

    findOne(id: number) {
        return this.prisma.products.findUnique({ where: { productid: id } });
    }

    findOneForCache(id: number) {
        return this.prisma.products.findUnique({
            where: { productid: id },
            select: {
                productid: true,
                productname: true,
                productimgurl: true,
                sellingprice: true
            }
        });
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return this.prisma.products.update({
            where: { productid: id },
            data: updateProductDto,
        });
    }

    remove(id: number) {
        return this.prisma.products.delete({ where: { productid: id } });
    }
}
