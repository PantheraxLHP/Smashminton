import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { courtBookingDto } from '../bookings/dto/create-cache-booking.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('courts')
export class CourtsController {
    constructor(private readonly courtsService: CourtsService) { }

    @Post('new-court')
    @ApiOperation({ summary: 'Create a new court with an court image' })
    @UseInterceptors(
        FileInterceptor('courtimgurl', {
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
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 201,
        description: 'Zone created successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid file or data'
    })
    create(
        @Body() createCourtDto: CreateCourtDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        createCourtDto.zoneid = parseInt(createCourtDto.zoneid as any, 10);
        return this.courtsService.createCourt(createCourtDto, file);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'update court' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'udpate court body',
        type: CreateCourtDto,
    })
    @UseInterceptors(
        FileInterceptor('courtimgurl', {
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
    updateCourt(
        @Param('id') id: number,
        @Body() updateCourtDto: UpdateCourtDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.courtsService.updateCourt(+id, updateCourtDto, file);
    }




    @Get('filtered-courts-dayfromto')
    @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
    @ApiQuery({ name: 'date', type: String, example: '2025-05-15', description: 'Ngày đặt sân (YYYY-MM-DD)' })
    getCourtsByDayFromTo(
        @Query('zoneid') zoneid: number,
        @Query('date') date: string,
    ) {
        return this.courtsService.getCourtsIDByDayFrom_To(zoneid, date);
    }

    @Get('court-prices')
    @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
    @ApiQuery({ name: 'date', type: String, example: '2025-05-16', description: 'Ngày đặt sân (YYYY-MM-DD)' })
    @ApiQuery({ name: 'starttime', type: String, example: '08:00', description: 'Thời gian bắt đầu (HH:mm)' })
    @ApiQuery({ name: 'duration', type: Number, example: 1.5, description: 'Thời lượng đặt sân (giờ)' })
    getCourtPrices(
        @Query('zoneid') zoneid: number,
        @Query('date') date: string,
        @Query('starttime') starttime: string,
        @Query('duration') duration: number,
    ) {
        return this.courtsService.getCourtPrices(zoneid, date, starttime, duration);
    }

    @Post('separate-court-price')
    @ApiBody({
        description: 'Thông tin đặt sân',
        type: courtBookingDto
    })
    async getSeparateCourtPrice(@Body() courtBookingDTO: courtBookingDto) {
        return this.courtsService.separateCourtPrice(courtBookingDTO);
    }

    @Post('separate-fixed-court-price')
    @ApiBody({
        description: 'Thông tin đặt sân cố định',
        type: courtBookingDto
    })
    async getSeparateFixedCourtPrice(@Body() courtBookingDTO: courtBookingDto) {
        return this.courtsService.separateFixedCourtPrice(courtBookingDTO);
    }
}
