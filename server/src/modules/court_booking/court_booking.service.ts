import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateCourtBookingDto } from './dto/update-court_booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { convertUTCToVNTime } from 'src/utilities/date.utilities';
import dayjs from 'dayjs';
import { CourtsService } from '../courts/courts.service';
import { AvailableCourts } from 'src/interfaces/court_booking.interface';
import { CacheService } from '../cache/cache.service';
import { courtBookingDto } from '../bookings/dto/create-cache-booking.dto';
@Injectable()
export class CourtBookingService {
  constructor(
    private prisma: PrismaService,
    private courtsService: CourtsService, // Inject CourtsService
    private cacheService: CacheService, // Inject CacheService
  ) { }

  private readonly allStartTimes: string[] = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30',
  ];

  async getAvaliableCourts(zoneid: number, date: string, starttime: string, duration: number, fixedCourt: boolean): Promise<AvailableCourts[]> {
    if (!zoneid || !date || !starttime || !duration || !fixedCourt) {
      throw new BadRequestException('Missing query parameters court_booking 1');
    }

    const courtPrices = await this.courtsService.getCourtPrices(zoneid, date, starttime, duration);
    const selectedDate = new Date(date);
    const courtBookings = await this.prisma.court_booking.findMany({
      where: {
        date: selectedDate,
      },
      select: {
        courtid: true,
        starttime: true,
        endtime: true,
      },
    });
    const courtBookingCache = await this.cacheService.getAllCacheBookings(date);


    const convertedCourtBookings = courtBookings.map((item) => ({
      courtid: item.courtid,
      starttime: item.starttime ? convertUTCToVNTime(item.starttime.toISOString()) : null,
      endtime: item.endtime ? convertUTCToVNTime(item.endtime.toISOString()) : null,
    }));


    const mergedCourtBookings = [...convertedCourtBookings, ...courtBookingCache];

    // });
    const filteredCourtPrices = courtPrices.filter((courtPrice) => {
      // Lấy tất cả các booking có cùng courtid
      const bookings = mergedCourtBookings.filter((booking) => booking.courtid === courtPrice.courtid);

      if (bookings.length === 0) {
        // Nếu không có booking cho courtid này, giữ lại courtPrice
        return true;
      }

      const courtPriceStart = dayjs(courtPrice.starttime, 'HH:mm');
      const courtPriceEnd = dayjs(courtPrice.endtime, 'HH:mm');

      // Kiểm tra nếu bất kỳ booking nào giao với courtPrice
      const isOverlap = bookings.some((booking) => {
        const bookingStart = dayjs(booking.starttime, 'HH:mm');
        const bookingEnd = dayjs(booking.endtime, 'HH:mm');
        // Kiểm tra nếu thời gian của courtPrice giao với thời gian của booking
        return courtPriceStart.isBefore(bookingEnd) && bookingStart.isBefore(courtPriceEnd);
      });
      // Nếu không giao, giữ lại courtPrice
      return !isOverlap;
    });

    return filteredCourtPrices;

  }

  async getUnavailableStartTimes(zoneid: number, date: string, duration: number): Promise<string[]> {
    if (!zoneid || !date || !duration) {
      throw new BadRequestException('Missing query parameters court_booking');
    }

    const parsedZoneId = Number(zoneid);

    const filteredCourtByDayFromTo = await this.courtsService.getCourtsIDByDayFrom_To(parsedZoneId, date);

    const selectedDate = new Date(date);
    const bookings = await this.prisma.court_booking.findMany({
      where: {
        //courtid: { in: filteredCourtByDayFromTo },
        date: selectedDate,
      },
      select: {
        starttime: true,
        endtime: true,
      },
    });

    const convertedBookings = bookings.map((booking) => ({
      ...booking,
      starttime: dayjs(booking.starttime).tz('Asia/Ho_Chi_Minh').format('HH:mm'),
      endtime: dayjs(booking.endtime).tz('Asia/Ho_Chi_Minh').format('HH:mm'),
    }));

    const cacheBookings = await this.cacheService.getAllCacheBookings(date);
    const cacheBookingsWithoutCourtIdAndDate = cacheBookings.map(({ courtid, date, ...rest }) => rest);

    const mergedBookings = [...convertedBookings, ...cacheBookingsWithoutCourtIdAndDate];

    // Tạo mảng copy với giá trị ban đầu là tổng số sân
    const totalCourts = filteredCourtByDayFromTo.length;
    const courtAvailability = Array(this.allStartTimes.length).fill(totalCourts);

    // Lặp qua từng booking
    for (const booking of mergedBookings) {
      const startIndex = this.allStartTimes.indexOf(booking.starttime);
      const endIndex = this.allStartTimes.indexOf(booking.endtime);

      if (startIndex !== -1 && endIndex !== -1) {
        // Trừ đi 1 cho các index tương ứng trong mảng copy
        for (let i = startIndex; i < endIndex; i++) {
          courtAvailability[i] -= 1;
        }
      }
    }

    // Xử lý trường hợp duration vượt quá thời gian hoạt động
    const maxStartTimeIndex = this.allStartTimes.length - 1;
    const durationSlots = (duration * 60) / 30 - 2; // Số slot 30 phút cần thiết cho duration

    // Tính toán các slot bắt đầu không khả dụng
    const unavailableStartIndex = maxStartTimeIndex + 1 - durationSlots;

    // Kiểm tra và xử lý các phần tử có giá trị = 0 trong courtAvailability
    for (let startTimeIndex = 0; startTimeIndex <= maxStartTimeIndex; startTimeIndex++) {
      if (courtAvailability[startTimeIndex] === 0 || startTimeIndex === maxStartTimeIndex) {
        // Duyệt ngược lại từ startTimeIndex đến (startTimeIndex - durationSlots)
        for (let indexBlockedTime = startTimeIndex; indexBlockedTime >= startTimeIndex - durationSlots; indexBlockedTime--) {
          courtAvailability[indexBlockedTime] = 0; // Đánh dấu các slot này là unavailable
        }
      }
    }

    const today = dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
    // Chỉ block các `starttime` trước thời gian hiện tại nếu ngày được chọn là ngày hiện tại
    if (date === today) {
      const now = dayjs().tz('Asia/Ho_Chi_Minh').format('HH:mm');
      const nowIndex = this.allStartTimes.findIndex((time) => time >= now);

      // Block tất cả các `starttime` trước thời gian hiện tại
      for (let i = 0; i < nowIndex; i++) {
        courtAvailability[i] = 0; // Đánh dấu các slot này là unavailable
      }
    }

    // Lấy danh sách các khung giờ bị block (các index có giá trị = 0)
    const unavailableTimes = this.allStartTimes.filter((_, index) => courtAvailability[index] === 0);

    return unavailableTimes;
  }

  async getSeparatedCourtPrices(courtBookingDTO: courtBookingDto): Promise<AvailableCourts[]> {
    return await this.courtsService.separateCourtPrice(courtBookingDTO);
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
