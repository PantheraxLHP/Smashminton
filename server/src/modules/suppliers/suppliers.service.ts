import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierWithProductsDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) { }

  async createSupplierWithProducts(dto: CreateSupplierWithProductsDto) {
    const supplier = await this.prisma.suppliers.create({
      data: {
        suppliername: dto.suppliername,
        contactname: dto.contactname,
        phonenumber: dto.phonenumber,
        email: dto.email,
        address: dto.address,
      },
    });

    if (dto.supplies && dto.supplies.length > 0) {
      const supplyData = dto.supplies.map(item => ({
        supplierid: supplier.supplierid,
        productid: item.productid,
        costprice: item.costprice,
      }));

      await this.prisma.supply_products.createMany({
        data: supplyData,
        skipDuplicates: true,
      });
    }

    return {
      message: 'Tạo nhà cung cấp thành công',
      supplier,
    };
  }


  async findAll(page: number = 1, limit: number = 12, q1: string, q2: string) {
    const now = new Date();
    const skip = (page - 1) * limit;

    const allSuppliers = await this.prisma.suppliers.findMany({
      where: {
        isdeleted: false,
        ...(q1 && { suppliername: { contains: q1, mode: 'insensitive' } }),
      },
      include: {
        supply_products: {
          where: q2
            ? {
              products: {
                productname: {
                  contains: q2,
                  mode: 'insensitive'
                }
              }
            }
            : undefined,
          include: { products: true }
        }
      },
      orderBy: { supplierid: 'asc' }
    });

    // 🔥 Chỉ lấy những thằng có supply_products.length > 0
    const filtered = allSuppliers.filter(supplier => supplier.supply_products.length > 0);

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedSuppliers = filtered.slice(skip, skip + limit);

    return {
      data: paginatedSuppliers,
      pagination: {
        page: page,
        totalPages: totalPages
      },
    }
  }

  async findSuppliersByProduct(productid: number) {
    const supplies = await this.prisma.supply_products.findMany({
      where: {
        productid: productid,
      },
      include: {
        suppliers: true,
      },
    });

    return supplies.map(sp => ({
      supplierid: sp.suppliers?.supplierid,
      suppliername: sp.suppliers?.suppliername,
      costprice: sp.costprice,
    }));
  }


  async update(supplierid: number, updateSupplierDto: UpdateSupplierDto) {
    const { products_costs, ...supplierData } = updateSupplierDto;

    // 1. Cập nhật thông tin supplier
    const updatedSupplier = await this.prisma.suppliers.update({
      where: { supplierid },
      data: {
        ...supplierData,
        updatedat: new Date(),
      },
    });

    // 2. Nếu có mảng product_costs thì update từng cái
    if (products_costs && products_costs.length > 0) {
      for (const item of products_costs) {
        const existing = await this.prisma.supply_products.findUnique({
          where: {
            productid_supplierid: {
              productid: item.productid,
              supplierid: supplierid,
            },
          },
        });

        if (existing) {
          await this.prisma.supply_products.update({
            where: {
              productid_supplierid: {
                productid: item.productid,
                supplierid: supplierid,
              },
            },
            data: {
              costprice: item.costprice,
            },
          });
        } else {
          await this.prisma.supply_products.create({
            data: {
              productid: item.productid,
              supplierid: supplierid,
              costprice: item.costprice,
            },
          });
        }
      }
    }

    return {
      message: 'Cập nhật nhà cung cấp và giá nhập thành công',
      data: updatedSupplier,
    };
  }

  async deleteSupplier(supplierid: number) {
    const suppliers = await this.prisma.suppliers.findUnique({
      where: { supplierid },
    });

    if (!suppliers) {
      throw new NotFoundException(`Không tìm thấy supplierid = ${supplierid}`);
    }

    const deleted = await this.prisma.suppliers.update({
      where: { supplierid },
      data: {
        isdeleted: true,
        updatedat: new Date(),
      },
    });

    return {
      message: 'Xóa supplier thành công (isdeleted = true)',
      data: deleted,
    };
  }

  async deleteSupplyProduct(productid: number, supplierid: number) {
    const existing = await this.prisma.supply_products.findUnique({
      where: {
        productid_supplierid: {
          productid,
          supplierid,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Không tìm thấy supply_products với productid = ${productid} và supplierid = ${supplierid}`);
    }

    await this.prisma.supply_products.delete({
      where: {
        productid_supplierid: {
          productid,
          supplierid,
        },
      },
    });

    return {
      message: 'Xóa supply_products thành công',
      productid,
      supplierid,
    };
  }

}
