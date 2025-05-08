import { ApiResponse } from '@/lib/apiResponse';

export async function GET(request: Request) {
    try {
        const queryParams = new URLSearchParams(request.url.split('?')[1]);
        const username = queryParams.get('username');

        const response = await fetch(`${process.env.SERVER}/api/v1/bookings/cache-booking?username=${username}`, {
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
            },
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
