import { ApiResponse } from '@/lib/apiResponse';

export async function GET() {
    try {
        const response = await fetch(`${process.env.SERVER}/api/v1/zones/all-zones-with-courts`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return ApiResponse.error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return ApiResponse.success({ zones: data });
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách sân');
    }
}

