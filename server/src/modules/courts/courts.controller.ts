import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Post()
  create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtsService.create(createCourtDto);
  }

  @Get()
  findAll() {
    return this.courtsService.findAll();
  }

  @Get('available-courts')
  @ApiQuery({ name: 'zoneid', type: Number, example: 1, description: 'ID của khu vực' })
  @ApiQuery({ name: 'date', type: String, example: '2025-05-14', description: 'Ngày đặt sân (YYYY-MM-DD)' })
  @ApiQuery({ name: 'starttime', type: String, example: '08:00', description: 'Thời gian bắt đầu (HH:mm)' })
  @ApiQuery({ name: 'duration', type: Number, example: 1.5, description: 'Thời lượng đặt sân (giờ)' })
  @ApiQuery({ name: 'fixedCourt', type: Boolean, example: true, description: 'Có cố định sân hay không' })
  findAvailableCourt(
    @Query('zoneid') zoneid: number,
    @Query('date') date: string,
    @Query('starttime') starttime: string,
    @Query('duration') duration: number,
    @Query('fixedCourt') fixedCourt: boolean,
  ) {
    return this.courtsService.findAvailableCourt(zoneid, date, starttime, duration, fixedCourt);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourtDto: UpdateCourtDto) {
    return this.courtsService.update(+id, updateCourtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courtsService.remove(+id);
  }
}
