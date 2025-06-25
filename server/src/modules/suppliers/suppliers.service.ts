import { Injectable } from '@nestjs/common';
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


  async findAll(page: number = 1, limit: number = 12) {
    const now = new Date();
    const skip = (page - 1) * limit;

    const findSuppliers = await this.prisma.suppliers.findMany({
      include: {
        supply_products: {
          include: {
            products: true,
          },
        },
      },
      orderBy: {
        supplierid: 'asc',
      },
    });

    const suplliers = await findSuppliers.map(supplier => ({
      supplierid: supplier.supplierid,
      suppliername: supplier.suppliername,
      contactname: supplier.contactname,
      phonenumber: supplier.phonenumber,
      email: supplier.email,
      address: supplier.address,
      products: supplier.supply_products
        .filter(sp => sp.products !== null)
        .map(sp => ({
          productid: sp.products!.productid,
          productname: sp.products!.productname,
          costprice: Number(sp.costprice),
        })),
    }));

    const total = suplliers.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedSuppliers = suplliers.slice(skip, skip + limit);

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


  async update(supplierid: number, productid: number, costprice: number, updateSupplierDto: UpdateSupplierDto) {
    // 1. Cập nhật thông tin supplier
    const updatedSupplier = await this.prisma.suppliers.update({
      where: { supplierid },
      data: {
        ...updateSupplierDto,
        updatedat: new Date(),
      },
    });

    // 2. Kiểm tra cặp productid + supplierid trong supply_products
    const supply = await this.prisma.supply_products.findUnique({
      where: {
        productid_supplierid: {
          productid,
          supplierid,
        },
      },
    });

    if (supply) {
      // 2a. Nếu tồn tại thì update costprice
      await this.prisma.supply_products.update({
        where: {
          productid_supplierid: {
            productid,
            supplierid,
          },
        },
        data: {
          costprice,
        },
      });
    } else {
      // 2b. Nếu chưa có thì tạo mới
      await this.prisma.supply_products.create({
        data: {
          productid,
          supplierid,
          costprice,
        },
      });
    }

    return {
      message: 'Cập nhật nhà cung cấp và giá nhập thành công',
      data: updatedSupplier,
    };
  }

  async remove(id: number) {
    // Xoá liên kết supply_products trước (vì có foreign key constraint)
    await this.prisma.supply_products.deleteMany({
      where: {
        supplierid: id,
      },
    });

    // Xoá supplier
    const deleted = await this.prisma.suppliers.delete({
      where: {
        supplierid: id,
      },
    });

    return {
      message: 'Xoá nhà cung cấp thành công',
      data: deleted,
    };
  }

}
