import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { PrismaService } from '../prisma/prisma.service';
import { calculateEndTime_HHMM, getEnglishDayName } from 'src/utilities/date.utilities';
import { CourtPrices } from 'src/interfaces/courts.interface';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { courtBookingDto } from '../bookings/dto/create-cache-booking.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
@Injectable()
export class CourtsService {
    constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) { }

    async createCourt(createCourtDto: CreateCourtDto, file: Express.Multer.File) {
        let imageUrl = '';

        if (file) {
            // If files are provided, upload them to Cloudinary
            const uploadResults = await this.cloudinaryService.uploadCourtImg(file); // Changed to handle multiple files
            imageUrl = uploadResults.secure_url || '';
            if (!imageUrl) {
                throw new BadRequestException('Failed to upload files');
            }
        }

        createCourtDto.courtimgurl = imageUrl;

        const newCourt = await this.prisma.courts.create({
            data: {
                ...createCourtDto,
                statuscourt: 'Active',
                avgrating: 5.0,
                timecalculateavg: new Date(),
            },
        });

        if (!newCourt) {
            throw new BadRequestException('Tạo sân thất bại');
        }

        return {
            message: 'Tạo sân thành công',
            data: newCourt,
        };
    }

    findAll() {
        return `This action returns all courts`;
    }

    async getCourtsIDByDayFrom_To(zoneid: number, date: string) {
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
        const filteredCourtByDayFromTo = await this.prisma.courts.findMany({
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
                                price: true,
                            },
                        },
                    },
                },
            },
        });

        const filteredCourtIDByDayFromToWithoutZones = filteredCourtByDayFromTo.map(court => court.courtid);

        return filteredCourtIDByDayFromToWithoutZones;
    }

    async getCourtPrices(zoneid: number, date: string, starttime: string, duration: number): Promise<CourtPrices[]> {
        const parsedStartTime = dayjs(starttime, 'HH:mm');
        const endtime = calculateEndTime_HHMM(starttime, duration);
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
                zoneid: true,
                courtid: true,
                courtname: true,
                courtimgurl: true,
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
                zoneid: court.zoneid,
                courtid: court.courtid,
                courtname: court.courtname,
                courtimgurl: court.courtimgurl,
                dayfrom: zonePrice.dayfrom,
                dayto: zonePrice.dayto,
                starttime: zonePrice.starttime,
                endtime: zonePrice.endtime,
                price: zonePrice.price,
            })) || []
        );

        // Sử dụng Map để nhóm kết quả theo courtid
        const courtResults = new Map<number, {
            zoneid: number;
            courtid: number;
            courtname: string;
            courtimgurl: string;
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
                        zoneid: zone.zoneid ?? 0,
                        courtid: zone.courtid,
                        courtname: zone.courtname ?? '',
                        courtimgurl: zone.courtimgurl ?? '',
                        totalPrice: priceForZone,
                        dayfrom: zone.dayfrom ?? '',
                        dayto: zone.dayto ?? '',
                    });
                }
            }
        }
        // Chuyển Map thành mảng kết quả
        const availableCourts = Array.from(courtResults.values()).map((court) => ({
            zoneid: court.zoneid,
            courtid: court.courtid,
            courtname: court.courtname,
            courtimgurl: court.courtimgurl,
            date: date,
            duration: Number(duration),
            starttime: starttime,
            endtime: endtime,
            price: court.totalPrice, // Làm tròn giá trị tiền
        }));

        return availableCourts;
    }

    async separateCourtPrice(CourtBookingDTO: courtBookingDto): Promise<CourtPrices[]> {
        const { zoneid, starttime, endtime, date, courtid } = CourtBookingDTO;
        const parsedStartTime = dayjs(starttime, 'HH:mm');

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

        // Truy vấn tất cả các giá sân phù hợp
        const zonePricesByAllCourts = await this.prisma.courts.findMany({
            where: {
                zoneid: parsedZoneId,
                courtid: courtid,
            },
            select: {
                zoneid: true,
                courtid: true,
                courtname: true,
                courtimgurl: true,
                zones: {
                    select: {
                        zone_prices: {
                            where: {
                                dayfrom: DayFrom,
                                dayto: DayTo,
                            },
                            select: {
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
                zoneid: court.zoneid,
                courtid: court.courtid,
                courtname: court.courtname,
                courtimgurl: court.courtimgurl,
                starttime: zonePrice.starttime,
                endtime: zonePrice.endtime,
                price: zonePrice.price,
            })) || []
        );

        const separatedPrices: CourtPrices[] = [];

        for (const zone of allZonePrices) {
            const zoneStart = dayjs(zone.starttime, 'HH:mm');
            const zoneEnd = dayjs(zone.endtime, 'HH:mm');

            // Tính khoảng giao nhau giữa thời gian người dùng và khung giờ của zone
            const actualStart = parsedStartTime.isAfter(zoneStart) ? parsedStartTime : zoneStart;
            const actualEnd = parsedEndTime.isBefore(zoneEnd) ? parsedEndTime : zoneEnd;

            if (actualStart.isBefore(actualEnd)) {
                const durationInHours = actualEnd.diff(actualStart, 'minutes') / 60; // phút -> giờ
                const priceForDuration = durationInHours * parseFloat((zone.price ?? '0').toString());

                separatedPrices.push({
                    zoneid: zone.zoneid ?? 0,
                    courtid: zone.courtid,
                    courtname: zone.courtname ?? '',
                    courtimgurl: zone.courtimgurl ?? '',
                    date: date,
                    starttime: actualStart.format('HH:mm'),
                    endtime: actualEnd.format('HH:mm'),
                    duration: durationInHours,
                    price: priceForDuration, // Làm tròn giá trị tiền
                });
            }
        }
        return separatedPrices;
    }

    async separateFixedCourtPrice(CourtBookingDTO: courtBookingDto): Promise<CourtPrices[]> {
        const { zoneid, starttime, endtime, date, courtid } = CourtBookingDTO;

        // Tạo danh sách 4 ngày đặt sân, mỗi ngày cách nhau 7 ngày
        const bookingDates: string[] = [];
        for (let i = 0; i < 4; i++) {
            const bookingDate = dayjs(date).add(i * 7, 'day').format('YYYY-MM-DD');
            bookingDates.push(bookingDate);
        }

        const allSeparatedPrices: CourtPrices[] = [];

        // Tách giá cho từng ngày trong 4 tuần
        for (let i = 0; i < bookingDates.length; i++) {
            const currentDate = bookingDates[i];

            // Tạo DTO cho ngày hiện tại
            const currentCourtBookingDTO: courtBookingDto = {
                ...CourtBookingDTO,
                date: currentDate
            };

            // Gọi hàm separateCourtPrice cho ngày hiện tại
            const separatedPricesForDate = await this.separateCourtPrice(currentCourtBookingDTO);

            // Thêm thông tin tuần vào mỗi price object
            const pricesWithWeekInfo = separatedPricesForDate.map(price => ({
                ...price,
                date: currentDate,
            }));

            allSeparatedPrices.push(...pricesWithWeekInfo);
        }

        return allSeparatedPrices;
    }
}
