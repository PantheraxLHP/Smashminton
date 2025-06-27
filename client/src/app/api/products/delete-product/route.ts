import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const url = new URL(request.url);
        const productid = url.searchParams.get('productid');

        if (!productid) {
            return ApiResponse.error('Thiếu productid trong query string');
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/products/delete-product/${productid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return ApiResponse.error(`Lỗi: ${response.status} - ${errorMessage}`);
        }

        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        console.error('/api/v1/products/delete-product/ error:', error);
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi không xác định');
    }
}
