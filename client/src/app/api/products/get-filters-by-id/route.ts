import { ApiResponse } from '@/lib/apiResponse';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return ApiResponse.error('ID là bắt buộc');
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/product-filter/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
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
