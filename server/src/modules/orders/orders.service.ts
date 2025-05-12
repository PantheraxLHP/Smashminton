import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CacheService } from '../cache/cache.service';
import { addProductOrderDto, cacheOrderDTO } from './dto/create-cache-order.dto';
import { CacheOrder, CacheProductOrder } from 'src/interfaces/orders.interface';
import { CacheBooking, CacheCourtBooking } from 'src/interfaces/bookings.interface';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
    constructor(
        private cacheService: CacheService,
        private productService: ProductsService,
    ) { }

    async getOrderFromCache(username: string): Promise<CacheOrder> {
        // Kiểm tra nếu không có username
        if (!username) {
            throw new BadRequestException('Username is required to get order from cache');
        }
        const orderUserCache = await this.cacheService.getOrder(username);

        if (!orderUserCache) {
            throw new BadRequestException('No cache found for the user');
        }
        return orderUserCache;
    }

    async addOrderToCache(addProductOrderDto: addProductOrderDto): Promise<CacheOrder> {
        const { username, productid } = addProductOrderDto;
        // Kiểm tra nếu không có username
        if (!username || !productid) {
            throw new BadRequestException('Username and productid are required to add booking to cache');
        }
        // Lấy thông tin sản phẩm từ Redis
        const product_order = await this.productService.findOneForCache(productid);
        if (!product_order) {
            throw new BadRequestException('Product not found for the given productid');
        }
        // Lấy cache của người dùng từ Redis
        const orderUserCache = await this.cacheService.getOrder(username);

        const unitprice: number = product_order.sellingprice ? product_order.sellingprice.toNumber() : 0;

        // Nếu không có cache, tạo mới
        if (!orderUserCache) {
            const newCacheOrder: CacheOrder = {
                product_order: [],
                totalprice: 0
            };

            const newProductOrder: CacheProductOrder = {
                productid: product_order.productid ?? 0,
                productname: product_order.productname ?? '',
                productimgurl: product_order.productimgurl ?? '',
                unitprice: unitprice,
                quantity: 1,
                totalamount: unitprice,
            };

            newCacheOrder.product_order.push(newProductOrder);
            newCacheOrder.totalprice = newProductOrder.totalamount ?? 0;

            // Lưu cache mới vào Redis
            const isSuccess = await this.cacheService.setOrder(username, newCacheOrder, 24 * 3600); // TTL 24 hour

            if (!isSuccess) {
                throw new BadRequestException('Failed to add booking to cache');
            }

            return newCacheOrder;
        }
        // Nếu đã có cache
        // Kiểm tra nếu sản phẩm đã tồn tại trong cache
        const existingProductIndex = orderUserCache.product_order.findIndex(
            (product) => product.productid === product_order.productid
        );
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng và tổng tiền
        if (existingProductIndex !== -1) {
            const existingProduct = orderUserCache.product_order[existingProductIndex];
            existingProduct.quantity += 1;
            existingProduct.totalamount = existingProduct.unitprice * existingProduct.quantity;

            // Cập nhật tổng giá trị đơn hàng
            orderUserCache.totalprice += existingProduct.unitprice;

            // Ghi đè lại dữ liệu trong Redis
            const isSuccess = await this.cacheService.setOrder(username, orderUserCache, 24 * 3600);

            if (!isSuccess) {
                throw new BadRequestException('Failed to update booking in cache');
            }

            return orderUserCache;
        }
        // Nếu sản phẩm chưa tồn tại, thêm mới vào cache
        const newProductOrder: CacheProductOrder = {
            productid: product_order.productid ?? 0,
            productname: product_order.productname ?? '',
            productimgurl: product_order.productimgurl ?? '',
            unitprice: unitprice,
            quantity: 1,
            totalamount: unitprice,
        };

        orderUserCache.product_order.push(newProductOrder);
        orderUserCache.totalprice += unitprice;

        const isSuccess = await this.cacheService.setOrder(username, orderUserCache, 24 * 3600);

        if (!isSuccess) {
            throw new BadRequestException('Failed to update booking in cache');
        }

        return orderUserCache;
    }

    async removeProductOrderFromCache(username: string, productid: number): Promise<CacheOrder> {
        // Kiểm tra nếu không có username
        if (!username) {
            throw new BadRequestException('Username is required to remove booking from cache');
        }

        // Lấy cache của người dùng từ Redis
        const orderUserCache = await this.cacheService.getOrder(username);

        // Nếu không có cache, tạo mới
        if (!orderUserCache) {
            throw new BadRequestException('No cache found for the user');
        }
        // Tìm sản phẩm trong mảng product_order
        const productIndex = orderUserCache.product_order.findIndex((product) => product.productid === productid);
        if (productIndex !== -1) {
            const existingProduct = orderUserCache.product_order[productIndex];
            if (existingProduct.quantity === 1) {
            // Nếu số lượng là 1, xóa sản phẩm khỏi mảng
            orderUserCache.totalprice -= existingProduct.totalamount ?? 0;
            orderUserCache.product_order.splice(productIndex, 1);
            } else {
            // Nếu số lượng lớn hơn 1, giảm số lượng và cập nhật tổng tiền
            existingProduct.quantity -= 1;
            existingProduct.totalamount = existingProduct.unitprice * existingProduct.quantity;
            orderUserCache.totalprice -= existingProduct.unitprice;
            }
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
