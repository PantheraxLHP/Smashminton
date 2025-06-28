import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductBatchDto } from './dto/create-product_batch.dto';
import { UpdateProductBatchDto } from './dto/update-product_batch.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProductBatchService {
  constructor(private prisma: PrismaService) { }
  async decreaseStockQuantity(productid: number, quantity: number) {
    if (!productid || !quantity || quantity <= 0) {
      throw new BadRequestException('productid và quantity phải hợp lệ');
    }

    // Lấy tất cả batch còn tồn kho, sort expirydate ASC, batchid ASC
    const batches = await this.prisma.product_batch.findMany({
      where: {
        purchase_order: {
          some: { productid: productid },
        },
        stockquantity: { gt: 0 },
      },
      orderBy: [
        { expirydate: 'asc' }, // null sẽ ở đầu hoặc cuối tùy DB, nên cần xử lý tiếp
        { batchid: 'asc' }
      ],
    });

    if (!batches.length) {
      throw new BadRequestException('Không có batch nào còn tồn kho');
    }

    // Nếu có batch expirydate = null, ưu tiên giảm ở batch null đầu tiên
    let remain = quantity;
    const nullExpiryBatch = batches.find(b => b.expirydate === null);
    if (nullExpiryBatch) {
      const decrease = Math.min(nullExpiryBatch.stockquantity ?? 0, remain);
      await this.prisma.product_batch.update({
        where: { batchid: nullExpiryBatch.batchid },
        data: { stockquantity: (nullExpiryBatch.stockquantity ?? 0) - decrease },
      });
      remain -= decrease;
      // Loại batch này khỏi danh sách để không giảm tiếp ở dưới
      batches.splice(batches.findIndex(b => b.batchid === nullExpiryBatch.batchid), 1);
    }

    // Giảm tiếp ở các batch còn lại (expirydate != null, đã sort ASC)
    for (const batch of batches) {
      if (remain <= 0) break;
      const decrease = Math.min(batch.stockquantity ?? 0, remain);
      await this.prisma.product_batch.update({
        where: { batchid: batch.batchid },
        data: { stockquantity: (batch.stockquantity ?? 0) - decrease },
      });
      remain -= decrease;
    }

    if (remain > 0) {
      throw new BadRequestException('Không đủ hàng tồn kho để giảm');
    }

    return { success: true };
  }

  async updateAllBatchStatus() {
    const now = new Date();

    // 1. Lấy toàn bộ batch có liên kết với purchase_order
    const batches = await this.prisma.product_batch.findMany({
      include: {
        purchase_order: {
          orderBy: { deliverydate: 'desc' },
          take: 1, // Lấy deliverydate gần nhất
        },
      },
    });

    const updatedResults: {
      batchid: number;
      batchname: string | null;
      newstatus: string;
    }[] = [];

    for (const batch of batches) {
      const po = batch.purchase_order[0];
      const expiry = batch.expirydate;

      if (!po?.deliverydate || !expiry) continue;

      const X = (expiry.getTime() - po.deliverydate.getTime()) / (1000 * 60 * 60 * 24);
      let Y: number;
      if (X < 30) Y = Math.ceil(X * 0.2);
      else if (X < 180) Y = Math.ceil(X * 0.15);
      else if (X < 365) Y = Math.ceil(X * 0.1);
      else Y = Math.ceil(X* 0.05);

      const Z = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      console.log(`Batch ${batch.batchid} - X: ${X}, Y: ${Y}, Z: ${Z}`);

      let statusbatch = '';
      if (Z < 0) statusbatch = 'expired';
      else if (Z < Y) statusbatch = 'expiringsoon';
      else statusbatch = 'available';

      if (batch.statusbatch !== statusbatch) {
        await this.prisma.product_batch.update({
          where: { batchid: batch.batchid },
          data: { statusbatch },
        });
      }

      updatedResults.push({
        batchid: batch.batchid,
        batchname: batch.batchname,
        newstatus: statusbatch,
      });
    }

    return {
      message: 'Đã cập nhật trạng thái cho các batch',
      totalUpdated: updatedResults.length,
      results: updatedResults,
    };
  }

  @Cron('0 0 * * *')
  async handleBatchStatusUpdate() {
    console.log('⏰ Running batch status update at 0h');
    await this.updateAllBatchStatus();
  }
}
