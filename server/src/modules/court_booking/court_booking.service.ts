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

  async findAvailableCourt(zoneid: number, date: string, starttime: string, duration: number, fixedCourt: boolean)
  {
    const parsedStartTime = new Date(date + " " + starttime); // ép kiểu
    const endtime = new Date(parsedStartTime.getTime() + duration * 60 * 60 * 1000);
    const parsedZoneId = Number(zoneid);

    // Truy vấn các sân có sẵn
    const availableCourts = await this.prisma.courts.findMany({
      where: {
        zoneid: parsedZoneId,
        court_booking: {
          none: {
            starttime: { lt: endtime },
            endtime: { gt: parsedStartTime },
          },
        },
      },
    });

    // thêm trường hợp đặt sân cố định

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
