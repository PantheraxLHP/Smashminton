import { Filters, SelectedCourts } from '@/app/booking/courts/page';
import { BookingContextProps } from '@/context/BookingContext';
import { ServiceResponse } from '@/lib/serviceResponse';

export type BookingData = Pick<BookingContextProps, 'selectedCourts' | 'selectedProducts' | 'totalPrice' | 'TTL'>;

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

export const getBookingRedis = async (username: string) => {
    try {
        const queryParams = new URLSearchParams({
            username: username || '',
        });

        const response = await fetch(`/api/booking/get-booking?${queryParams.toString()}`, {
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

export const postBookingCourt = async (bookingData: { username?: string; court_booking: SelectedCourts }) => {
    try {
        const modifiedBookingData = {
            ...bookingData,
            court_booking: {
                ...bookingData.court_booking,
                filters: undefined,
                price: Number(bookingData.court_booking.price) || 0,
                duration: Number(bookingData.court_booking.duration) || 0,
            },
        };

        const response = await fetch('/api/booking/post-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modifiedBookingData),
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

export const deleteBookingCourt = async (bookingData: { username?: string; courtBooking: SelectedCourts }) => {
    try {
        const modifiedBookingData = {
            ...bookingData,
            courtBooking: {
                ...bookingData.courtBooking,
                filters: undefined,
                price: Number(bookingData.courtBooking.price) || 0,
                duration: Number(bookingData.courtBooking.duration) || 0,
            },
        };

        const response = await fetch('/api/booking/delete-booking', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modifiedBookingData),
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
