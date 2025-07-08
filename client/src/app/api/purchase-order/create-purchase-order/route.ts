import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const body = await request.json();
        const { productid, productname, employeeid, supplierid, quantity } = body;

        if (!productid || !productname || !employeeid || !supplierid || !quantity) {
            return ApiResponse.error('Thiếu thông tin đơn hàng');
        }

        const backendRes = await fetch(`${process.env.SERVER}/api/v1/purchase-orders/new-purchase-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            credentials: 'include',
            body: JSON.stringify({
                productid,
                productname,
                employeeid,
                supplierid,
                quantity,
            }),
        });

        const result = await backendRes.json();

        if (!backendRes.ok) {
            console.error('[ERROR] Backend create PO failed:', result);
            return ApiResponse.error(result.message || 'Không thể tạo đơn đặt hàng');
        }

        return ApiResponse.success(result);
    } catch (error) {
        console.error('[ERROR] POST purchase-order route exception:', error);
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi server khi tạo đơn hàng');
    }
}
