import { Controller, Delete, Get, Param } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('cache')
export class CacheController {
    constructor(private readonly cacheService: CacheService) { }

    @Get('test')
    async testConnection(): Promise<string> {
        try {
            await this.cacheService.set('test-key', 'test-value');
            const value: any = await this.cacheService.get('key');
            console.log(value);
            return value;
        } catch (error) {
            return `Redis connection error: ${error.message}`;
        }
    }
    
    @Delete('clear-all/:username')
    @ApiOperation({
        summary: 'delete all cache order and booking of a specific user',
        description: 'delete all cache order and booking of a specific user',
    })
    @ApiParam({
        name: 'username',
        description: 'Username of the user whose cache will be cleared',
        required: true,
        type: String,
        example: 'nguyenvun',
    })
    async clearAllCacheOrderAndBooking(@Param('username') username: string): Promise<boolean> {
        return this.cacheService.clearAllCacheOrderAndBooking(username);
    }
}
