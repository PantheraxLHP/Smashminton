import { ApiResponse } from '@/lib/apiResponse';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const accountId = url.searchParams.get('accountId');

        const response = await fetch(`${process.env.SERVER}/api/v1/accounts/${accountId}`, {
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
