import { Injectable } from '@nestjs/common';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourtsService {
  constructor(private prisma: PrismaService) {}
  create(createCourtDto: CreateCourtDto) {
    return 'This action adds a new court';
  }

  findAll() {
    return `This action returns all courts`;
  }

  async findAvailableCourt(zoneid: number, date: string, starttime: string, duration: number, fixedCourt: boolean)
  {
    const parsedStartTime = new Date(date + " " + starttime); // ép kiểu
    const endtime = new Date(parsedStartTime.getTime() + duration * 60 * 60 * 1000);
    const parsedZoneId = Number(zoneid);
    const dayOfWeek = parsedStartTime.getDay(); // lấy thứ trong tuần
    const dayOfWeekString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]; // chuyển đổi thành chuỗi
    let DayFrom: string;
    let DayTo: string;

    // xác định thứ trong tuần
    if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(dayOfWeekString)) {
      DayFrom = 'Monday';
      DayTo = 'Friday';
    } else if (['Sunday', 'Saturday'].includes(dayOfWeekString)) {
      DayFrom = 'Saturday';
      DayTo = 'Sunday';
    }

    // Truy vấn các sân có sẵn
    const availableCourts = await this.prisma.courts.findMany({
      where: {
        zoneid: parsedZoneId,
        court_booking: {
          none: {
            starttime: { lt: endtime },
            endtime: { gt: parsedStartTime },
          }
        }
      }
    });

    return availableCourts
  }

  findOne(id: number) {
    return `This action returns a #${id} court`;
  }

  update(id: number, updateCourtDto: UpdateCourtDto) {
    return `This action updates a #${id} court`;
  }

  remove(id: number) {
    return `This action removes a #${id} court`;
  }
}
