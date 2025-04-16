import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { cacheBookingDTO } from './dto/create-cache-booking.dto';
import { calculateEndTime } from '../../utilities/date.utilities';
import { CacheBooking, CacheCourtBooking } from 'src/interfaces/bookings.interface';
@Injectable()
export class BookingsService {
  constructor(
	private prisma: PrismaService,
	private cacheService: CacheService,
  ) { }
  create(createBookingDto: CreateBookingDto) {
	return 'This action adds a new booking';
  }
  async addBookingToCache(CacheBookingDTO: cacheBookingDTO): Promise<CacheBooking> {
    const { customerid, court_booking } = CacheBookingDTO;

    // Mapping từng phần tử trong mảng court_booking thành một object JSON
	const courtBooking: CacheCourtBooking[] = court_booking.map((booking) => {
		const startTime = booking.date + ' ' + booking.starttime;
		const endTime = calculateEndTime(booking.date, booking.starttime, booking.duration);
	  
		return {
		  starttime: new Date(startTime),
		  duration: booking.duration,
		  endtime: new Date(endTime),
		};
	  });

    // Tạo JSON cacheBooking
    const cacheBooking: CacheBooking = {
        customerid,
        court_booking: courtBooking,
    };

    // Trả về JSON cacheBooking
    return cacheBooking;
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
