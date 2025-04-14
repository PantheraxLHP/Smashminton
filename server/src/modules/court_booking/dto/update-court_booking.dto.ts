import { PartialType } from '@nestjs/mapped-types';
import { CreateCourtBookingDto } from './create-court_booking.dto';

export class UpdateCourtBookingDto extends PartialType(CreateCourtBookingDto) {}
