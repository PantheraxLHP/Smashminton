import { ApiResponse } from '@/lib/apiResponse';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const queryParams = new URLSearchParams(request.url.split('?')[1]);
        const username = queryParams.get('username');

        const response = await fetch(`${process.env.SERVER}/api/v1/orders/cache-order?username=${username}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
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
