import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { cacheBookingDTO, courtBookingDto, deleteCourtBookingDto } from './dto/create-cache-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.addBookingToDatabase(createBookingDto);
  }

  @Post('cache-booking')
  @ApiOperation({ summary: 'Add booking to redis' })
  @ApiBody({ type: cacheBookingDTO })
  @ApiResponse({ status: 201, description: 'Add successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  addBookingToCache(@Body() CacheBookingDTO: cacheBookingDTO) {
    return this.bookingsService.addBookingToCache(CacheBookingDTO);
  }

  @Get('available-courts-and-unavailable-start-time')
  @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
  @ApiQuery({ name: 'date', type: String, example: '2025-05-15', description: 'Ngày đặt sân (YYYY-MM-DD)' })
  @ApiQuery({ name: 'starttime', type: String, example: '08:00', description: 'Thời gian bắt đầu (HH:mm)' })
  @ApiQuery({ name: 'duration', type: Number, example: 1.5, description: 'Thời lượng đặt sân (giờ)' })
  @ApiQuery({ name: 'fixedCourt', type: Boolean, example: true, description: 'Có cố định sân hay không' })
  getAvailableCourtsAndUnavailableStartTime(
    @Query('zoneid') zoneid: number,
    @Query('date') date: string,
    @Query('starttime') starttime: string,
    @Query('duration') duration: number,
    @Query('fixedCourt') fixedCourt: boolean,
  ) {
    return this.bookingsService.getAvailableCourtsAndUnavailableStartTime(zoneid, date, starttime, duration, fixedCourt);
  }

  @Get('cache-booking')
  @ApiOperation({ summary: 'Get booking from redis' })
  @ApiQuery({ name: 'username', type: String, example: 'nguyenvun', description: 'Tên người dùng' })
  @ApiResponse({ status: 200, description: 'Get successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  getBookingFromCache(@Query('username') username: string) {
    return this.bookingsService.getBookingFromCache(username);
  }

  @Delete('cache-booking')
  @ApiOperation({ summary: 'Delete court booking from redis' })
  @ApiBody({ type: deleteCourtBookingDto })
  @ApiResponse({ status: 200, description: 'Delete successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  deleteCourtBookingFromCache(@Body() DeleteCourtBookingDto: deleteCourtBookingDto) {
    return this.bookingsService.removeCourtBookingFromCache(DeleteCourtBookingDto);
  }



  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
