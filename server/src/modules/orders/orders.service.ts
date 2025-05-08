import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CacheService } from '../cache/cache.service';
import { cacheOrderDTO } from './dto/create-cache-order.dto';
import { CacheOrder } from 'src/interfaces/orders.interface';

@Injectable()
export class OrdersService {
    constructor(
        private cacheService: CacheService
    ) { }

    addOrderToCache(cacheOrderDTO: cacheOrderDTO): Promise<any > {
        const { username, productOrder } = cacheOrderDTO;
        return Promise.resolve(1);
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
