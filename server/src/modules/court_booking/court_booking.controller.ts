import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourtBookingService } from './court_booking.service';
import { CreateCourtBookingDto } from './dto/create-court_booking.dto';
import { UpdateCourtBookingDto } from './dto/update-court_booking.dto';

@Controller('court-booking')
export class CourtBookingController {
  constructor(private readonly courtBookingService: CourtBookingService) {}

  @Post()
  create(@Body() createCourtBookingDto: CreateCourtBookingDto) {
    return this.courtBookingService.create(createCourtBookingDto);
  }

  @Get('available-courts')
  findAvailableCourt(@Query('zoneid') zoneid: number,
                    @Query('date') date: string,
                    @Query('starttime') starttime: string, 
                    @Query('duration') duration: number,
                    @Query('fixedCourt') fixedCourt: boolean)
  {
    return this.courtBookingService.findAvailableCourt(zoneid, date, starttime, duration, fixedCourt); 
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
