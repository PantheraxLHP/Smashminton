import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateFoodAccessoryDto, UpdateFoodAccessoryWithoutBatchDto, UpdateProductServiceDto } from './dto/update-product.dto';
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
    async create(createProductDto: CreateProductDto, file: Express.Multer.File, value: string, productfilterid: number) {
        let imageUrl = createProductDto.productimgurl || '';

        if (file) {
            // If files are provided, upload them to Cloudinary
            const uploadResults = await this.cloudinaryService.uploadProductImg(file); // Changed to handle multiple files
            imageUrl = uploadResults.secure_url || '';
            if (!imageUrl) {
                throw new BadRequestException('Failed to upload files');
            }
        }

        // createProductDto.productimgurl = imageUrl;

        const newProduct = await this.prisma.products.create({
            data: {
                ...createProductDto,
                productimgurl: imageUrl,
            },
        });

        let filterValue = await this.prisma.product_filter_values.findFirst({
            where: {
                value: value,
                // productfilterid: productfilterid,
            },
        });

        if (!filterValue) {
            filterValue = await this.prisma.product_filter_values.create({
                data: {
                    value: value,
                    productfilterid: productfilterid,
                },
            });
        }

        await this.prisma.product_attributes.create({
            data: {
                productid: newProduct.productid,
                productfiltervalueid: filterValue.productfiltervalueid,
            },
        });

        return {
            message: 'Tạo sản phẩm thành công',
            product: newProduct
        };
    }

    async findAllBasicProducts() {
        const products = await this.prisma.products.findMany({
            where: {
                isdeleted: false,
            },
            select: {
                productid: true,
                productname: true,
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
            where: {
                isdeleted: false,
            },
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
            where: { productid: id, isdeleted: false },
            select: {
                productid: true,
                productname: true,
                productimgurl: true,
                sellingprice: true,
                rentalprice: true,
            }
        });
    }

    async updateProductService(productid: number, updateProductServiceDto: UpdateProductServiceDto, file: Express.Multer.File) {
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

    async updateFoodAccessory(productid: number, batchid: number, updateFoodAccessoryDto: UpdateFoodAccessoryDto, file: Express.Multer.File) {
        let imageUrl = updateFoodAccessoryDto.productimgurl;

        if (file) {
            const uploadResult = await this.cloudinaryService.uploadProductImg(file);
            imageUrl = uploadResult.secure_url || '';
            if (!imageUrl) {
                throw new BadRequestException('Upload ảnh thất bại');
            }
        }

        // 1. Cập nhật product
        await this.prisma.products.update({
            where: { productid: productid },
            data: {
                productname: updateFoodAccessoryDto.productname,
                sellingprice: updateFoodAccessoryDto.sellingprice,
                productimgurl: imageUrl,
                updatedat: new Date(),
            },
        });

        // 2. Kiểm tra xem batchid có thật sự gắn với productid qua purchase_order không
        const foundPO = await this.prisma.purchase_order.findFirst({
            where: {
                productid: productid,
                batchid: batchid,
            },
        });

        if (!foundPO) {
            throw new NotFoundException('Không tìm thấy batch gắn với sản phẩm này');
        }

        // 3. Cập nhật discount trong bảng batch

        const updatedBatch = await this.prisma.product_batch.update({
            where: {
                batchid: batchid,
            },
            data: {
                ...(updateFoodAccessoryDto.discount !== undefined && { discount: +updateFoodAccessoryDto.discount }),
                updatedat: new Date(),
            },
        });

        return {
            message: 'Cập nhật đồ ăn và phụ kiện thành công',
            data: updatedBatch,
        };
    }

    async updateFoodAccessoryWithoutBatch(productid: number, updateFoodAccessoryWithoutBatch: UpdateFoodAccessoryWithoutBatchDto, file: Express.Multer.File) {
        let imageUrl = updateFoodAccessoryWithoutBatch.productimgurl;

        if (file) {
            const uploadResult = await this.cloudinaryService.uploadProductImg(file);
            imageUrl = uploadResult.secure_url || '';
            if (!imageUrl) {
                throw new BadRequestException('Upload ảnh thất bại');
            }
        }

        // 1. Cập nhật product
        const updatedFoodAccessoryWithoutBatch = await this.prisma.products.update({
            where: { productid: productid },
            data: {
                productname: updateFoodAccessoryWithoutBatch.productname,
                sellingprice: updateFoodAccessoryWithoutBatch.sellingprice,
                productimgurl: imageUrl,
                updatedat: new Date(),
            },
        });

        return {
            message: 'Cập nhật đồ ăn và phụ kiện thành công',
            data: updatedFoodAccessoryWithoutBatch,
        };
    }

    async deleteProduct(productid: number) {
        const product = await this.prisma.products.findUnique({
            where: { productid },
        });

        if (!product) {
            throw new NotFoundException(`Không tìm thấy sản phẩm với productid = ${productid}`);
        }

        const hasPendingOrder = await this.prisma.purchase_order.findFirst({
            where: {
                productid,
                statusorder: 'pending',
            },
        });

        if (hasPendingOrder) {
            throw new BadRequestException(`Không thể xóa sản phẩm vì đang nằm trong đơn hàng ${hasPendingOrder.poid}`);
        }

        const deleted = await this.prisma.products.update({
            where: { productid },
            data: {
                isdeleted: true,
                updatedat: new Date(),
            },
        });

        return {
            message: 'Xóa sản phẩm thành công (isdeleted = true)',
            data: deleted,
        };
    }
}
