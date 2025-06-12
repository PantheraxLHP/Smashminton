import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const formData = await request.formData();

        console.log('[DEBUG] PATCH formData received:');
        for (const entry of formData.entries()) {
            console.log(`  ${entry[0]}:`, entry[1]);
        }

        const courtid = Number(formData.get('courtid'));
        const courtname = formData.get('courtname')?.toString();
        const statuscourt = formData.get('statuscourt')?.toString();
        const avgrating = Number(formData.get('avgrating'));
        const timecalculateavg = formData.get('timecalculateavg')?.toString();
        const zoneid = Number(formData.get('zoneid'));
        const courtimgurl = formData.get('courtimgurl') as File | null;

        if (!courtid) {
            return ApiResponse.error('Thiếu courtid trong form data!');
        }

        const uploadData = new FormData();
        uploadData.append('courtname', courtname ?? '');
        uploadData.append('statuscourt', statuscourt ?? '');
        uploadData.append('avgrating', avgrating.toString());
        uploadData.append('timecalculateavg', timecalculateavg ?? '');
        uploadData.append('zoneid', zoneid.toString());
        if (courtimgurl && courtimgurl instanceof Blob) {
            uploadData.append('courtimgurl', courtimgurl);
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/courts/${courtid}`, {
            method: 'PATCH',
            body: uploadData,
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] Backend error response:', result);
            return ApiResponse.error(`Lỗi server! Mã lỗi: ${response.status}`);
        }

        console.log('[DEBUG] Backend PATCH response:', result);
        return ApiResponse.success(result);

    } catch (error) {
        console.error('[ERROR] PATCH route exception:', error);
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi khi cập nhật sân');
    }
}
