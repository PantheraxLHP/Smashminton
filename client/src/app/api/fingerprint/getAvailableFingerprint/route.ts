import { ApiResponse } from '@/lib/apiResponse';

export async function GET() {
    try {
        const response = await fetch(`${process.env.SERVER}/api/v1/devices/available-finger-id`, {
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
