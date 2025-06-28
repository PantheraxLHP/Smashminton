import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Zones } from 'src/interfaces/zones.interface';
import { Accounts } from 'src/interfaces/accounts.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ZonesService {
    constructor(
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService,
    ) { }

    async getZonesWithCourts(page: number = 1, limit: number = 12) {
        const now = new Date();
        const skip = (page - 1) * limit;

        const findZones = await this.prisma.zones.findMany({
            include: {
                courts: true,
            },
            orderBy: {
                zoneid: 'asc',
            },
        });

        for (const zone of findZones) {
            const ratings = zone.courts.map((court) => court.avgrating).filter((r) => r !== null && r !== undefined);

            const avg =
                ratings.length > 0
                    ? Number((ratings.reduce((sum, r) => sum + Number(r), 0) / ratings.length).toFixed(1))
                    : 0;

            await this.prisma.zones.update({
                where: { zoneid: zone.zoneid },
                data: { avgzonerating: avg },
            });

            // zone.avgzonerating = new Prisma.Decimal(avg);
        }

        const zones = await findZones.map((zone) => ({
            zoneid: zone.zoneid,
            zonename: zone.zonename,
            zonetype: zone.zonetype,
            zoneimgurl: zone.zoneimgurl,
            zonedescription: zone.zonedescription,
            avgzonerating: zone.avgzonerating,
            courts: zone.courts.map((court) => ({
                courtid: court.courtid,
                courtname: court.courtname,
                courtstatus: court.statuscourt,
                courtimgurl: court.courtimgurl,
                courtavgrating: court.avgrating,
                courttimecalculateavg: court.timecalculateavg,
            })),
        }));

        const total = zones.length;
        const totalPages = Math.ceil(total / limit);

        const paginatedZones = zones.slice(skip, skip + limit);

        return {
            data: paginatedZones,
            pagination: {
                page: page,
                totalPages: totalPages,
            },
        };
    }

    async create(createZoneDto: CreateZoneDto, file: Express.Multer.File) {
        let url_zone: string = '';
        if (file) {
            // If files are provided, upload them to Cloudinary
            const uploadResults = await this.cloudinaryService.uploadZoneImg(file); // Changed to handle multiple files
            url_zone = uploadResults.secure_url || '';
            if (!url_zone) {
                throw new BadRequestException('Failed to upload files');
            }
        }

        createZoneDto.zoneimgurl = url_zone;

        // Update account details in the database
        const createZone = await this.prisma.zones.create({
            data: createZoneDto,
        });

        if (!createZone) {
            throw new BadRequestException('Failed to update account');
        }

        // Danh sách 4 block zone_price cứng như hình mày gửi
        const zonePriceData = [
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '06:00',
                endtime: '08:00',
                price: 200000,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '08:00',
                endtime: '16:00',
                price: 200000,
            },
            {
                dayfrom: 'Monday',
                dayto: 'Friday',
                starttime: '16:00',
                endtime: '22:00',
                price: 200000,
            },
            {
                dayfrom: 'Saturday',
                dayto: 'Sunday',
                starttime: '06:00',
                endtime: '22:00',
                price: 200000,
            },
        ];

        // Tạo 4 zone_prices kèm theo zone mới
        await Promise.all(
            zonePriceData.map((zonePrice) =>
                this.prisma.zone_prices.create({
                    data: {
                        ...zonePrice,
                        zoneid: createZone.zoneid,
                    },
                }),
            ),
        );

        return {
            message: 'Zone and default prices created',
            zone: createZone,
        };
    }

    async findAll(): Promise<Zones[]> {
        const findZones = await this.prisma.zones.findMany({
            include: {
                courts: true,
            },
            orderBy: {
                zoneid: 'asc',
            },
        });

        for (const zone of findZones) {
            const ratings = zone.courts.map((court) => court.avgrating).filter((r) => r !== null && r !== undefined);

            const avg =
                ratings.length > 0
                    ? Number((ratings.reduce((sum, r) => sum + Number(r), 0) / ratings.length).toFixed(1))
                    : 0;

            await this.prisma.zones.update({
                where: { zoneid: zone.zoneid },
                data: { avgzonerating: avg },
            });

            zone.avgzonerating = new Prisma.Decimal(avg);
        }

        const getAllZones = this.prisma.zones.findMany({
            select: {
                zoneid: true,
                zonename: true,
                zonetype: true,
                zoneimgurl: true,
                zonedescription: true,
                avgzonerating: true,
            },
        });
        return getAllZones;
    }

    findOne(id: number) {
        return `This action returns a #${id} zone`;
    }

    update(id: number, updateZoneDto: UpdateZoneDto) {
        return `This action updates a #${id} zone`;
    }

    remove(id: number) {
        return `This action removes a #${id} zone`;
    }
}
