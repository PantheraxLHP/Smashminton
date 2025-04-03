import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prismaService: PrismaService) {}

    async getRoles() {
        return this.prismaService.roles.findMany({
            select: {
                rolename: true,
            },
        });
    }
}
