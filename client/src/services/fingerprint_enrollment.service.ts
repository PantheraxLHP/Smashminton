import { ServiceResponse } from '@/lib/serviceResponse';

export const postEnrollFingerprint = async (data: { roomID: number, employeeID: number }) => {
    try {
        const response = await fetch(`/api/fingerprint/enroll-fingerprint`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return ServiceResponse.error(errorData.message || 'Đã có lỗi xảy ra, thử lại sau vài giây!');
        }

        const result = await response.json();
        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Đã có lỗi xảy ra, thử lại sau vài giây!');
    }
}