import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductServiceDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) { }

    // Get product price
    async getProductPrice(productid: number): Promise<number> {
        const product = await this.prisma.products.findUnique({
            where: { productid },
            select: { sellingprice: true },
        });
        return product && product.sellingprice !== null ? Number(product.sellingprice) : 0;
    }

    // CRUD operations
    async create(createProductDto: CreateProductDto, file: Express.Multer.File, productfiltervalueid: number) {
        let imageUrl = '';

        if (file) {
            // If files are provided, upload them to Cloudinary
            const uploadResults = await this.cloudinaryService.uploadProductImg(file); // Changed to handle multiple files
            imageUrl = uploadResults.secure_url || '';
            if (!imageUrl) {
                throw new BadRequestException('Failed to upload files');
            }
        }

        createProductDto.productimgurl = imageUrl;

        const newProduct = await this.prisma.products.create({
            data: {
                ...createProductDto,
                status: 'Available',
            },
        });

        await this.prisma.product_attributes.create({
            data: {
                productid: newProduct.productid,
                productfiltervalueid: productfiltervalueid,
            },
        });

        return {
            message: 'Tạo sản phẩm thành công',
            product: newProduct
        };
    }

    async findAllBasicProducts() {
        const products = await this.prisma.products.findMany({
            select: {
                productid: true,
                productname: true,
                status: true,
                sellingprice: true,
                rentalprice: true,
                productimgurl: true
            },
            orderBy: {
                productid: 'asc',
            },
        });

        return products;
    }

    async getProductsWithBatches(page: number = 1, limit: number = 12) {
        const now = new Date();
        const skip = (page - 1) * limit;

        const findProducts = await this.prisma.products.findMany({
            include: {
                purchase_order: {
                    include: {
                        product_batch: true,
                    },
                },
            },
            orderBy: {
                productid: 'asc',
            },
        });

        const products = await findProducts.map(product => ({
            productid: product.productid,
            productname: product.productname,
            productimgurl: product.productimgurl,
            batches: product.purchase_order
                .map(po => po.product_batch)
                .filter((b): b is NonNullable<typeof b> => b !== null)
                .map(b => ({
                    batchid: b.batchid,
                    batchname: b.batchname,
                    stockquantity: b.stockquantity,
                    expirydate: b.expirydate,
                })),
        }));

        const total = products.length;
        const totalPages = Math.ceil(total / limit);

        const paginatedProducts = products.slice(skip, skip + limit);

        return {
            data: paginatedProducts,
            pagination: {
                page: page,
                totalPages: totalPages
            },
        }
    }


    // findOne(id: number) {
    //     return this.prisma.products.findUnique({ where: { productid: id } });
    // }

    findOneForCache(id: number) {
        return this.prisma.products.findUnique({
            where: { productid: id },
            select: {
                productid: true,
                productname: true,
                productimgurl: true,
                sellingprice: true,
                rentalprice: true,
            }
        });
    }

    async updateRentalPrice(productid: number, updateProductServiceDto: UpdateProductServiceDto, file: Express.Multer.File) {
        let imageUrl = updateProductServiceDto.productimgurl;

        if (file) {
            const uploadResult = await this.cloudinaryService.uploadProductImg(file);
            imageUrl = uploadResult.secure_url || '';
            if (!imageUrl) {
                throw new BadRequestException('Upload ảnh thất bại');
            }
        }

        const updated = await this.prisma.products.update({
            where: { productid: productid },
            data: {
                ...updateProductServiceDto,
                productimgurl: imageUrl,
            },
        });

        return {
            message: 'Cập nhật dịch vụ thành công',
            data: updated,
        };
    }

    remove(id: number) {
        return this.prisma.products.delete({ where: { productid: id } });
    }
}
