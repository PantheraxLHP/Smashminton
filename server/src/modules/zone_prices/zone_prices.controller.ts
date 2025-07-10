import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ZonePricesService } from './zone_prices.service';
import { CreateZonePriceDto } from './dto/create-zone_price.dto';
import { UpdateZonePriceDto } from './dto/update-zone_price.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('zone-prices')
export class ZonePricesController {
  constructor(private readonly zonePricesService: ZonePricesService) {}

  @Post()
  @Roles('wh_manager')
  @ApiBearerAuth()
  create(@Body() createZonePriceDto: CreateZonePriceDto) {
    return this.zonePricesService.create(createZonePriceDto);
  }

  @Get('all-zone-prices')
  @Public()
  findAll() {
    return this.zonePricesService.getAllZonePrice();
  }

  @Get(':id')
  @Roles('wh_manager')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.zonePricesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('wh_manager')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateZonePriceDto: UpdateZonePriceDto) {
    return this.zonePricesService.update(+id, updateZonePriceDto);
  }

  @Delete(':id')
  @Roles('wh_manager')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.zonePricesService.remove(+id);
  }
}
