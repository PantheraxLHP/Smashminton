import { Filters, SelectedCourts } from '@/app/booking/courts/page';
import { ServiceResponse } from '@/lib/serviceResponse';

export const getCourts = async (filter: Filters) => {
    try {
        const queryParams = new URLSearchParams({
            zoneid: filter.zone ? String(filter.zone.charCodeAt(0) - 64) : '1',
            date: filter.date || '',
            duration: filter.duration ? String(filter.duration) : '0',
            starttime: filter.startTime || '',
            fixedCourt: filter.fixedCourt ? 'true' : 'false',
        });

        const response = await fetch(`/api/booking/get-courts?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể tải danh sách sân khả dụng');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách sân khả dụng');
    }
};

export const getDisableStartTimes = async (filter: Filters) => {
    try {
        const queryParams = new URLSearchParams({
            zoneid: filter.zone ? String(filter.zone.charCodeAt(0) - 64) : '1',
            date: filter.date || '',
            duration: filter.duration ? String(filter.duration) : '0',
        });

        const response = await fetch(`/api/booking/get-disable-starttimes?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể tải danh sách giờ không khả dụng');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Không thể tải danh sách giờ không khả dụng',
        );
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

export const deleteBookingCourt = async (bookingData: { username?: string; court_booking: SelectedCourts }) => {
    try {
        const modifiedBookingData = {
            ...bookingData,
            court_booking: {
                ...bookingData.court_booking,
                price: Number(bookingData.court_booking.price) || 0,
                duration: Number(bookingData.court_booking.duration) || 0,
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
