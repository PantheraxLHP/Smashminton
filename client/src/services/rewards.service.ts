import { ServiceResponse } from '@/lib/serviceResponse';

export const getRewards = async (page: number, pageSize: number, filterValue: Record<string, any> = {}) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });
        // Serialize filterValue
        Object.entries(filterValue).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    if (v !== undefined && v !== null && v !== '') queryParams.append(key, v);
                });
            } else if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });

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
