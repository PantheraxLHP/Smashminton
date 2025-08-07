import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const body = await request.json();
        const response = await fetch(`${process.env.SERVER}/api/v1/bookings/cache-booking-separated-fixed`, {
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                credentials: 'include',
            },
            method: 'DELETE',
            body: JSON.stringify(body),
        });

        // Handle specific status codes
        if (!response.ok) {
            switch (response.status) {
                case 400:
                    return ApiResponse.badRequest('Có lỗi trong thông tin yêu cầu');
                default:
                    return ApiResponse.error(`HTTP error! Status: ${response.status}`);
            }
        }

        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
}
