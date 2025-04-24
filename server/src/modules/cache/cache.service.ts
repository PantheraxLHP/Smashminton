import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import Keyv from 'keyv';
import { CacheCourtBooking } from 'src/interfaces/bookings.interface';
@Injectable()
export class CacheService {
    constructor(
        private readonly keyv: Keyv,
        private readonly studentCard: Keyv,
        private readonly booking: Keyv,
        private readonly redisClient: Redis, // Redis client
    ) {}

    async get(key: string){
        return this.keyv.get(key);
    }

    async getStudentCard(key: string){
        return this.studentCard.get(key);
    }

    async setStudentCard(key: string, value: any, ttl: number = 0): Promise<boolean> {
        return this.studentCard.set(key, value, ttl*1000);
    }

    async getBooking(key: string){
        return this.booking.get(key);
    }

    async setBooking(key: string, value: any, ttl: number = 0): Promise<boolean> {
        return this.booking.set(key, value, ttl*1000);
    }

    async getAllCacheBookings(date: string): Promise<CacheCourtBooking[]> {
        // Lấy tất cả các key trong namespace 'booking'
        const keys = await this.redisClient.keys('booking:*');
        if (keys.length === 0) {
            return []; // Trả về mảng rỗng nếu không có key nào
        }

        const bookings: any[] = [];

        for (const key of keys) {
            // Loại bỏ prefix 'booking:' để lấy key gốc
            const actualKey = key.replace('booking::booking:', ''); // Loại bỏ prefix 'booking:'
            const value = await this.booking.get(actualKey);
            if (value) {
                bookings.push(value); // Thêm key và value vào danh sách
            }
        }
        // Gộp tất cả các court_booking thành một mảng duy nhất và chỉ lấy các trường cần thiết
        const courtBookings = bookings.flatMap((booking) =>
            booking.court_booking.map((court: any) => ({
                date: court.date,
                courtid: court.courtid,
                starttime: court.starttime,
                endtime: court.endtime,
            })));
            
        // Lọc `courtBookings` theo `date`
        const filteredCourtBookings = courtBookings.filter((court) => court.date === date);
        return filteredCourtBookings;
    }

    async set(key: string, value: any, ttl: number = 0): Promise<boolean> {
        return this.keyv.set(key, value, ttl*1000);
    }

    async delete(key: string): Promise<boolean> {
        return this.keyv.delete(key);
    }
}
