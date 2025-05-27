import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZonePricesService } from './zone_prices.service';
import { CreateZonePriceDto } from './dto/create-zone_price.dto';
import { UpdateZonePriceDto } from './dto/update-zone_price.dto';

@Controller('zone-prices')
export class ZonePricesController {
  constructor(private readonly zonePricesService: ZonePricesService) {}

  @Post()
  create(@Body() createZonePriceDto: CreateZonePriceDto) {
    return this.zonePricesService.create(createZonePriceDto);
  }

  @Get('all-zone-prices')
  findAll() {
    return this.zonePricesService.getAllZonePrice();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zonePricesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZonePriceDto: UpdateZonePriceDto) {
    return this.zonePricesService.update(+id, updateZonePriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zonePricesService.remove(+id);
  }
}
