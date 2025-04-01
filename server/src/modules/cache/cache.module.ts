import KeyvRedis from '@keyv/redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Keyv from 'keyv';
import { CacheService } from './cache.service';
import { CacheController } from './cache.controller';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'CACHE',
            useFactory: () => {
                const redisUrl = 'redis://localhost:6379';
                console.log('Initializing Keyv with Redis:', redisUrl);
                const keyv = new Keyv(redisUrl, { store: new KeyvRedis(redisUrl) });
                return keyv;
            },
        },
        {
            provide: CacheService,
            useFactory: (keyv: Keyv) => new CacheService(keyv),
            inject: ['CACHE'],
        },
    ],
    exports: [CacheService],
    controllers: [CacheController],
})
export class CacheModule {}
