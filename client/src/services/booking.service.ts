import { ServiceResponse } from '@/lib/serviceResponse';

interface BookingFilters {
    zone?: string;
    date?: string;
    duration?: number;
    startTime?: string;
    fixedCourt?: boolean;
}

export const getCourtsAndDisableStartTimes = async (filters: BookingFilters) => {
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
