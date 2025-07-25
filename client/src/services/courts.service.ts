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


export const patchCourts = async (
    courtid: number,
    data: {
        courtname: string;
        statuscourt: 'Active' | 'Inactive';
        avgrating: number;
        timecalculateavg: string;
        courtimgurl?: string | File | null;
        zoneid: number;
    }
) => {
    try {
        const formData = new FormData();
        formData.append('courtid', courtid.toString());
        formData.append('courtname', data.courtname);
        formData.append('statuscourt', data.statuscourt);
        formData.append('avgrating', data.avgrating.toString());
        formData.append('timecalculateavg', data.timecalculateavg);
        formData.append('zoneid', data.zoneid.toString());

        if (data.courtimgurl instanceof File) {
            formData.append('courtimgurl', data.courtimgurl);
        }

        const response = await fetch(`/api/courts/patch-courts`, {
            method: 'PATCH',
            body: formData,
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Không thể cập nhật sân');
        }

        return result.data;
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'Không thể cập nhật sân'
        );
    }
};
