import { Controller, Get, Post, Body, Delete, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { cacheBookingDTO, deleteCourtBookingDto } from './dto/create-cache-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Bookings')
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.addBookingToDatabase(createBookingDto);
  }

  @Post('cache-booking')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add booking to redis' })
  @ApiBody({ type: cacheBookingDTO })
  @ApiResponse({ status: 201, description: 'Add successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  addBookingToCache(@Body() CacheBookingDTO: cacheBookingDTO) {
    return this.bookingsService.addBookingToCache(CacheBookingDTO);
  }

  @Get('available-courts-and-unavailable-start-time')
  @ApiBearerAuth()
  @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
  @ApiQuery({ name: 'date', type: String, example: '2025-05-15', description: 'Ngày đặt sân (YYYY-MM-DD)' })
  @ApiQuery({ name: 'starttime', type: String, example: '08:00', description: 'Thời gian bắt đầu (HH:mm)' })
  @ApiQuery({ name: 'duration', type: Number, example: 1.5, description: 'Thời lượng đặt sân (giờ)' })
  getAvailableCourtsAndUnavailableStartTime(
    @Query('zoneid') zoneid: number,
    @Query('date') date: string,
    @Query('starttime') starttime: string,
    @Query('duration') duration: number,
  ) {
    return this.bookingsService.getAvailableCourtsAndUnavailableStartTime(zoneid, date, starttime, duration);
  }

  @Get('available-courts-and-unavailable-start-time-fixed-court')
  @ApiBearerAuth()
  @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
  @ApiQuery({ name: 'date', type: String, example: '2025-05-15', description: 'Ngày đặt sân (YYYY-MM-DD)' })
  @ApiQuery({ name: 'starttime', type: String, example: '08:00', description: 'Thời gian bắt đầu (HH:mm)' })
  @ApiQuery({ name: 'duration', type: Number, example: 1.5, description: 'Thời lượng đặt sân (giờ)' })
  getAvailableCourtsAndUnavailableStartTimeForFixedCourt(
    @Query('zoneid') zoneid: number,
    @Query('date') date: string,
    @Query('starttime') starttime: string,
    @Query('duration') duration: number,
  ) {
    return this.bookingsService.getAvailableCourtsAndUnavailableStartTimeForFixedCourt(zoneid, date, starttime, duration);
  }

  @Get('cache-booking')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking from redis' })
  @ApiQuery({ name: 'username', type: String, example: 'nguyenvun', description: 'Tên người dùng' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  getBookingFromCache(@Query('username') username: string) {
    return this.bookingsService.getBookingFromCache(username);
  }

  @Delete('cache-booking')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete court booking from redis' })
  @ApiBody({ type: deleteCourtBookingDto })
  @ApiResponse({ status: 200, description: 'Delete successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  deleteCourtBookingFromCache(@Body() DeleteCourtBookingDto: deleteCourtBookingDto) {
    return this.bookingsService.removeCourtBookingFromCache(DeleteCourtBookingDto);
  }

  @Delete('cache-booking-separated-fixed')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete separated or fixed court bookings from redis',
    description: 'Deletes related bookings: separated courts (consecutive times same day) or fixed courts (4 weeks same time)'
  })
  @ApiBody({ type: cacheBookingDTO })
  @ApiResponse({ status: 200, description: 'Delete successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  deleteCourtBookingForSeperatedAndFixCourt(@Body() CacheBookingDTO: cacheBookingDTO) {
    return this.bookingsService.removeCourtBookingForSeperatedAndFixCourt(CacheBookingDTO);
  }

  @Get('detail')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking detail for all courts in a zone on a specific date' })
  @ApiQuery({ name: 'date', type: String, example: '2025-05-15', description: 'Ngày cần xem chi tiết (YYYY-MM-DD)' })
  @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
  @ApiResponse({ status: 200, description: 'Booking detail by court' })
  @ApiResponse({ status: 400, description: 'Missing date or zoneid' })
  async getBookingDetail(
    @Query('date') date: string,
    @Query('zoneid') zoneid: number,
  ) {
    if (!date || !zoneid) throw new BadRequestException('Missing date or zoneid');
    return this.bookingsService.getBookingDetail(date, zoneid);
  }
}
