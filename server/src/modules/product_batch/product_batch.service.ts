import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductBatchDto } from './dto/create-product_batch.dto';
import { UpdateProductBatchDto } from './dto/update-product_batch.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductBatchService {
  constructor(private prisma: PrismaService) {}
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
  create(createProductBatchDto: CreateProductBatchDto) {
    return 'This action adds a new productBatch';
  }

  findAll() {
    return `This action returns all productBatch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productBatch`;
  }

  update(id: number, updateProductBatchDto: UpdateProductBatchDto) {
    return `This action updates a #${id} productBatch`;
  }

  remove(id: number) {
    return `This action removes a #${id} productBatch`;
  }
}
