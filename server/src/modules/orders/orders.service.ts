import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CacheService } from '../cache/cache.service';
import { addProductOrderDto, cacheOrderDTO } from './dto/create-cache-order.dto';
import { CacheOrder, CacheProductOrder } from 'src/interfaces/orders.interface';
import { CacheBooking, CacheCourtBooking } from 'src/interfaces/bookings.interface';
import { ProductsService } from '../products/products.service';
import { Create } from 'sharp';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(
        private cacheService: CacheService,
        private productService: ProductsService,
        private prisma: PrismaService,
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

        let unitprice: number = 0;
        // Kiểm tra nếu sản phẩm có giá bán
        if (product_order.sellingprice) {
            unitprice = product_order.sellingprice ? product_order.sellingprice.toNumber() : 0;
        }
        else {
            unitprice = product_order.rentalprice ? product_order.rentalprice.toNumber() : 0;
        }

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
                ...(addProductOrderDto.returndate && { returndate: addProductOrderDto.returndate }),
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
            ...(addProductOrderDto.returndate && { returndate: addProductOrderDto.returndate }),
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

    async addOrderToDatabase(createOrderDto: CreateOrderDto): Promise<any> {
        let username = '';
        if (!createOrderDto.employeeid) {
            const account = await this.prisma.accounts.findUnique({
                where: {
                    accountid: createOrderDto.customerid,
                },
                select: {
                    username: true,
                },
            });
            username = account?.username ?? '';
        } else {
            const account = await this.prisma.accounts.findUnique({
                where: {
                    accountid: createOrderDto.employeeid,
                },
                select: {
                    username: true,
                },
            });
            username = account?.username ?? '';
        }

        // Lấy cache của người dùng từ Redis
        const orderUserCache = await this.cacheService.getOrder(username);
        if (!orderUserCache) {
            throw new BadRequestException('No order found in cache for this user');
        }
        createOrderDto.totalprice = orderUserCache.totalprice;
        createOrderDto.orderdate = new Date();

        const order = await this.prisma.orders.create({
            data: createOrderDto,
        });
        if (!order) {
            throw new BadRequestException('Failed to create order');
        }

        // Hàm chuyển đổi sang đúng định dạng cho Prisma
        const productOrders = orderUserCache.product_order.map((product) => ({
            productid: product.productid,
            orderid: order.orderid,
            quantity: product.quantity,
            returndate: product.returndate ? new Date(product.returndate) : null,
        }));

        //Insert nhiều bản ghi vào bảng order_products
        const product_orders = await this.prisma.order_product.createMany({
            data: productOrders,
        });

        if (!product_orders) {
            throw new BadRequestException('Failed to create product orders');
        }

        return {
            order: order,
            product_orders: product_orders,
        };
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
