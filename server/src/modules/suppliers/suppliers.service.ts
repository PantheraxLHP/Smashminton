import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) { }

  create(createSupplierDto: CreateSupplierDto) {
    return 'This action adds a new supplier';
  }

  async createSupplierWithProducts(dto: CreateSupplierDto) {
    // Tạo supplier trước
    const newSupplier = await this.prisma.suppliers.create({
      data: {
        suppliername: dto.suppliername,
        contactname: dto.contactname,
        phonenumber: dto.phonenumber,
        email: dto.email,
        address: dto.address,
      },
    });

    // Tạo supply_products liên kết
    if (dto.productids && dto.productids.length > 0) {
      const data = dto.productids.map(productid => ({
        supplierid: newSupplier.supplierid,
        productid,
      }));

      await this.prisma.supply_products.createMany({
        data,
        skipDuplicates: true,
      });
    }

    return {
      message: 'Tạo nhà cung cấp và danh sách sản phẩm thành công',
      supplier: newSupplier,
    };
  }


  async findAll() {
    const suppliers = await this.prisma.suppliers.findMany({
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

    return suppliers.map(supplier => ({
      supplierid: supplier.supplierid,
      suppliername: supplier.suppliername,
      contactname: supplier.contactname,
      phonenumber: supplier.phonenumber,
      email: supplier.email,
      address: supplier.address,
      products: supplier.supply_products
        .map(sp => sp.products)
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .map(p => ({
          productid: p.productid,
          productname: p.productname,
        })),
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} supplier`;
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
