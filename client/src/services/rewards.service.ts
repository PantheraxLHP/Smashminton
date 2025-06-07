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

export const approveRewards = async (recordIds: number[]) => {
    try {
        const response = await fetch(`/api/reward-record/patch-approve`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(recordIds),
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

export const rejectRewards = async (recordIds: number[]) => {
    try {
        const response = await fetch(`/api/reward-record/patch-reject`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(recordIds),
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

export const postRewardRecord = async (rewardData: {
    employeeId: number;
    rewardType: string;
    rewardAmount: number;
    rewardNote: string;
}) => {
    try {
        const response = await fetch(`/api/reward-record/post-reward`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(rewardData),
        });

        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thêm ghi chú');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thêm ghi chú');
    }
};

export const getRewardRules = async () => {
    try {
        const response = await fetch(`/api/reward-record/get-reward-rules`, {
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
