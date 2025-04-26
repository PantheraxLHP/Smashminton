import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourtBookingService } from './court_booking.service';
import { CreateCourtBookingDto } from './dto/create-court_booking.dto';
import { UpdateCourtBookingDto } from './dto/update-court_booking.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('court-booking')
export class CourtBookingController {
  constructor(private readonly courtBookingService: CourtBookingService) {}

  @Post()
  create(@Body() createCourtBookingDto: CreateCourtBookingDto) {
    return this.courtBookingService.create(createCourtBookingDto);
  }

  @Get('available-courts')
  @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
  @ApiQuery({ name: 'date', type: String, example: '2025-05-16', description: 'Ngày đặt sân (YYYY-MM-DD)' })
  @ApiQuery({ name: 'starttime', type: String, example: '08:00', description: 'Thời gian bắt đầu (HH:mm)' })
  @ApiQuery({ name: 'duration', type: Number, example: 1.5, description: 'Thời lượng đặt sân (giờ)' })
  @ApiQuery({ name: 'fixedCourt', type: Boolean, example: true, description: 'Có cố định sân hay không' })
  getCourtPrices(
    @Query('zoneid') zoneid: number,
    @Query('date') date: string,
    @Query('starttime') starttime: string,
    @Query('duration') duration: number,
    @Query('fixedCourt') fixedCourt: boolean,
  ) {
    return this.courtBookingService.getAvaliableCourts(zoneid, date, starttime, duration, fixedCourt);
  }

  @Get('unavailable-starttimes')
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

  @Get()
  findAll() {
    return this.courtBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtBookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourtBookingDto: UpdateCourtBookingDto) {
    return this.courtBookingService.update(+id, updateCourtBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courtBookingService.remove(+id);
  }
}
