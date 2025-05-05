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
	async getAvailableCourtsAndUnavailableStartTime(zoneid: number, date: string, starttime: string, duration: number, fixedCourt: boolean): Promise<AvailableCourtsAndUnavailableStartTime> {
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

		// Gọi hàm getSeparatedCourtPrices để lấy danh sách các khoảng giá đã tách
		const separatedCourts = await this.courtBookingService.getSeparatedCourtPrices(court_booking);

		// Kiểm tra nếu không có username
		if (!username) {
			throw new BadRequestException('Username is required to add booking to cache');
		}

		// Kiểm tra nếu không có dữ liệu trả về từ separatedCourts
		if (!separatedCourts || separatedCourts.length === 0) {
			throw new BadRequestException('No separated court prices found');
		}

		// Lấy cache của người dùng từ Redis
		const bookingUserCache = await this.cacheService.getBooking(username);

		// Nếu không có cache, tạo mới
		if (!bookingUserCache) {
			const newCacheBooking: CacheBooking = {
				court_booking: [],
				totalprice: 0,
			};

			// Lặp qua từng phần tử trong separatedCourts và thêm vào cache
			for (const court of separatedCourts) {
				const newCourtBooking: CacheCourtBooking = {
					zoneid: court_booking.zoneid,
					courtid: court.courtid,
					courtimgurl: court.courtimgurl ?? '',
					date: court_booking.date,
					starttime: court.starttime,
					duration: court.duration ?? 0, 
					endtime: court.endtime,
					price: parseFloat(court.price), // Chuyển giá thành số
				};

				newCacheBooking.court_booking.push(newCourtBooking);
				newCacheBooking.totalprice += newCourtBooking.price;
			}

			// Lưu cache mới vào Redis
			const isSuccess = await this.cacheService.setBooking(username, newCacheBooking);

			if (!isSuccess) {
				throw new BadRequestException('Failed to add booking to cache');
			}

			return newCacheBooking;
		}

		// Nếu đã có cache, cập nhật cache
		for (const court of separatedCourts) {

			const newCourtBooking: CacheCourtBooking = {
				zoneid: court_booking.zoneid,
				courtid: court.courtid,
				courtimgurl: court.courtimgurl ?? '',
				date: court_booking.date,
				starttime: court.starttime,
				duration: court.duration ?? 0, 
				endtime: court.endtime,
				price: parseFloat(court.price), // Chuyển giá thành số
			};

			bookingUserCache.court_booking.push(newCourtBooking);
			bookingUserCache.totalprice += newCourtBooking.price;
		}

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
