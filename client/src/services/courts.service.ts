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

        console.log('[DEBUG] Sending patchCourts with formData:');
        for (const pair of formData.entries()) {
            console.log(`  ${pair[0]}:`, pair[1]);
        }

        const response = await fetch(`/api/courts/patch-courts`, {
            method: 'PATCH',
            body: formData,
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] patchCourts failed:', result);
            return ServiceResponse.error(result.message || 'Không thể cập nhật sân');
        }

        console.log('[DEBUG] patchCourts success:', result);
        return ServiceResponse.success(result.data);
    } catch (error) {
        console.error('[ERROR] patchCourts exception:', error);
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Không thể cập nhật sân'
        );
    }
};