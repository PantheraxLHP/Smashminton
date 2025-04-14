import KeyvRedis from '@keyv/redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Keyv from 'keyv';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { Cacheable } from 'cacheable';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: CacheService,
            useFactory: () => {
                const redisUrl = 'redis://localhost:6379';
                console.log('Initializing Keyv with Redis:', redisUrl);
                const keyv = new Keyv({ store: new KeyvRedis({ url: redisUrl }), namespace: '' }); // Sử dụng Keyv với KeyvRedis
                const studentCard = new Keyv({ store: new KeyvRedis({ url: redisUrl }), namespace: 'studentCard' }); // Sử dụng Keyv với KeyvRedis
                // Truyền Keyv vào CacheService
                return new CacheService(keyv, studentCard);
            },
        },
    ],
    exports: [CacheService],
    controllers: [CacheController],
})
export class CacheModule {}
