import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const courtname = formData.get('courtname')?.toString() || '';
        const zoneid = formData.get('zoneid')?.toString() || '';
        const imageFile = formData.get('image') as File | null;

        const backendForm = new FormData();
        backendForm.append('courtname', courtname);
        backendForm.append('zoneid', zoneid);
        if (imageFile) {
            backendForm.append('courtimgurl', imageFile);
        }

        const backendUrl = `${process.env.SERVER}/api/v1/courts/new-court`;

        const response = await fetch(backendUrl, {
            method: 'POST',
            body: backendForm,
            credentials: 'include',
        });

        if (!response.ok) {
            const text = await response.text();
            return ApiResponse.error(`Backend error ${response.status}: ${text}`);
        }

        const result = await response.json();
        return ApiResponse.success(result);
    } catch (err) {
        return ApiResponse.error(err instanceof Error ? err.message : 'Lỗi route POST Zone');
    }
}
