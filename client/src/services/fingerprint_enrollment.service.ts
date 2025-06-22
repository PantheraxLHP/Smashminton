import { ServiceResponse } from '@/lib/serviceResponse';

export const getNextAvailableFingerprintId = async () => {
    try {
        const response = await fetch(`/api/fingerprint/getAvailableFingerprint`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(result.data.nextAvailableId);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
};

export const postEnrollFingerprint = async (data: {fingerID: number, employeeID: number}) => {
    try {
        const response = await fetch(`/api/fingerprint/enroll-fingerprint`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return ServiceResponse.error(errorData.message || 'Không thể thực hiện yêu cầu');
        }

        const result = await response.json();
        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
}