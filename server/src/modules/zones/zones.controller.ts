import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Zones')
@Controller('zones')
export class ZonesController {
    constructor(private readonly zonesService: ZonesService) { }

    @Get('all-zones-with-courts')
    @ApiOperation({ description: 'Get all zones with their associated courts' })
    getZonesWithCourts(@Query('page') page: string = '1',
        @Query('pageSize') pageSize: string = '12') {

        const pageNumber = parseInt(page) || 1;
        const pageSizeNumber = parseInt(pageSize) || 12;
        // Validation
        if (pageNumber < 1) {
            throw new Error('Page number must be greater than 0');
        }
        if (pageSizeNumber < 1 || pageSizeNumber > 100) {
            throw new Error('Page size must be between 1 and 100');
        }

        return this.zonesService.getZonesWithCourts(pageNumber, pageSizeNumber);
    }

    @Post('new-zone')
    @ApiOperation({ summary: 'Create a new zone with an avatar image' })
    @UseInterceptors(
        FileInterceptor('zoneimgurl', {
            limits: {
                fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file: 5MB
            },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )


    @ApiOperation({
        summary: 'Create new zone',
        description: 'Tạo zone mới với ảnh upload'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Zone data with image',
        type: CreateZoneDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Zone created successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid file or data'
    })
    create(
        @Body() createZoneDto: CreateZoneDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.zonesService.create(createZoneDto, file);
    }

    @Public()
    @Get()
    findAll() {
        return this.zonesService.findAll();
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.zonesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateZoneDto: UpdateZoneDto) {
        return this.zonesService.update(+id, updateZoneDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.zonesService.remove(+id);
    }
}
