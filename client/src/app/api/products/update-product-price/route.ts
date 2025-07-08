import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const body = await request.json();

        const { productid, price } = body;

        if (!productid || price === undefined) {
            return ApiResponse.error('Thiếu thông tin productid hoặc price!');
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/products/${productid}/rental-price`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            credentials: 'include',
            body: JSON.stringify({ rentalprice: price }),
        });

        const result = await response.json();

        if (!response.ok) {
            return ApiResponse.error(`Lỗi server! Mã lỗi: ${response.status}`);
        }
        return ApiResponse.success(result);
    } catch (error) {
        console.error('[ERROR] PATCH zoneprice route exception:', error);
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi khi cập nhật giá khu vực');
    }
}
