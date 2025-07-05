import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const supplierid = url.searchParams.get('supplierid');
        const productid = url.searchParams.get('productid');
        console.log("route sup: ", supplierid);
        console.log("route pro: ", productid);
        if (!supplierid || isNaN(Number(supplierid))) {
            return ApiResponse.error('Thiếu hoặc sai định dạng `supplierid`');
        }

        if (!productid || isNaN(Number(productid))) {
            return ApiResponse.error('Thiếu hoặc sai định dạng `productid`');
        }

        const response = await fetch(
            `${process.env.SERVER}/api/v1/suppliers/supply-products?supplierid=${supplierid}&productid=${productid}`,
            {
                method: 'DELETE',
                credentials: 'include',
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] Backend error response:', result);
            return ApiResponse.error(result.message || 'Lỗi khi xoá nhà cung cấp khỏi sản phẩm');
        }

        return ApiResponse.success(result.data || 'Xoá thành công');
    } catch (error) {
        console.error('[ERROR] DELETE supplier-product exception:', error);
        return ApiResponse.error(
            error instanceof Error ? error.message : 'Lỗi khi xoá nhà cung cấp khỏi sản phẩm'
        );
    }
}
