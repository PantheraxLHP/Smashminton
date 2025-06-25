import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) {
            return ApiResponse.error('Thiếu id trong query string');
        }

        const formData = await request.formData();

        const backendRes = await fetch(
            `${process.env.SERVER}/api/v1/products/${id}/update-services`,
            {
                method: 'PATCH',
                body: formData,
            }
        );

        if (!backendRes.ok) {
            const text = await backendRes.text();
            return ApiResponse.error(`Lỗi ${backendRes.status}: ${text}`);
        }

        const data = await backendRes.json();
        return ApiResponse.success(data);
    } catch (err) {
        console.error('PATCH /api/products/update-service error:', err);
        return ApiResponse.error(
            err instanceof Error ? err.message : 'Lỗi không xác định'
        );
    }
}
