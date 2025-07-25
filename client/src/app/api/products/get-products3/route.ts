import { ApiResponse } from '@/lib/apiResponse';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const queryParams = new URLSearchParams(request.url.split('?')[1]);
        const productTypeId = queryParams.get('productTypeId');
        const page = queryParams.get('page');
        const pageSize = queryParams.get('pageSize');
        const productFilterValues = queryParams.get('productFilterValues');
        const q = queryParams.get('q');

        const url = new URL(`${process.env.SERVER}/api/v1/product-types/${productTypeId}/products/v3`);
        url.searchParams.append('page', page || '1');
        url.searchParams.append('pageSize', pageSize || '10');

        if (productFilterValues) {
            url.searchParams.append('productfiltervalue', productFilterValues);
        }

        if (q) {
            url.searchParams.append('q', q);
        }

        const response = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
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
