import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const url = new URL(request.url);
        const productfiltervalueid = url.searchParams.get('productfiltervalueid');
        if (!productfiltervalueid) {
            return ApiResponse.error('Thiếu productfiltervalueid trong query string');
        }

        const formData = await request.formData();

        const response = await fetch(
            `${process.env.SERVER}/api/v1/products/new-product?productfiltervalueid=${productfiltervalueid}`,
            {
                method: 'POST',
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
        console.error('POST /api/products/post-products error:', error);
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi không xác định');
    }
}
