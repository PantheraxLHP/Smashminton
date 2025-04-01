import { Controller, Get } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
    constructor(private readonly cacheService: CacheService) {}

    @Get('test')
    async testConnection(): Promise<string> {
        try {
            await this.cacheService.set('test-key', 'test-value');
            const value: any = await this.cacheService.get('test-key');
            return value;
        } catch (error) {
            return `Redis connection error: ${error.message}`;
        }
    }
}
