import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        if (!id) {
            return ApiResponse.error('Thiếu id trong query string');
        }

        const body = await request.json();

        const response = await fetch(`${process.env.SERVER}/api/v1/purchase-orders/successful-delivery/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return ApiResponse.error(`Lỗi: ${response.status} - ${errorMessage}`);
        }

        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        console.error('/api/v1/purchase-orders/successful-delivery error:', error);
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi không xác định');
    }
}
