import { ApiResponse } from '@/lib/apiResponse';
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url);
        const accountId = url.searchParams.get('accountid');

        if (!accountId) {
            return ApiResponse.error('Account ID is required');
        }
        const changePasswordData = await request.json();

        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const response = await fetch(`${process.env.SERVER}/api/v1/accounts/${accountId}/password`, {
            method: 'PUT',
            body: JSON.stringify(changePasswordData),
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return ApiResponse.error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
}
