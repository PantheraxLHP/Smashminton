import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productid = Number(searchParams.get('productid'));

        if (!productid || isNaN(productid)) {
            return ApiResponse.error('Thiếu hoặc sai định dạng `productid`');
        }

        const response = await fetch(
            `${process.env.SERVER}/api/v1/suppliers/${productid}/suppliers`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] Backend get failed:', result);
            return ApiResponse.error(result.message || 'Lỗi khi tìm kiếm nhà cung cấp');
        }

        return ApiResponse.success(result || []);
    } catch (error) {
        console.error('[ERROR] GET supplier route exception:', error);
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi server khi tìm kiếm nhà cung cấp');
    }
}
