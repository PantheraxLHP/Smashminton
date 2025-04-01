import { Injectable, Inject } from '@nestjs/common';
import Keyv from 'keyv';

@Injectable()
export class CacheService {
    constructor(@Inject('CACHE') private readonly keyv: Keyv) {}

    async get<T>(key: string): Promise<T | null> {
        return this.keyv.get(key);
    }

    async set<T>(key: string, value: T, ttl: number = 0): Promise<boolean> {
        return this.keyv.set(key, value, ttl);
    }

    async delete(key: string): Promise<boolean> {
        return this.keyv.delete(key);
    }
}
