import { ApiResponse } from '@/lib/apiResponse';
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url);
        const accountId = url.searchParams.get('accountId');

        if (!accountId) {
            return ApiResponse.badRequest('Account ID is required');
        }

        const formData = await request.formData();

        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        if (!accessToken) {
            return ApiResponse.unauthorized('Access token is required');
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/accounts/${accountId}`, {
            method: 'PUT',
            body: formData,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            switch (response.status) {
                case 400:
                    return ApiResponse.badRequest(errorData.message || 'Invalid request data');
                case 404:
                    return ApiResponse.notFound(errorData.message || 'Account not found');
                default:
                    return ApiResponse.error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
        }

        const result = await response.json();
        return ApiResponse.success(result, 'Account was updated');
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
}
