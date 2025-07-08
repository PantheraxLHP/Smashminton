import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PredictionService {
  constructor(private prisma: PrismaService) { }

  async getSoldRatioByFilterValue({ type, month, quarter, year }: { type: 'month' | 'quarter', month?: number, quarter?: number, year?: number }) {
    if (!year) {
      throw new BadRequestException('Missing required parameter: year');
    }
    // Lấy tất cả product_filter_value_id thuộc filter_id 1,2
    const filterValues = await this.prisma.product_filter_values.findMany({
      where: {
        productfilterid: { in: [1, 2] },
      },
      select: {
        productfiltervalueid: true,
        value: true,
        productfilterid: true,
      },
    });
    const filterValueIds = filterValues.map(fv => fv.productfiltervalueid);

    // Lấy tất cả productid ứng với từng filter_value
    const productAttributes = await this.prisma.product_attributes.findMany({
      where: {
        productfiltervalueid: { in: filterValueIds },
      },
      select: {
        productid: true,
        productfiltervalueid: true,
      },
    });
    // Map filter_value_id -> productid[]
    const filterValueToProductIds: Record<number, number[]> = {};
    for (const attr of productAttributes) {
      if (!filterValueToProductIds[attr.productfiltervalueid]) {
        filterValueToProductIds[attr.productfiltervalueid] = [];
      }
      filterValueToProductIds[attr.productfiltervalueid].push(attr.productid);
    }

    // Tạo điều kiện filter thời gian cho order_product -> orders
    let orderWhere: any = { returndate: null };
    if (year) {
      orderWhere.orders = { orderdate: {} };
      if (type === 'month' && month) {
        let endMonth = month + 1;
        let endYear = year;
        if (month === 12) {
          endMonth = 1;
          endYear = year + 1;
        }
        orderWhere.orders.orderdate.gte = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`);
        orderWhere.orders.orderdate.lt = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
      } else if (type === 'quarter' && quarter) {
        const startMonth = (quarter - 1) * 3 + 1;
        let endMonth = startMonth + 3;
        let endYear = year;
        if (endMonth > 12) {
          endMonth = 1;
          endYear = year + 1;
        }
        orderWhere.orders.orderdate.gte = new Date(`${year}-${startMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
        orderWhere.orders.orderdate.lt = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
      }
    }
    // Lấy tổng quantity bán ra cho từng productid (returndate=null là bán, !=null là thuê)
    // Gom theo productid
    const orderProducts = await this.prisma.order_product.groupBy({
      by: ['productid'],
      where: orderWhere,
      _sum: {
        quantity: true,
      },
    });
    // Map productid -> totalSold
    const productIdToTotalSold: Record<number, number> = {};
    let totalAll = 0;
    for (const op of orderProducts) {
      productIdToTotalSold[op.productid] = op._sum.quantity ?? 0;
      totalAll += op._sum.quantity ?? 0;
    }

    // Tính tổng quantity bán ra cho từng filter_value
    const result = filterValues.map(fv => {
      const productIds = filterValueToProductIds[fv.productfiltervalueid] || [];
      const totalSold = productIds.reduce((sum, pid) => sum + (productIdToTotalSold[pid] || 0), 0);
      return {
        product_filter_value_id: fv.productfiltervalueid,
        value: fv.value,
        product_filter_id: fv.productfilterid,
        total_sold: totalSold,
      };
    });
    // Tính tỉ lệ
    return result.map(r => ({
      productfilter_value_id: r.product_filter_value_id,
      productfilter_value_name: r.value,
      ratio: totalAll > 0 ? r.total_sold / totalAll : 0,
    }));
  }

  /**
   * Tính tỉ lệ sản phẩm mua vào (sum quantity purchase_order), group by product_filter_value_id với product_filter_id là 1,2
   * Filter theo tháng/quý/năm
   * Trả về: productfilter_value_id, productfilter_value_name, ratio
   */
  async getPurchasedRatioByFilterValue({ type, month, quarter, year }: { type: 'month' | 'quarter', month?: number, quarter?: number, year: number }) {
    if (!year) {
      throw new BadRequestException('Missing required parameter: year');
    }
    // Lấy tất cả product_filter_value_id thuộc filter_id 1,2
    const filterValues = await this.prisma.product_filter_values.findMany({
      where: {
        productfilterid: { in: [1, 2] },
      },
      select: {
        productfiltervalueid: true,
        value: true,
      },
    });
    const filterValueIds = filterValues.map(fv => fv.productfiltervalueid);

    // Lấy tất cả productid ứng với từng filter_value
    const productAttributes = await this.prisma.product_attributes.findMany({
      where: {
        productfiltervalueid: { in: filterValueIds },
      },
      select: {
        productid: true,
        productfiltervalueid: true,
      },
    });
    // Map filter_value_id -> productid[]
    const filterValueToProductIds: Record<number, number[]> = {};
    for (const attr of productAttributes) {
      if (!filterValueToProductIds[attr.productfiltervalueid]) {
        filterValueToProductIds[attr.productfiltervalueid] = [];
      }
      filterValueToProductIds[attr.productfiltervalueid].push(attr.productid);
    }

    // Tạo điều kiện filter thời gian cho purchase_order
    let purchaseWhere: any = {};
    if (year) {
      purchaseWhere.createdat = {};
      if (type === 'month' && month) {
        let endMonth = month + 1;
        let endYear = year;
        if (month === 12) {
          endMonth = 1;
          endYear = year + 1;
        }
        purchaseWhere.createdat.gte = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`);
        purchaseWhere.createdat.lt = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
      } else if (type === 'quarter' && quarter) {
        const startMonth = (quarter - 1) * 3 + 1;
        let endMonth = startMonth + 3;
        let endYear = year;
        if (endMonth > 12) {
          endMonth = 1;
          endYear = year + 1;
        }
        purchaseWhere.createdat.gte = new Date(`${year}-${startMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
        purchaseWhere.createdat.lt = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
      }
    }

    // Lấy tổng quantity mua vào cho từng productid trong khoảng thời gian
    const purchaseOrders = await this.prisma.purchase_order.groupBy({
      by: ['productid'],
      where: purchaseWhere,
      _sum: {
        quantity: true,
      },
    });
    // Map productid -> totalPurchased
    const productIdToTotalPurchased: Record<number, number> = {};
    let totalAll = 0;
    for (const po of purchaseOrders) {
      if (typeof po.productid === 'number') {
        productIdToTotalPurchased[po.productid] = po._sum.quantity ?? 0;
        totalAll += po._sum.quantity ?? 0;
      }
    }

    // Tính tổng quantity mua vào cho từng filter_value
    const result = filterValues.map(fv => {
      const productIds = filterValueToProductIds[fv.productfiltervalueid] || [];
      const totalPurchased = productIds.reduce((sum, pid) => sum + (productIdToTotalPurchased[pid] || 0), 0);
      return {
        productfilter_value_id: fv.productfiltervalueid,
        productfilter_value_name: fv.value,
        ratio: totalAll > 0 ? totalPurchased / totalAll : 0,
      };
    });
    return result;
  }

  async getSalesAndPurchaseByFilterValue({ type, month, quarter, year }: { type: 'month' | 'quarter', month?: number, quarter?: number, year: number }) {
    if (!year) {
      throw new BadRequestException('Missing required parameter: year');
    }
    // Lấy tất cả product_filter_value_id thuộc filter_id 1,2
    const filterValues = await this.prisma.product_filter_values.findMany({
      where: {
        productfilterid: { in: [1, 2] },
      },
      select: {
        productfiltervalueid: true,
        value: true,
      },
    });
    const filterValueIds = filterValues.map(fv => fv.productfiltervalueid);

    // Lấy tất cả productid ứng với từng filter_value
    const productAttributes = await this.prisma.product_attributes.findMany({
      where: {
        productfiltervalueid: { in: filterValueIds },
      },
      select: {
        productid: true,
        productfiltervalueid: true,
      },
    });
    // Map filter_value_id -> productid[]
    const filterValueToProductIds: Record<number, number[]> = {};
    for (const attr of productAttributes) {
      if (!filterValueToProductIds[attr.productfiltervalueid]) {
        filterValueToProductIds[attr.productfiltervalueid] = [];
      }
      filterValueToProductIds[attr.productfiltervalueid].push(attr.productid);
    }

    // Điều kiện filter thời gian cho order_product -> orders
    let orderWhere: any = { returndate: null };
    if (year) {
      orderWhere.orders = { orderdate: {} };
      if (type === 'month' && month) {
        let endMonth = month + 1;
        let endYear = year;
        if (month === 12) {
          endMonth = 1;
          endYear = year + 1;
        }
        orderWhere.orders.orderdate.gte = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`);
        orderWhere.orders.orderdate.lt = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
      } else if (type === 'quarter' && quarter) {
        const startMonth = (quarter - 1) * 3 + 1;
        let endMonth = startMonth + 3;
        let endYear = year;
        if (endMonth > 12) {
          endMonth = 1;
          endYear = year + 1;
        }
        orderWhere.orders.orderdate.gte = new Date(`${year}-${startMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
        orderWhere.orders.orderdate.lt = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
      }
    }
    // Điều kiện filter thời gian cho purchase_order
    let purchaseWhere: any = {};
    if (year) {
      purchaseWhere.createdat = {};
      if (type === 'month' && month) {
        let endMonth = month + 1;
        let endYear = year;
        if (month === 12) {
          endMonth = 1;
          endYear = year + 1;
        }
        purchaseWhere.createdat.gte = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00Z`);
        purchaseWhere.createdat.lt = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
      } else if (type === 'quarter' && quarter) {
        const startMonth = (quarter - 1) * 3 + 1;
        let endMonth = startMonth + 3;
        let endYear = year;
        if (endMonth > 12) {
          endMonth = 1;
          endYear = year + 1;
        }
        purchaseWhere.createdat.gte = new Date(`${year}-${startMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
        purchaseWhere.createdat.lt = new Date(`${endYear}-${endMonth.toString().padStart(2, '0')}-01T00:00:00Z`);
      }
    }

    // Lấy tổng quantity bán ra cho từng productid (order_product)
    const orderProducts = await this.prisma.order_product.groupBy({
      by: ['productid'],
      where: orderWhere,
      _sum: {
        quantity: true,
      },
    });
    const productIdToSales: Record<number, number> = {};
    for (const op of orderProducts) {
      if (typeof op.productid === 'number') {
        productIdToSales[op.productid] = op._sum.quantity ?? 0;
      }
    }

    // Lấy tổng quantity mua vào cho từng productid (purchase_order)
    const purchaseOrders = await this.prisma.purchase_order.groupBy({
      by: ['productid'],
      where: purchaseWhere,
      _sum: {
        quantity: true,
      },
    });
    const productIdToPurchase: Record<number, number> = {};
    for (const po of purchaseOrders) {
      if (typeof po.productid === 'number') {
        productIdToPurchase[po.productid] = po._sum.quantity ?? 0;
      }
    }

    // Tổng hợp kết quả cho từng filter_value
    return filterValues.map(fv => {
      const productIds = filterValueToProductIds[fv.productfiltervalueid] || [];
      const sales = productIds.reduce((sum, pid) => sum + (productIdToSales[pid] || 0), 0);
      const purchase = productIds.reduce((sum, pid) => sum + (productIdToPurchase[pid] || 0), 0);
      return {
        productfilter_value_id: fv.productfiltervalueid,
        productfilter_value_name: fv.value,
        sales,
        purchase,
      };
    });
  }

  async trainBestsellerModel() {
    try {
      const response = await fetch(`${process.env.DJANGO}/api/train-bestseller-model/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new BadRequestException('Failed to train bestseller model');
      }
      //const data = await response.json();
      return {
        message: 'Bestseller model trained successfully',
        status: response.status,
        success: true,
      };
    } catch (error) {
      throw new BadRequestException('Failed to train bestseller model');
    }
  }

  @Cron('0 23 31 12 *') // 11h pm, 31/12 every year
  async handleTrainBestsellerModelCron() {
    Logger.log('Auto training bestseller model at 11PM, 31/12...');
    await this.trainBestsellerModel();
    Logger.log('Auto training bestseller model completed!');
  }

  async predictBestsellerByTime({ filter_type, value }: { filter_type: 'month' | 'quarter', value: number }) {
    // Validate value range
    if (filter_type === 'month' && (value < 1 || value > 12)) {
      throw new BadRequestException('For month, value must be between 1 and 12');
    }
    if (filter_type === 'quarter' && (value < 1 || value > 4)) {
      throw new BadRequestException('For quarter, value must be between 1 and 4');
    }
    try {
      const url = `${process.env.DJANGO}/api/predict-bestseller-by-time/?filter_type=${filter_type}&value=${value}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new BadRequestException('Failed to predict bestseller by time');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new BadRequestException('Failed to predict bestseller by time');
    }
  }
}
