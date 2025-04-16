import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    [x: string]: any;
    async onModuleInit() {
        await this.$connect();
    }
}
