import { BookingBottomSheetProps } from '@/app/booking/_components/BookingBottomSheet';
import { Filters } from '@/app/booking/courts/page';
import { ServiceResponse } from '@/lib/serviceResponse';

export type BookingData = Pick<BookingBottomSheetProps, 'selectedCourts' | 'selectedProducts' | 'totalPrice' | 'TTL'>;

export const getCourtsAndDisableStartTimes = async (filters: Filters) => {
    try {
        const zoneid = filters.zone ? filters.zone.charCodeAt(0) - 64 : undefined;

        const queryParams = new URLSearchParams({
            zoneid: zoneid?.toString() || '',
            date: filters.date || '',
            starttime: filters.startTime || '',
            duration: filters.duration?.toString() || '',
            fixedCourt: filters.fixedCourt?.toString() || '',
        });

        const response = await fetch(`/api/booking/courts-disable_start_times?${queryParams.toString()}`);
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Lỗi khi tải danh sách sân');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách sân');
    }
};

export const getBookingRedis = async () => {
    try {
        const response = await fetch('/api/booking/get-booking', {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện đặt sân');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện đặt sân');
    }
};

export const postBookingRedis = async (bookingData: BookingData) => {
    try {
        const response = await fetch('/api/booking/post-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData),
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện đặt sân');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện đặt sân');
    }
};
