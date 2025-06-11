import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const zonename = formData.get('zonename')?.toString() || '';
        const zonetype = formData.get('zonetype')?.toString() || '';
        const zonedescription = formData.get('zonedescription')?.toString() || '';
        const imageFile = formData.get('image') as File | null;

        const backendForm = new FormData();
        backendForm.append('zonename', zonename);
        backendForm.append('zonetype', zonetype);
        backendForm.append('zonedescription', zonedescription);
        if (imageFile) {
            backendForm.append('zoneimgurl', imageFile);
        }

        const backendUrl = `${process.env.SERVER}/api/v1/zones/new-zone`;

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
