import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { courtBookingDto } from '../bookings/dto/create-cache-booking.dto';

@Controller('courts')
export class CourtsController {
    constructor(private readonly courtsService: CourtsService) { }

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
}
