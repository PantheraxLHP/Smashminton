import { ApiResponse } from '@/lib/apiResponse';

export async function GET(request: Request) {
    try {
        const queryParams = new URLSearchParams(request.url.split('?')[1]);
        const productTypeId = queryParams.get('productTypeId');
        const page = queryParams.get('page');
        const pageSize = queryParams.get('pageSize');
        const productFilterValues = queryParams.get('productFilterValues');

        const response = await fetch(
            `${process.env.SERVER}/api/v1/product-types/${productTypeId}/products/v2?page=${page}&pageSize=${pageSize}${productFilterValues ? `&productfiltervalue=${productFilterValues}` : ''}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            },
        );

        if (!response.ok) {
            return ApiResponse.error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
}
