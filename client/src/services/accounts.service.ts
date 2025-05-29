import { ServiceResponse } from '@/lib/serviceResponse';

export const getUser = async (accountId: number) => {
    try {
        const queryParams = new URLSearchParams();

        if (accountId) {
            queryParams.set('accountId', accountId.toString());
        }
        const response = await fetch(`/api/accounts/get-user?${queryParams.toString()}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
};

export const updateProfile = async (accountId: number, formData: FormData) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.set('accountId', accountId.toString());

        const response = await fetch(`/api/accounts/update-profile?${queryParams.toString()}`, {
            method: 'PUT',
            body: formData,
            credentials: 'include',
            // @ts-expect-error - TypeScript doesn't recognize duplex option yet
            duplex: 'half',
        });

        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể cập nhật thông tin');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể cập nhật thông tin');
    }
};
