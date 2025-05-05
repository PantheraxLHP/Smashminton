import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const response = await fetch(`${process.env.SERVER}/api/v1/bookings/cache-booking`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(await request.json()),
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
