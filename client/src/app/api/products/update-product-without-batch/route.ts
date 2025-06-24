import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const productid = url.searchParams.get('productid');
        if (!productid) {
            return ApiResponse.error('Thiếu productid trong query string');
        }

        const formData = await request.formData();

        const response = await fetch(
            `${process.env.SERVER}/api/v1/products/update-food-acccessory-without-batch/${productid}`,
            {
                method: 'PATCH',
                body: formData,
            }
        );        

        if (!response.ok) {
            const errorMessage = await response.text();
            return ApiResponse.error(`Lỗi: ${response.status} - ${errorMessage}`);
        }

        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        console.error('PATCH /api/products/update-food-accessory-without-batch error:', error);
        return ApiResponse.error(
            error instanceof Error ? error.message : 'Lỗi không xác định'
        );
    }
}
