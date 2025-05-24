import { PartialType } from '@nestjs/mapped-types';
import { CreateShiftDateDto } from './create-shift_date.dto';

export class UpdateShiftDateDto extends PartialType(CreateShiftDateDto) {}
