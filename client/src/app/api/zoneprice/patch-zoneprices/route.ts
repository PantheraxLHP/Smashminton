import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const body = await request.json();

        const { zonepriceid, price } = body;

        if (!zonepriceid || price === undefined) {
            return ApiResponse.error('Thiếu thông tin zonepriceid hoặc price!');
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/zone-prices/${zonepriceid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            credentials: 'include',
            body: JSON.stringify({ price }),
        });

        const result = await response.json();

        if (!response.ok) {
            return ApiResponse.error(`Lỗi server! Mã lỗi: ${response.status}`);
        }
        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi khi cập nhật giá khu vực');
    }
}
