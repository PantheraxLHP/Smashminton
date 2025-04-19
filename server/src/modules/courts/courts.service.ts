import { Injectable } from '@nestjs/common';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { PrismaService } from '../prisma/prisma.service';
import { calculateEndTime, getEnglishDayName } from 'src/utilities/date.utilities';
import { AvailableCourt } from 'src/interfaces/courts.interface';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
@Injectable()
export class CourtsService {
  constructor(private prisma: PrismaService) {}
  create(createCourtDto: CreateCourtDto) {
    return 'This action adds a new court';
  }

  findAll() {
    return `This action returns all courts`;
  }

  async findAvailableCourt(zoneid: number, date: string, starttime: string, duration: number, fixedCourt: boolean) {
    const parsedStartTime = dayjs(starttime, 'HH:mm');
    const endtime = calculateEndTime(starttime, duration);
    const parsedEndTime = dayjs(endtime, 'HH:mm');
  
    const parsedZoneId = Number(zoneid);
    const dayOfWeek = getEnglishDayName(date);
  
    let DayFrom: string = '';
    let DayTo: string = '';
  
    // Xác định khoảng thời gian theo ngày trong tuần
    if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(dayOfWeek)) {
      DayFrom = 'Monday';
      DayTo = 'Friday';
    } else {
      DayFrom = 'Saturday';
      DayTo = 'Sunday';
    }
  
    // Truy vấn tất cả các sân phù hợp
    const zonePricesByAllCourts = await this.prisma.courts.findMany({
      where: {
        zoneid: parsedZoneId,
      },
      select: {
        courtid: true,
        courtname: true,
        zones: {
          select: {
            zone_prices: {
              where: {
                dayfrom: DayFrom,
                dayto: DayTo,
              },
              select: {
                dayfrom: true,
                dayto: true,
                starttime: true,
                endtime: true,
                price: true,
              },
            },
          },
        },
      },
    });
  
    // Gộp tất cả zone_prices vào một mảng duy nhất
    const allZonePrices = zonePricesByAllCourts.flatMap((court) =>
      court.zones?.zone_prices.map((zonePrice) => ({
        courtid: court.courtid,
        courtname: court.courtname,
        dayfrom: zonePrice.dayfrom,
        dayto: zonePrice.dayto,
        starttime: zonePrice.starttime,
        endtime: zonePrice.endtime,
        price: zonePrice.price,
      })) || []
    );
  
    // Sử dụng Map để nhóm kết quả theo courtid
    const courtResults = new Map<number, {
      courtid: number; 
      courtname: string; 
      totalPrice: number; 
      dayfrom: string; 
      dayto: string 
    }>();
  
    for (const zone of allZonePrices) {
      const zoneStart = dayjs(zone.starttime, 'HH:mm');
      const zoneEnd = dayjs(zone.endtime, 'HH:mm');
  
      // Tính khoảng giao nhau giữa thời gian người dùng và khung giờ của zone
      const actualStart = parsedStartTime.isAfter(zoneStart) ? parsedStartTime : zoneStart;
      const actualEnd = parsedEndTime.isBefore(zoneEnd) ? parsedEndTime : zoneEnd;
  
      if (actualStart.isBefore(actualEnd)) {
        const durationInHours = actualEnd.diff(actualStart, 'minutes') / 60; // phút -> giờ
        const pricePerHour = parseFloat((zone.price ?? '0').toString());
        const priceForZone = durationInHours * pricePerHour;
  
        // Nếu courtid đã tồn tại trong Map, cộng dồn tổng tiền
        if (courtResults.has(zone.courtid)) {
          const courtData = courtResults.get(zone.courtid)!;
          courtData.totalPrice += priceForZone;
        } else {
          // Nếu chưa tồn tại, khởi tạo dữ liệu cho courtid
          courtResults.set(zone.courtid, {
            courtid: zone.courtid,
            courtname: zone.courtname ?? '',
            totalPrice: priceForZone,
            dayfrom: zone.dayfrom ?? '',
            dayto: zone.dayto ?? '',
          });
        }
      }
    }
    // Chuyển Map thành mảng kết quả
    const availableCourts = Array.from(courtResults.values()).map((court) => ({
      courtid: court.courtid,
      courtname: court.courtname,
      dayfrom: court.dayfrom,
      dayto: court.dayto,
      starttime: starttime,
      endtime: endtime,
      price: court.totalPrice.toFixed(0), // Làm tròn giá trị tiền
    }));
  
    return availableCourts;
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
