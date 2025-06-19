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

  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const updated = await this.prisma.suppliers.update({
      where: { supplierid: id },
      data: {
        ...updateSupplierDto,
        updatedat: new Date(),
      },
    });

    return {
      message: 'Cập nhật nhà cung cấp thành công',
      data: updated,
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
