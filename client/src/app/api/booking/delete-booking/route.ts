import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('body', JSON.stringify(body));
        const response = await fetch(`${process.env.SERVER}/api/v1/bookings/cache-booking`, {
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
            },
            method: 'DELETE',
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return ApiResponse.error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
}
