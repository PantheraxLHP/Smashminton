import { Injectable, Inject } from '@nestjs/common';
import Keyv from 'keyv';

@Injectable()
export class CacheService {
    constructor(
        private readonly keyv: Keyv,
        private readonly studentCard: Keyv,
    ) {}

    async get(key: string){
        return this.keyv.get(key);
    }

    async getStudentCard(key: string){
        return this.studentCard.get(key);
    }

    async setStudentCard(key: string, value: any, ttl: number = 0): Promise<boolean> {
        return this.studentCard.set(key, value, ttl*1000);
    }

    async set(key: string, value: any, ttl: number = 0): Promise<boolean> {
        return this.keyv.set(key, value, ttl*1000);
    }

    async delete(key: string): Promise<boolean> {
        return this.keyv.delete(key);
    }
}
