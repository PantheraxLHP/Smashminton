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
        statusorder: 'pending',
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


  async findAllPurchaseOrders(page: number = 1, limit: number = 12, statusOrder?: string) {
    const now = new Date();
    const skip = (page - 1) * limit;

    const purchaseOrders = await this.prisma.purchase_order.findMany({
      where: statusOrder ? { statusorder: statusOrder } : undefined,
      orderBy: {
        product_batch: {
          batchid: 'desc', // 👉 sắp xếp theo batchid giảm dần
        },
      },
      include: {
        products: {
          select: {
            productid: true,
            productname: true,
            sellingprice: true,
            rentalprice: true,
            productimgurl: true,
            createdat: true,
            updatedat: true,
            product_attributes: {
              select: {
                product_filter_values: {
                  select: {
                    productfilterid: true,
                  },
                }
              },
            }
          },
        },
        suppliers: true,
        employees: true,
        product_batch: true,
      },
    });

    console.log('Purchase Orders:', purchaseOrders);

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
        statusorder: 'delivered',
        deliverydate: new Date(),
        quantity: realityQuantity,
        updatedat: new Date(),
      },
    });

    // 3. Cập nhật batch tương ứng
    await this.prisma.product_batch.update({
      where: { batchid: order.batchid! },
      data: {
        stockquantity: realityQuantity,
        expirydate: realityExpiryDate,
        statusbatch: 'available',
        updatedat: new Date(),
      },
    });

    return {
      message: 'Cập nhật đơn nhập và lô hàng thành công',
    };
  }

  async cancelPurchaseOrder(poid: number) {
    // Kiểm tra đơn đặt hàng có tồn tại không
    const foundOrder = await this.prisma.purchase_order.findUnique({
      where: { poid },
    });

    if (!foundOrder) {
      throw new NotFoundException(`Không tìm thấy đơn đặt hàng với poid = ${poid}`);
    }

    // Cập nhật trạng thái đơn
    const updated = await this.prisma.purchase_order.update({
      where: { poid },
      data: {
        statusorder: 'canceled',
        updatedat: new Date(),
      },
    });

    return {
      message: 'Hủy đơn hàng thành công',
      data: updated,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrder`;
  }
}
