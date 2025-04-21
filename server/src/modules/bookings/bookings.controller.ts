import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get('available-courts-and-unavailable-start-time')
  @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
  @ApiQuery({ name: 'date', type: String, example: '2025-05-14', description: 'Ngày đặt sân (YYYY-MM-DD)' })
  @ApiQuery({ name: 'starttime', type: String, example: '08:00', description: 'Thời gian bắt đầu (HH:mm)' })
  @ApiQuery({ name: 'duration', type: Number, example: 1.5, description: 'Thời lượng đặt sân (giờ)' })
  @ApiQuery({ name: 'fixedCourt', type: Boolean, example: true, description: 'Có cố định sân hay không' })
  getAvailableCourtsAndUnavailableStartTime(
    @Body('zoneid') zoneid: number,
    @Body('date') date: string,
    @Body('starttime') starttime: string,
    @Body('duration') duration: number,
    @Body('fixedCourt') fixedCourt: boolean,
  ) {
    return this.bookingsService.getAvailableCourtsAndUnavailableStartTime(zoneid, date, starttime, duration, fixedCourt);
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
