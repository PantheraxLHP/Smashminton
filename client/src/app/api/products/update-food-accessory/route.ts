import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const url = new URL(request.url);
        const productid = url.searchParams.get('productid');
        const batchid = url.searchParams.get('batchid');
        if (!productid) {
            return ApiResponse.error('Thiếu productid trong query string');
        }
        if (!batchid) {
            return ApiResponse.error('Thiếu batchid trong query string');
        }

        const formData = await request.formData();

        const response = await fetch(
            `${process.env.SERVER}/api/v1/products/update-food-acccessory/${productid}/${batchid}`,
            {
                method: 'PATCH',
                body: formData,
                headers: {
                    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                },
            },
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            return ApiResponse.error(`Lỗi: ${response.status} - ${errorMessage}`);
        }

        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        console.error('PATCH /api/products/update-food-accessory error:', error);
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi không xác định');
    }
}
