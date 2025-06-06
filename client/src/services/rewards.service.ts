import { ServiceResponse } from '@/lib/serviceResponse';
import { serializeFilterValue } from '@/lib/utils';

export const getRewards = async (page: number, pageSize: number, filterValue: Record<string, any> = {}) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        serializeFilterValue(queryParams, filterValue);

        const response = await fetch(`/api/reward-record/get-rewards?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể tải danh sách thưởng');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách thưởng');
    }
};
