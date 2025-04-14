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

  async findAvailableCourt(zoneid: number, date: Date, starttime: Date, duration: number)
  {
    const parsedStartTime = new Date(starttime); // ép kiểu
    const endtime = new Date(parsedStartTime.getTime() + duration * 60 * 1000);
    const parsedZoneId = Number(zoneid);

    // Truy vấn các sân có sẵn
    const availableCourts = await this.prisma.courts.findMany({
      where: {
        zoneid: parsedZoneId,
        court_booking: {
          none: {
            starttime: { lt: endtime },
            endtime: { gt: starttime },
          },
        },
      },
    });

    return availableCourts
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
