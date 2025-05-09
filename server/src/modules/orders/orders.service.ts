import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CacheService } from '../cache/cache.service';
import { cacheOrderDTO } from './dto/create-cache-order.dto';
import { CacheOrder, CacheProductOrder } from 'src/interfaces/orders.interface';
import { CacheBooking, CacheCourtBooking } from 'src/interfaces/bookings.interface';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
    constructor(
        private cacheService: CacheService,
        private productService: ProductsService,
    ) { }

    async addOrderToCache(cacheOrderDTO: cacheOrderDTO): Promise<CacheOrder> {
        const { username, product_order } = cacheOrderDTO;
        // Kiểm tra nếu không có username
        if (!username) {
            throw new BadRequestException('Username is required to add booking to cache');
        }

        // Lấy cache của người dùng từ Redis
        const orderUserCache = await this.cacheService.getOrder(username);

        // Nếu không có cache, tạo mới
        if (!orderUserCache) {
            const newCacheOrder: CacheOrder = {
                product_order: [],
                totalprice: 0
            };

            // Lặp qua từng phần tử trong orderUserCache và thêm vào cache
            for (const product of product_order) {
                const unitprice: number = await this.productService.getProductPrice(product.productid);

                const newProductOrder: CacheProductOrder = {
                    productid: product.productid ?? 0,
                    productname: product.productname ?? '',
                    productimgurl: product.productimgurl ?? '',
                    unitprice: unitprice,
                    quantity: product.quantity ?? 0,
                    totalamount: unitprice * (product.quantity ?? 0),
                };

                newCacheOrder.product_order.push(newProductOrder);
                newCacheOrder.totalprice += newProductOrder.totalamount ?? 0;
            }

            // Lưu cache mới vào Redis
            const isSuccess = await this.cacheService.setOrder(username, newCacheOrder, 24 * 3600); // TTL 24 hour

            if (!isSuccess) {
                throw new BadRequestException('Failed to add booking to cache');
            }

            return newCacheOrder;
        }
        // Nếu đã có cache, cập nhật cache
        for (const product of product_order) {
            const unitprice: number = await this.productService.getProductPrice(product.productid);

            const newProductOrder: CacheProductOrder = {
                productid: product.productid ?? 0,
                productname: product.productname ?? '',
                productimgurl: product.productimgurl ?? '',
                unitprice: unitprice,
                quantity: product.quantity ?? 0,
                totalamount: unitprice * (product.quantity ?? 0),
            };

            orderUserCache.product_order.push(newProductOrder);
            orderUserCache.totalprice += newProductOrder.totalamount ?? 0;
        }

        // Ghi đè lại dữ liệu trong Redis
        const isSuccess = await this.cacheService.setOrder(username, orderUserCache, 24 * 3600);

        if (!isSuccess) {
            throw new BadRequestException('Failed to update booking in cache');
        }

        return orderUserCache;
    }


    findAll() {
        return `This action returns all orders`;
    }

    findOne(id: number) {
        return `This action returns a #${id} order`;
    }

    update(id: number, updateOrderDto: UpdateOrderDto) {
        return `This action updates a #${id} order`;
    }

    remove(id: number) {
        return `This action removes a #${id} order`;
    }
}
