import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { cacheBookingDTO, deleteCourtBookingDto } from './dto/create-cache-booking.dto';
import { AvailableCourtsAndUnavailableStartTime, Booking, CacheBooking, CacheCourtBooking } from 'src/interfaces/bookings.interface';
import { CourtBookingService } from '../court_booking/court_booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CourtPrices } from 'src/interfaces/courts.interface';
@Injectable()
export class BookingsService {
	constructor(
		private prisma: PrismaService,
		private cacheService: CacheService,
		private courtBookingService: CourtBookingService,
	) { }
	async getAvailableCourtsAndUnavailableStartTime(zoneid: number, date: string, starttime: string, duration: number): Promise<AvailableCourtsAndUnavailableStartTime> {
		if (!zoneid || !date || !starttime || !duration) {
			throw new BadRequestException('Missing query parameters');
		}
		const availableCourts = await this.courtBookingService.getAvaliableCourts(zoneid, date, starttime, duration);
		const unavailableStartTimes = await this.courtBookingService.getUnavailableStartTimes(zoneid, date, duration);

		return {
			availableCourts: availableCourts,
			unavailableStartTimes: unavailableStartTimes,
		};
	}

	async getAvailableCourtsAndUnavailableStartTimeForFixedCourt(zoneid: number, date: string, starttime: string, duration: number): Promise<AvailableCourtsAndUnavailableStartTime> {
		if (!zoneid || !date || !starttime || !duration) {
			throw new BadRequestException('Missing query parameters');
		}
		const availableCourts = await this.courtBookingService.getAvailableFixedCourts(zoneid, date, starttime, duration);
		const unavailableStartTimes = await this.courtBookingService.getUnavailableStartTimesForFixedCourt(zoneid, date, duration);

		return {
			availableCourts: availableCourts,
			unavailableStartTimes: unavailableStartTimes,
		};
	}

	async addBookingToCache(CacheBookingDTO: cacheBookingDTO): Promise<CacheBooking> {
		const { username, fixedCourt, court_booking } = CacheBookingDTO;

		let separatedCourts: CourtPrices[] = [];
		if (fixedCourt) {
			separatedCourts = await this.courtBookingService.getSeparatedFixedCourtPrices(court_booking);
		} else {
			separatedCourts = await this.courtBookingService.getSeparatedCourtPrices(court_booking);
		}

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
				TTL: 0,
			};

			// Lặp qua từng phần tử trong separatedCourts và thêm vào cache
			for (const court of separatedCourts) {
				const newCourtBooking: CacheCourtBooking = {
					zoneid: court_booking.zoneid ?? 0,
					courtid: court.courtid,
					courtname: court.courtname ?? '',
					courtimgurl: court.courtimgurl ?? '',
					date: court.date || '',
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
			return newCacheBooking;
		}

		// Nếu đã có cache, cập nhật cache
		for (const court of separatedCourts) {

			const newCourtBooking: CacheCourtBooking = {
				zoneid: court_booking.zoneid || 0,
				courtid: court.courtid,
				courtname: court.courtname ?? '',
				courtimgurl: court.courtimgurl ?? '',
				date: court.date || '',
				starttime: court.starttime,
				duration: court.duration ?? 0,
				endtime: court.endtime,
				price: Number(court.price), // Chuyển giá thành số
			};

			bookingUserCache.court_booking.push(newCourtBooking);
			bookingUserCache.totalprice += newCourtBooking.price;
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

		const booking = await this.prisma.bookings.create({
			data: createBookingDto,
		});

		if (!booking) {
			throw new BadRequestException('Failed to create booking');
		}

		// Hàm chuyển đổi sang đúng định dạng cho Prisma
		const courtBookingPrismaData = bookingUserCache.court_booking.map(item => ({
			date: new Date(`${item.date} 00:00:00`),
			starttime: new Date(`${item.date} ${item.starttime}:00`),
			endtime: new Date(`${item.date} ${item.endtime}:00`),
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

		return booking;
	}

	/**
	 * Lấy chi tiết booking cho từng sân trong zone, theo ngày và format đặc biệt
	 */
	async getBookingDetail(date: string, zoneid: number) {
		// 1. Lấy danh sách sân trong zone
		const courts = await this.prisma.courts.findMany({
			where: { zoneid: Number(zoneid) },
			select: {
				courtid: true,
				courtname: true,
				zoneid: true,
				zones: { select: { zonename: true } },
			},
		});
		if (!courts.length) return [];

		// 2. Lấy tất cả court_booking trong ngày này, cho các sân thuộc zone
		const startOfDay = new Date(`${date} 00:00:00`);
		const endOfDay = new Date(`${date} 23:59:59`);

		const courtBookings = await this.prisma.court_booking.findMany({
			where: {
				courtid: { in: courts.map(c => c.courtid) },
				starttime: { gte: startOfDay, lte: endOfDay },
			},
			select: {
				courtbookingid: true,
				courtid: true,
				starttime: true,
				endtime: true,
				duration: true,
				bookingid: true,
			},
		});
		// Loại bỏ null bookingid
		const bookingIds = courtBookings.map(cb => cb.bookingid).filter((id): id is number => id !== null && id !== undefined);

		// 3. Lấy thông tin booking, receipts, order_product, products
		const bookings = await this.prisma.bookings.findMany({
			where: { bookingid: { in: bookingIds } },
			select: {
				bookingid: true,
				guestphone: true,
				bookingstatus: true,
				totalprice: true,
				receipts: { select: { receiptid: true, totalamount: true, bookingid: true, orderid: true } },
			},
		});
		// Map bookingid -> booking
		const bookingMap = new Map(bookings.map(b => [b.bookingid, b]));

		// Lấy tất cả receipts liên quan đến các booking này (để lấy orderid)
		const allOrderIds = bookings.flatMap(b => b.receipts.map(r => r.orderid).filter((oid): oid is number => typeof oid === 'number'));
		// Lấy order_product và products
		let orderProducts: any[] = [];
		if (allOrderIds.length) {
			orderProducts = await this.prisma.order_product.findMany({
				where: { orderid: { in: allOrderIds } },
				select: {
					orderid: true,
					productid: true,
					quantity: true,
					returndate: true,
					products: { select: { productname: true } },
				},
			});
		}
		// Gom order_product theo orderid
		const orderProductMap = new Map<number, any[]>();
		for (const op of orderProducts) {
			if (typeof op.orderid !== 'number') continue;
			if (!orderProductMap.has(op.orderid)) orderProductMap.set(op.orderid, []);
			orderProductMap.get(op.orderid)!.push(op);
		}

		// 4. Gom theo court
		const now = new Date();
		const result: any[] = [];
		for (const court of courts) {
			// Lấy tất cả booking của sân này trong ngày
			const bookingsOfCourt = courtBookings.filter(cb => cb.courtid === court.courtid);
			// Gom theo status
			const upcoming: any[] = [];
			const ongoing: any[] = [];
			const completed: any[] = [];
			let count_booking = 0;
			let revenue = 0;
			for (const cb of bookingsOfCourt) {
				if (!cb.starttime || !cb.endtime || typeof cb.bookingid !== 'number') continue;
				const booking = bookingMap.get(cb.bookingid);
				if (!booking) continue;
				// Xác định trạng thái thời gian
				let statusGroup: any[] | null = null;
				if (cb.starttime > now) statusGroup = upcoming;
				else if (cb.starttime <= now && cb.endtime > now) statusGroup = ongoing;
				else if (cb.endtime <= now) statusGroup = completed;
				if (!statusGroup) continue;
				// Tính revenue: tổng totalamount của receipts
				const bookingRevenue = (booking.receipts || []).reduce((sum, r) => sum + Number(r.totalamount || 0), 0);
				revenue += bookingRevenue;
				count_booking++;
				// Lấy products/rentals từ receipts -> orderid -> order_product
				let products: any[] = [];
				let rentals: any[] = [];
				for (const receipt of (booking.receipts || [])) {
					if (typeof receipt.orderid !== 'number') continue;
					const ops = orderProductMap.get(receipt.orderid) || [];
					for (const op of ops) {
						const prod = {
							productid: op.productid,
							productname: op.products.productname,
							quantity: op.quantity,
						};
						if (op.returndate) rentals.push({ ...prod, rentaldate: op.returndate });
						else products.push(prod);
					}
				}
				// Push vào group
				const detail = {
					starttime: cb.starttime,
					endtime: cb.endtime,
					duration: cb.duration,
					date: cb.starttime,
					zone: court.zones?.zonename || '',
					guestphone: booking.guestphone,
					totalamount: bookingRevenue,
					products,
					rentals,
				};
				statusGroup.push(detail);
			}
			result.push({
				courtid: court.courtid,
				courtname: court.courtname,
				count_booking,
				revenue,
				upcoming,
				ongoing,
				completed,
			});
		}
		return result;
	}
}
