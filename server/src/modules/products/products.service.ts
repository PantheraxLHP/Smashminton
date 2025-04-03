import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    // CRUD operations
    create(createProductDto: CreateProductDto) {
        return this.prisma.products.create({ data: createProductDto });
    }

    // Find all badminton equipments
    findAllBadmintonEquipments() {
        return this.prisma.products.findMany({
            where: {
                product_types: {
                    producttypename: {
                        in: ["Shoe bag", "Badminton tube", "Badminton racket grip", "Badminton sock", "Badminton string"] // Lọc theo tên loại sản phẩm
                    }
                }
            },
            select: {
                productname: true,
                sellingprice: true
            }
        });
    }

    // Find all badminton tube
    findAllBadmintonTube() {
        return this.prisma.products.findMany({
            where: {
                product_types: {
                    producttypename: {
                        in: ["Badminton tube"] // Lọc theo tên loại sản phẩm
                    }
                }
            },
            select: {
                productname: true,
                sellingprice: true
            }
        });
    }

    // Find all foods, snacks and breverages
    findAllFoodsSnacksBeverages() {
        return this.prisma.products.findMany({
            where: {
                product_types: {
                    producttypename: {
                        in: ["Food", "Breverage", "Snack"] // Lọc theo tên loại sản phẩm
                    }
                }
            },
            select: {
                productname: true,
                sellingprice: true
            }
        });
    }

    // Find all foods, snacks and breverages
    findAllFoods() {
        return this.prisma.products.findMany({
            where: {
                product_types: {
                    producttypename: {
                        in: ["Food"] // Lọc theo tên loại sản phẩm
                    }
                }
            },
            select: {
                productname: true,
                sellingprice: true
            }
        });
    }

    // Find all snacks
    findAllSnacks() {
        return this.prisma.products.findMany({
            where: {
                product_types: {
                    producttypename: {
                        in: ["Snack"] // Lọc theo tên loại sản phẩm
                    }
                }
            },
            select: {
                productname: true,
                sellingprice: true
            }
        });
    }

    // Find all breverages
    findAllBreverages() {
        return this.prisma.products.findMany({
            where: {
                product_types: {
                    producttypename: {
                        in: ["Breverage"] // Lọc theo tên loại sản phẩm
                    }
                }
            },
            select: {
                productname: true,
                sellingprice: true
            }
        });
    }

    findOne(id: number) {
        return this.prisma.products.findUnique({ where: { productid: id } });
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
