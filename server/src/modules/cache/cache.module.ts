import KeyvRedis from '@keyv/redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import Redis from 'ioredis';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: CacheService,
            useFactory: (configService: ConfigService) => {
                const redisUrl = configService.get<string>('REDIS_URL', ''); 

                // Khởi tạo Redis client
                const redisClient = new Redis(redisUrl);

                // Khởi tạo Keyv với các namespace
                const keyv = new Keyv({ store: new KeyvRedis({ url: redisUrl }), namespace: '' });
                const studentCard = new Keyv({ store: new KeyvRedis({ url: redisUrl }), namespace: 'studentCard' });
                const booking = new Keyv({ store: new KeyvRedis({ url: redisUrl }), namespace: 'booking' });
                const order = new Keyv({ store: new KeyvRedis({ url: redisUrl }), namespace: 'order' });

                // Truyền Redis client và Keyv vào CacheService
                return new CacheService(keyv, studentCard, booking, redisClient, order);
            },
            inject: [ConfigService], // Inject ConfigService
        },
    ],
    exports: [CacheService],
    controllers: [CacheController],
})
export class CacheModule {}