import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CourtBookingService } from './court_booking.service';
import { ApiQuery, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Court Booking')
@UseGuards(JwtAuthGuard)    
@Controller('court-booking')
export class CourtBookingController {
    constructor(private readonly courtBookingService: CourtBookingService) { }

    @Get('available-courts')
    @ApiBearerAuth()
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
        return this.courtBookingService.getAvaliableCourts(zoneid, date, starttime, duration);
    }

    @Get('unavailable-starttimes')
    @ApiBearerAuth()
    @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
    @ApiQuery({ name: 'date', type: String, example: '2025-05-15', description: 'Ngày đặt sân (YYYY-MM-DD)' })
    @ApiQuery({ name: 'duration', type: Number, example: 1.5, description: 'Thời lượng đặt sân (giờ)' })
    async getUnavailableStartTimes(
        @Query('zoneid') zoneid: number,
        @Query('date') date: string, // YYYY-MM-DD
        @Query('duration') duration: number, // in hours
    ) {
        return this.courtBookingService.getUnavailableStartTimes(zoneid, date, duration);
    }

    @Get('unavailable-starttimes-fixed-court')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Lấy danh sách khung giờ không khả dụng cho đặt sân cố định',
        description: 'Trả về danh sách các khung giờ bắt đầu không thể đặt sân cố định trong 4 tuần liên tiếp. Mỗi starttime đại diện cho khả năng đặt sân cùng giờ trong 4 tuần.'
    })
    @ApiResponse({
        status: 200,
        description: 'Danh sách khung giờ không khả dụng cho đặt sân cố định',
        schema: {
            type: 'array',
            items: {
                type: 'string',
                example: '08:00'
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Missing required parameters' })
    @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
    @ApiQuery({ name: 'date', type: String, example: '2025-05-15', description: 'Ngày bắt đầu đặt sân cố định (YYYY-MM-DD). Sẽ kiểm tra khả dụng cho ngày này và 3 tuần tiếp theo.' })
    @ApiQuery({ name: 'duration', type: Number, example: 1.5, description: 'Thời lượng đặt sân (giờ)' })
    async getUnavailableStartTimesForFixedCourt(
        @Query('zoneid') zoneid: number,
        @Query('date') date: string, // YYYY-MM-DD
        @Query('duration') duration: number, // in hours
    ) {
        return this.courtBookingService.getUnavailableStartTimesForFixedCourt(zoneid, date, duration);
    }

    @Get('available-fixed-courts')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Lấy danh sách sân có thể đặt cố định',
        description: 'Trả về danh sách các sân có thể đặt cố định trong 4 tuần liên tiếp (mỗi tuần 1 lần, cùng ngày trong tuần, cùng giờ). Giá trả về là tổng giá của 4 lần đặt.'
    })
    @ApiResponse({
        status: 200,
        description: 'Danh sách sân có thể đặt cố định với giá tổng',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    zoneid: { type: 'number', example: 1 },
                    courtid: { type: 'number', example: 1 },
                    courtname: { type: 'string', example: 'Court A1' },
                    courtimgurl: { type: 'string', example: 'https://example.com/court1.jpg' },
                    starttime: { type: 'string', example: '08:00' },
                    endtime: { type: 'string', example: '09:30' },
                    duration: { type: 'number', example: 1.5 },
                    price: { type: 'number', example: 600000, description: 'Tổng giá của 4 lần đặt' }
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Missing required parameters' })
    @ApiResponse({ status: 500, description: 'Server error' })
    @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
    @ApiQuery({ name: 'date', type: String, example: '2025-05-16', description: 'Ngày bắt đầu đặt sân cố định (YYYY-MM-DD). Sẽ đặt sân vào ngày này và 3 tuần tiếp theo.' })
    @ApiQuery({ name: 'starttime', type: String, example: '08:00', description: 'Thời gian bắt đầu (HH:mm)' })
    @ApiQuery({ name: 'duration', type: Number, example: 1.5, description: 'Thời lượng đặt sân (giờ)' })
    async getAvailableFixedCourts(
        @Query('zoneid') zoneid: number,
        @Query('date') date: string,
        @Query('starttime') starttime: string,
        @Query('duration') duration: number,
    ) {
        return this.courtBookingService.getAvailableFixedCourts(zoneid, date, starttime, duration);
    }

    @Get()
    findAll() {
        return this.courtBookingService.findAll();
    }
}
