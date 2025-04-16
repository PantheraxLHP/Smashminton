import { Injectable } from '@nestjs/common';
import { CreateCourtBookingDto } from './dto/create-court_booking.dto';
import { UpdateCourtBookingDto } from './dto/update-court_booking.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourtBookingService {
  constructor(private prisma: PrismaService) {}
  create(createCourtBookingDto: CreateCourtBookingDto) {
    return 'This action adds a new courtBooking';
  }
  
  findAll() {
    return this.prisma.court_booking.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} courtBooking`;
  }

  update(id: number, updateCourtBookingDto: UpdateCourtBookingDto) {
    return `This action updates a #${id} courtBooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} courtBooking`;
  }
}
