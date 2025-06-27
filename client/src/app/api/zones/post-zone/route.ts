import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

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
            headers: {
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
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
