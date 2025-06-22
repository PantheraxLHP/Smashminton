import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase_order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase_order.dto';
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


  findAll() {
    return `This action returns all purchaseOrders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrder`;
  }

  update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return `This action updates a #${id} purchaseOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrder`;
  }
}
