import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { cacheBookingDTO, courtBookingDto, deleteCourtBookingDto } from './dto/create-cache-booking.dto';
import { AvailableCourtsAndUnavailableStartTime, CacheBooking, CacheCourtBooking } from 'src/interfaces/bookings.interface';
import { CourtBookingService } from '../court_booking/court_booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
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
		console.log('separatedCourts1', separatedCourts);
		// Kiểm tra nếu không có username
		if (!username) {
			throw new BadRequestException('Username is required to add booking to cache');
		}

		// Kiểm tra nếu không có dữ liệu trả về từ separatedCourts
		if (!separatedCourts || separatedCourts.length === 0) {
			throw new BadRequestException('No separated court prices found');
		}

		console.log('separatedCourts2', separatedCourts);

		// Lấy cache của người dùng từ Redis
		const bookingUserCache = await this.cacheService.getBooking(username);

		// Nếu không có cache, tạo mới
		if (!bookingUserCache) {
			const newCacheBooking: CacheBooking = {
				court_booking: [],
				totalprice: 0,
				TTL: 0,
			};

			// Lặp qua từng phần tử trong separatedCourts và thêm vào cache
			for (const court of separatedCourts) {
				const newCourtBooking: CacheCourtBooking = {
					zoneid: court_booking.zoneid ?? 0,
					courtid: court.courtid,
					courtname: court.courtname ?? '',
					courtimgurl: court.courtimgurl ?? '',
					date: court_booking.date,
					starttime: court.starttime,
					duration: court.duration ?? 0,
					endtime: court.endtime,
					price: Number(court.price), // Chuyển giá thành số
				};

				newCacheBooking.court_booking.push(newCourtBooking);
				newCacheBooking.totalprice += newCourtBooking.price;
			}

			// Lưu cache mới vào Redis
			const isSuccess = await this.cacheService.setBooking(username, newCacheBooking, 300);

			if (!isSuccess) {
				throw new BadRequestException('Failed to add booking to cache');
			}

			const TTL = await this.cacheService.getTTL('booking::booking:' + username);

			newCacheBooking.TTL = TTL;

			console.log('newCacheBooking', newCacheBooking);

			return newCacheBooking;
		}

		// Nếu đã có cache, cập nhật cache
		for (const court of separatedCourts) {

			const newCourtBooking: CacheCourtBooking = {
				zoneid: court_booking.zoneid || 0,
				courtid: court.courtid,
				courtname: court.courtname ?? '',
				courtimgurl: court.courtimgurl ?? '',
				date: court_booking.date,
				starttime: court.starttime,
				duration: court.duration ?? 0,
				endtime: court.endtime,
				price: Number(court.price), // Chuyển giá thành số
			};

			bookingUserCache.court_booking.push(newCourtBooking);
			bookingUserCache.totalprice += newCourtBooking.price;

			console.log('newCourtBooking', newCourtBooking);
		}

		// Ghi đè lại dữ liệu trong Redis
		const isSuccess = await this.cacheService.setBooking(username, bookingUserCache, 300);

		if (!isSuccess) {
			throw new BadRequestException('Failed to update booking in cache');
		}

		const TTL = await this.cacheService.getTTL('booking::booking:' + username);
		bookingUserCache.TTL = TTL;

		return bookingUserCache;
	}

	async getBookingFromCache(username: string): Promise<CacheBooking> {
		if (!username) {
			throw new BadRequestException('Username is required to get booking from cache');
		}

		const bookingUserCache = await this.cacheService.getBooking(username);

		if (!bookingUserCache) {
			throw new BadRequestException('No booking found in cache for this user');
		}

		const TTL = await this.cacheService.getTTL('booking::booking:' + username);
		bookingUserCache.TTL = TTL;

		return bookingUserCache;
	}

	async removeCourtBookingFromCache(DeleteCourtBookingDto: deleteCourtBookingDto): Promise<CacheBooking> {
		const { username, court_booking } = DeleteCourtBookingDto;
		if (!username) {
			throw new BadRequestException('Username is required to remove booking from cache');
		}

		const bookingUserCache = await this.cacheService.getBooking(username);

		if (!bookingUserCache) {
			throw new BadRequestException('No booking found in cache for this user');
		}

		const { courtid, date, starttime, duration } = court_booking;
		console.log('court_booking', court_booking);

		const courtBookingToRemove = bookingUserCache.court_booking.find((court) =>
			court.courtid === courtid &&
			court.date === date &&
			court.starttime === starttime &&
			court.duration === duration
		);

		if (!courtBookingToRemove) {
			throw new BadRequestException('Court booking not found in cache');
		}

		const TTL = await this.cacheService.getTTL('booking::booking:' + username);

		if (TTL === -1) {
			const index = bookingUserCache.court_booking.indexOf(courtBookingToRemove);
			if (index > -1) {
				bookingUserCache.court_booking.splice(index, 1);
				bookingUserCache.totalprice -= courtBookingToRemove.price;
			}

			const isSuccess = await this.cacheService.setBooking(username, bookingUserCache);

			if (!isSuccess) {
				throw new BadRequestException('Failed to update booking in cache');
			}

			return bookingUserCache;
		}
		bookingUserCache.TTL = TTL;

		const index = bookingUserCache.court_booking.indexOf(courtBookingToRemove);
		if (index > -1) {
			bookingUserCache.court_booking.splice(index, 1);
			bookingUserCache.totalprice -= courtBookingToRemove.price;
		}

		const isSuccess = await this.cacheService.setBooking(username, bookingUserCache, TTL);

		if (!isSuccess) {
			throw new BadRequestException('Failed to update booking in cache');
		}

		return bookingUserCache;
	}

	async addBookingToDatabase(createBookingDto: CreateBookingDto): Promise<any> {
		let username = '';
		if (!createBookingDto.employeeid) {
			const account = await this.prisma.accounts.findUnique({
				where: {
					accountid: createBookingDto.customerid,
				},
				select: {
					username: true,
				},
			});
			username = account?.username ?? '';
		} else {
			const account = await this.prisma.accounts.findUnique({
				where: {
					accountid: createBookingDto.employeeid,
				},
				select: {
					username: true,
				},
			});
			username = account?.username ?? '';
		}

		const bookingUserCache = await this.cacheService.getBooking(username);
		if (!bookingUserCache) {
			throw new BadRequestException('No booking found in cache for this user');
		}
		createBookingDto.totalprice = bookingUserCache.totalprice;
		createBookingDto.bookingdate = new Date();
		createBookingDto.bookingstatus = 'Scheduled';

		const booking = await this.prisma.bookings.create({
			data: createBookingDto,
		});

		if (!booking) {
			throw new BadRequestException('Failed to create booking');
		}

		// Hàm chuyển đổi sang đúng định dạng cho Prisma
		const courtBookingPrismaData = bookingUserCache.court_booking.map(item => ({
			date: new Date(`${item.date}T00:00:00Z`),
			starttime: new Date(`${item.date}T${item.starttime}:00Z`),
			endtime: new Date(`${item.date}T${item.endtime}:00Z`),
			duration: item.duration,
			bookingid: booking.bookingid,
			courtid: item.courtid,
		}));

		// Insert nhiều bản ghi vào bảng court_booking
		const court_booking = await this.prisma.court_booking.createMany({
			data: courtBookingPrismaData,
		});

		if (!court_booking) {
			throw new BadRequestException('Failed to create court booking');
		}

		return {
			booking: booking,
			court_booking: court_booking,
		};
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
