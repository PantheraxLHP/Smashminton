import { Injectable, Inject } from '@nestjs/common';
import Keyv from 'keyv';

@Injectable()
export class CacheService {
    constructor(private readonly keyv: Keyv) {}

    async get(key: string){
        return this.keyv.get(key);
    }

    async set(key: string, value: any, ttl: number = 0): Promise<boolean> {
        return this.keyv.set(key, value, ttl*1000);
    }

    async delete(key: string): Promise<boolean> {
        return this.keyv.delete(key);
    }
}
