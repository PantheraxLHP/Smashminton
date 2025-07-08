import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const supplierid = url.searchParams.get('supplierid');

        if (!supplierid) {
            return ApiResponse.error('Thiếu supplierid trong query string');
        }

        const body = await request.json();

        console.log('[DEBUG] PATCH supplier JSON received:', body);

        const { suppliername, contactname, phonenumber, email, address, products_costs } = body;

        if ( !suppliername || !contactname || !phonenumber || !email || !address ) {
            return ApiResponse.error('Thiếu thông tin trong dữ liệu!');
        }

        if (products_costs && !Array.isArray(products_costs)) {
            return ApiResponse.error('Danh sách sản phẩm không hợp lệ!');
        }

        const response = await fetch(
            `${process.env.SERVER}/api/v1/suppliers/${supplierid}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    suppliername,
                    contactname,
                    phonenumber,
                    email,
                    address,
                    products_costs,
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] Backend error response:', result);
            return ApiResponse.error(`Lỗi server! Mã lỗi: ${response.status}`);
        }

        return ApiResponse.success(result);
    } catch (error) {
        console.error('[ERROR] PATCH supplier route exception:', error);
        return ApiResponse.error(
            error instanceof Error ? error.message : 'Lỗi khi cập nhật nhà cung cấp'
        );
    }
}
