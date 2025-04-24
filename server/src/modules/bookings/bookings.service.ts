import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { cacheBookingDTO } from './dto/create-cache-booking.dto';
import { calculateEndTime_HHMM } from '../../utilities/date.utilities';
import { AvailableCourtsAndUnavailableStartTime, CacheBooking, CacheCourtBooking } from 'src/interfaces/bookings.interface';
import { CourtBookingService } from '../court_booking/court_booking.service';
@Injectable()
export class BookingsService {
  constructor(
	private prisma: PrismaService,
	private cacheService: CacheService,
	private courtBookingService: CourtBookingService,
  ) { }
  async getAvailableCourtsAndUnavailableStartTime(zoneid: number, date: string, starttime: string, duration: number, fixedCourt: boolean) : Promise<AvailableCourtsAndUnavailableStartTime> {
	if (!zoneid || !date || !starttime || !duration || fixedCourt === undefined) {
	  throw new BadRequestException('Missing query parameters');
	}
    const availableCourts = await this.courtBookingService.getAvaliableCourts(zoneid, date, starttime, duration, fixedCourt);
    const unavailableStartTimes = await this.courtBookingService.getUnavailableStartTimes(zoneid, date, duration);
    
    return {
      availableCourts: availableCourts,
      unavailableStartTimes: unavailableStartTimes,
    };
  }

  async addBookingToCache(CacheBookingDTO: cacheBookingDTO): Promise<CacheBooking> {
		const { username, court_booking } = CacheBookingDTO;

		// Kiểm tra nếu không có username
		if (!username) {
			throw new BadRequestException('Username is required to add booking to cache');
		}
		const endtime = calculateEndTime_HHMM(court_booking.starttime, court_booking.duration);
		// Tạo đối tượng `courtBooking`
		const newCourtBooking: CacheCourtBooking = {
			zoneid: court_booking.zoneid,
			courtid: court_booking.courtid,
			date: court_booking.date,
			starttime: court_booking.starttime,
			duration: court_booking.duration,
			endtime: endtime,
			price: court_booking.price ?? 0,
		};
		//Kiểm tra nếu không có key là username này trong redis
		const bookingUserCache = await this.cacheService.getBooking(CacheBookingDTO.username);
		if (!bookingUserCache) {
			// Tạo JSON cacheBooking
			const cacheBooking: CacheBooking = {
				court_booking: [newCourtBooking], // Đưa vào mảng
				totalprice: newCourtBooking.price,
			};

			const isSuccess = await this.cacheService.setBooking(username, cacheBooking);

			if (!isSuccess) {
				throw new BadRequestException('Failed to add booking to cache');
			}
			// Trả về JSON cacheBooking
			return cacheBooking;
		}

		// Nếu đã tồn tại, thêm `newCourtBooking` vào danh sách `court_booking`
		bookingUserCache.court_booking.push(newCourtBooking);

		// Cập nhật `totalprice`
		bookingUserCache.totalprice += newCourtBooking.price;

		// Ghi đè lại dữ liệu trong Redis
		const isSuccess = await this.cacheService.setBooking(username, bookingUserCache);

		if (!isSuccess) {
			throw new BadRequestException('Failed to update booking in cache');
		}

		return bookingUserCache;
	}
	findAll() {
		return `This action returns all bookings`;
	}

	findOne(id: number) {
		return `This action returns a #${id} booking`;
	}

	update(id: number, updateBookingDto: UpdateBookingDto) {
		return `This action updates a #${id} booking`;
	}

	remove(id: number) {
		return `This action removes a #${id} booking`;
	}
}
