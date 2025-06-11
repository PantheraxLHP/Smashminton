import { ServiceResponse } from '@/lib/serviceResponse';
import { formatDateString } from '@/lib/utils';

export const getShiftDate = async (dayfrom: Date, dayto: Date, employee_type: string) => {
    try {
        const queryParams = new URLSearchParams({
            dayfrom: formatDateString(dayfrom),
            dayto: formatDateString(dayto),
            employee_type: employee_type,
        });

        const response = await fetch(`/api/shiftdate/get-shiftdate?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể tải danh sách ngày làm việc');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách ngày làm việc');
    }
};
