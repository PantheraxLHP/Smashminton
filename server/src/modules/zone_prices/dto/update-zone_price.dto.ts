import { PartialType } from '@nestjs/swagger';
import { CreateZonePriceDto } from './create-zone_price.dto';

export class UpdateZonePriceDto extends PartialType(CreateZonePriceDto) {}
