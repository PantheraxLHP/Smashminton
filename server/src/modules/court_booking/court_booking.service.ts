import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { convertUTCToVNTime } from 'src/utilities/date.utilities';
import dayjs from 'dayjs';
import { CourtsService } from '../courts/courts.service';
import { AvailableCourts } from 'src/interfaces/court_booking.interface';
import { CacheService } from '../cache/cache.service';
import { courtBookingDto } from '../bookings/dto/create-cache-booking.dto';
import { Cron } from '@nestjs/schedule';
import { AppGateway } from 'src/mqtt/app.gateway';

@Injectable()
export class CourtBookingService {
    constructor(
        private prisma: PrismaService,
        private courtsService: CourtsService, // Inject CourtsService
        private cacheService: CacheService, // Inject CacheService
        private appGateway: AppGateway,
    ) { }

    private readonly allStartTimes: string[] = [
        '06:00',
        '06:30',
        '07:00',
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
    ];

    async getAvaliableCourts(
        zoneid: number,
        date: string,
        starttime: string,
        duration: number,
    ): Promise<AvailableCourts[]> {
        if (!zoneid || !date || !starttime || !duration) {
            throw new BadRequestException('Missing query parameters court_booking');
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

        // Lấy số sân tối đa của zone
        const filteredCourtByDayFromTo = await this.courtsService.getCourtsIDByDayFrom_To(parsedZoneId, date);
        const maxCourts = filteredCourtByDayFromTo.length;

        const unavailableStartTimes: string[] = [];

        // Với mỗi starttime, kiểm tra số sân available
        for (const starttime of this.allStartTimes) {
            try {
                // Gọi hàm getAvaliableCourts để lấy số sân available
                const availableCourts = await this.getAvaliableCourts(zoneid, date, starttime, duration);
                const availableCount = availableCourts.length;

                // Nếu số sân available = 0 thì unavailable
                if (availableCount === 0) {
                    unavailableStartTimes.push(starttime);
                }
            } catch (error) {
                // Nếu có lỗi, coi như unavailable để an toàn
                unavailableStartTimes.push(starttime);
            }
        }

        // Xử lý trường hợp duration vượt quá thời gian hoạt động
        const maxStartTimeIndex = this.allStartTimes.length - 1;
        const durationSlots = Math.ceil((duration * 60) / 30); // Số slot 30 phút cần thiết cho duration

        // Block các starttime cuối nếu duration vượt quá giờ hoạt động
        for (let i = maxStartTimeIndex - durationSlots + 2; i <= maxStartTimeIndex; i++) {
            if (i >= 0 && i < this.allStartTimes.length) {
                const starttime = this.allStartTimes[i];
                if (!unavailableStartTimes.includes(starttime)) {
                    unavailableStartTimes.push(starttime);
                }
            }
        }

        const today = dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
        // Chỉ block các `starttime` trước thời gian hiện tại nếu ngày được chọn là ngày hiện tại
        if (date === today) {
            const now = dayjs().tz('Asia/Ho_Chi_Minh').format('HH:mm');

            for (const starttime of this.allStartTimes) {
                if (starttime < now && !unavailableStartTimes.includes(starttime)) {
                    unavailableStartTimes.push(starttime);
                }
            }
        }

        return unavailableStartTimes;
    }

    async getUnavailableStartTimesForFixedCourt(zoneid: number, date: string, duration: number): Promise<string[]> {
        if (!zoneid || !date || !duration) {
            throw new BadRequestException('Missing query parameters for fixed court booking');
        }

        const parsedZoneId = Number(zoneid);

        // Lấy số sân tối đa của zone
        const filteredCourtByDayFromTo = await this.courtsService.getCourtsIDByDayFrom_To(parsedZoneId, date);
        const maxCourts = filteredCourtByDayFromTo.length;

        const unavailableStartTimes: string[] = [];

        // Với mỗi starttime, kiểm tra số sân available cho fixed court
        for (const starttime of this.allStartTimes) {
            try {
                // Gọi hàm getAvailableFixedCourts để lấy số sân available
                const availableFixedCourts = await this.getAvailableFixedCourts(zoneid, date, starttime, duration);
                const availableCount = availableFixedCourts.length;

                // Nếu số sân available = 0 thì unavailable
                if (availableCount === 0) {
                    unavailableStartTimes.push(starttime);
                }
            } catch (error) {
                // Nếu có lỗi, coi như unavailable để an toàn
                unavailableStartTimes.push(starttime);
            }
        }

        // Xử lý trường hợp duration vượt quá thời gian hoạt động
        const maxStartTimeIndex = this.allStartTimes.length - 1;
        const durationSlots = Math.ceil((duration * 60) / 30); // Số slot 30 phút cần thiết cho duration

        // Block các starttime cuối nếu duration vượt quá giờ hoạt động
        for (let i = maxStartTimeIndex - durationSlots + 2; i <= maxStartTimeIndex; i++) {
            if (i >= 0 && i < this.allStartTimes.length) {
                const starttime = this.allStartTimes[i];
                if (!unavailableStartTimes.includes(starttime)) {
                    unavailableStartTimes.push(starttime);
                }
            }
        }

        const today = dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
        // Chỉ block các `starttime` trước thời gian hiện tại nếu ngày đầu tiên được chọn là ngày hiện tại
        if (date === today) {
            const now = dayjs().tz('Asia/Ho_Chi_Minh').format('HH:mm');

            for (const starttime of this.allStartTimes) {
                if (starttime < now && !unavailableStartTimes.includes(starttime)) {
                    unavailableStartTimes.push(starttime);
                }
            }
        }

        return unavailableStartTimes;
    }

    async getSeparatedCourtPrices(courtBookingDTO: courtBookingDto): Promise<AvailableCourts[]> {
        return await this.courtsService.separateCourtPrice(courtBookingDTO);
    }

    async getSeparatedFixedCourtPrices(courtBookingDTO: courtBookingDto): Promise<AvailableCourts[]> {
        return await this.courtsService.separateFixedCourtPrice(courtBookingDTO);
    }

    async getAvailableFixedCourts(
        zoneid: number,
        date: string,
        starttime: string,
        duration: number,
    ): Promise<AvailableCourts[]> {
        // Validation
        if (!zoneid || !date || !starttime || !duration) {
            throw new BadRequestException('Missing required parameters for fixed court booking');
        }

        // Bước 1: Tạo danh sách 4 ngày đặt sân, mỗi ngày cách nhau 7 ngày
        const bookingDates: string[] = [];
        for (let i = 0; i < 4; i++) {
            const bookingDate = dayjs(date)
                .add(i * 7, 'day')
                .format('YYYY-MM-DD');
            bookingDates.push(bookingDate);
        }

        // Bước 2: Lấy tất cả court bookings cho 4 ngày
        const courtBookings = await this.prisma.court_booking.findMany({
            where: {
                date: { in: bookingDates.map((d) => new Date(d)) },
            },
            select: {
                courtid: true,
                date: true,
                starttime: true,
                endtime: true,
            },
        });

        // Convert court bookings to VN time
        const convertedCourtBookings = courtBookings.map((item) => ({
            courtid: item.courtid,
            date: dayjs(item.date).format('YYYY-MM-DD'),
            starttime: item.starttime ? convertUTCToVNTime(item.starttime.toISOString()) : null,
            endtime: item.endtime ? convertUTCToVNTime(item.endtime.toISOString()) : null,
        }));

        // Bước 3: Lấy cache bookings cho tất cả 4 ngày
        const allCacheBookings: any[] = [];
        for (const bookingDate of bookingDates) {
            const cacheBookings = await this.cacheService.getAllCacheBookings(bookingDate);
            allCacheBookings.push(
                ...cacheBookings.map((booking) => ({
                    ...booking,
                    date: bookingDate,
                })),
            );
        }

        // Merge tất cả bookings
        const mergedBookings = [...convertedCourtBookings, ...allCacheBookings];

        // Bước 4: Lấy giá sân cho từng ngày
        const allCourtPrices: (AvailableCourts & { date: string })[] = [];
        for (const bookingDate of bookingDates) {
            const courtPrices = await this.courtsService.getCourtPrices(zoneid, bookingDate, starttime, duration);
            allCourtPrices.push(
                ...courtPrices.map((price) => ({
                    ...price,
                    date: bookingDate,
                })),
            );
        }

        // Bước 5: Group court prices theo courtid
        const courtPricesByCourtId: { [key: number]: (AvailableCourts & { date: string })[] } = {};
        allCourtPrices.forEach((price) => {
            if (!courtPricesByCourtId[price.courtid]) {
                courtPricesByCourtId[price.courtid] = [];
            }
            courtPricesByCourtId[price.courtid].push(price);
        });

        // Bước 6: Kiểm tra từng sân xem có khả dụng cho tất cả 4 ngày không
        const availableFixedCourts: AvailableCourts[] = [];

        for (const [courtIdStr, prices] of Object.entries(courtPricesByCourtId)) {
            const courtId = parseInt(courtIdStr);

            // Kiểm tra sân này có đủ 4 slot giá không (tức là có thể đặt được 4 ngày)
            if (prices.length === 4) {
                // Kiểm tra xem có conflict với booking nào không
                const hasConflict = prices.some((price) => {
                    return this.checkTimeConflict(price, mergedBookings);
                });

                if (!hasConflict) {
                    // Tính tổng giá 4 lần đặt
                    const totalPrice = prices.reduce((sum, price) => sum + price.price, 0);

                    // Tạo object kết quả với thông tin cơ bản từ lần đầu và giá tổng
                    const fixedCourtBooking: AvailableCourts = {
                        zoneid: prices[0].zoneid,
                        courtid: prices[0].courtid,
                        courtname: prices[0].courtname,
                        courtimgurl: prices[0].courtimgurl,
                        avgrating: prices[0].avgrating,
                        date: prices[0].date,
                        starttime: prices[0].starttime,
                        endtime: prices[0].endtime,
                        duration: prices[0].duration,
                        price: totalPrice, // Giá tổng của 4 lần đặt
                    };

                    availableFixedCourts.push(fixedCourtBooking);
                }
            }
        }

        return availableFixedCourts;
    }

    // Helper function kiểm tra conflict thời gian
    private checkTimeConflict(courtPrice: AvailableCourts & { date: string }, bookings: any[]): boolean {
        // Lọc các booking cùng sân và cùng ngày
        const courtBookings = bookings.filter(
            (booking) => booking.courtid === courtPrice.courtid && booking.date === courtPrice.date,
        );

        if (courtBookings.length === 0) return false;

        const priceStart = dayjs(courtPrice.starttime, 'HH:mm');
        const priceEnd = dayjs(courtPrice.endtime, 'HH:mm');

        // Kiểm tra overlap với bất kỳ booking nào
        return courtBookings.some((booking) => {
            const bookingStart = dayjs(booking.starttime, 'HH:mm');
            const bookingEnd = dayjs(booking.endtime, 'HH:mm');
            // Kiểm tra nếu thời gian của courtPrice giao với thời gian của booking
            return priceStart.isBefore(bookingEnd) && bookingStart.isBefore(priceEnd);
        });
    }

    findAll() {
        return this.prisma.court_booking.findMany();
    }

    @Cron('0 */15 6-22 * * *') // Chạy mỗi 15 phút
    // @Cron('0/10 * * * * *') // Chạy mỗi 10 giây 
    async regularCourtBookingNotify() {
        const now = new Date();
        const courtBookings = await this.prisma.court_booking.findMany({
            where: {
                starttime: {
                    lte: now,
                },
                endtime: {
                    gte: now,
                },
            },
            include: {
                courts: {
                    include: {
                        zones: true,
                    },
                },
            },
        });

        if (!courtBookings || courtBookings.length === 0) {
            return;
        }

        const zoneCourt = new Map<string, string[]>();
        for (const booking of courtBookings) {
            if ((booking?.endtime?.getTime() || 0) - 15 * 60 * 1000 > now.getTime()) {
                continue; // Chỉ thông báo nếu còn 15 phút nữa đến giờ kết thúc
            }

            const zoneName = booking?.courts?.zones?.zonename || 'Unknown Zone';
            if (!zoneCourt.has(zoneName)) {
                zoneCourt.set(zoneName, []);
            }
            zoneCourt.get(zoneName)?.push(booking?.courts?.courtname || 'Unknown Court');
        }

        if (zoneCourt.size === 0) {
            return;
        }

        this.appGateway.regularCourtBookingCheck(zoneCourt);
    }
}
