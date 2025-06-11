import { ServiceResponse } from '@/lib/serviceResponse';

export const postCourts = async (formData: FormData) => {
    try {
        const response = await fetch('/api/courts/post-courts', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu'
        );
    }
};