import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const url = new URL(request.url);
        const supplierid = url.searchParams.get('supplierid');
        const productid = url.searchParams.get('productid');

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
                headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                },
            }
        );

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(result, { status: response.status });
        }

        return NextResponse.json({ data: result.data || 'Xoá thành công' }, { status: 200 });
    } catch (error) {
        console.error('[ERROR] DELETE supplier-product exception:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Lỗi khi xoá nhà cung cấp khỏi sản phẩm' },
            { status: 500 }
        );
    }
}
