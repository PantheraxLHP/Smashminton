import { ApiResponse } from '@/lib/apiResponse';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await fetch(`${process.env.SERVER}/api/v1/suppliers/new-supplier`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return ApiResponse.error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(
            error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu'
        );
    }
}
