import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase_order.dto';
import { UpdateDeliverySuccessfullyDto } from './dto/update-purchase_order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) { }

  async createPurchaseOrderWithBatch(dto: CreatePurchaseOrderDto) {
    const now = new Date();

    // 👉 Format yyyy-mm-dd (hoặc mày thích định dạng khác thì tao sửa)
    const expiryStr = now.toISOString().split('T')[0]; // "2025-06-14"

    // 👉 Tạo batch mới
    const newBatch = await this.prisma.product_batch.create({
      data: {
        batchname: `Lô ${dto.productname} - ${expiryStr}`,
        expirydate: now,
        stockquantity: 0,
        discount: 0,
      },
    });

    // 👉 Tạo purchase_order mới
    const newOrder = await this.prisma.purchase_order.create({
      data: {
        productid: dto.productid,
        employeeid: dto.employeeid,
        supplierid: dto.supplierid,
        quantity: dto.quantity,
        statusorder: 'Chờ giao hàng',
        batchid: newBatch.batchid,
        deliverydate: null,
      },
    });

    return {
      message: 'Tạo đơn đặt hàng thành công',
      purchase_order: newOrder,
      product_batch: newBatch,
    };
  }


  async findAllPurchaseOrders(page: number = 1, limit: number = 12) {
    const now = new Date();
    const skip = (page - 1) * limit;



    const purchaseOrders = await this.prisma.purchase_order.findMany({
      orderBy: {
        poid: 'asc',
      },
      include: {
        products: true,
        suppliers: true,
        employees: true,
        product_batch: true,
      },
    });

    const enrichedOrders = await Promise.all(
      purchaseOrders.map(async (order) => {
        let costprice: any = null;

        if (order.productid && order.supplierid) {
          const supply = await this.prisma.supply_products.findUnique({
            where: {
              productid_supplierid: {
                productid: order.productid,
                supplierid: order.supplierid,
              },
            },
          });

          costprice = supply?.costprice ?? null;
        }

        return {
          ...order,
          costprice,
        };
      })
    );

    const total = enrichedOrders.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedPurchaseOrders = enrichedOrders.slice(skip, skip + limit);

    return {
      data: paginatedPurchaseOrders,
      pagination: {
        page: page,
        totalPages: totalPages
      },
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrder`;
  }

  async confirmDelivery(poid: number, realityQuantity: number, realityExpiryDate: Date) {
    // 1. Kiểm tra đơn nhập có tồn tại không
    const order = await this.prisma.purchase_order.findUnique({
      where: { poid },
      include: { product_batch: true },
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn nhập hàng có ID = ${poid}`);
    }

    // 2. Cập nhật purchase_order
    await this.prisma.purchase_order.update({
      where: { poid },
      data: {
        statusorder: 'Đã nhận hàng',
        deliverydate: new Date(),
        updatedat: new Date(),
      },
    });

    // 3. Cập nhật batch tương ứng
    await this.prisma.product_batch.update({
      where: { batchid: order.batchid! },
      data: {
        stockquantity: realityQuantity,
        expirydate: realityExpiryDate,
        updatedat: new Date(),
      },
    });

    return {
      message: 'Cập nhật đơn nhập và lô hàng thành công',
    };
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrder`;
  }
}
