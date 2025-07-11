import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const url = new URL(request.url);
        const poid = url.searchParams.get('poid');

        if (!poid) {
            return ApiResponse.error('Thiếu poid trong query string');
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/purchase-orders/cancel-purchaseOrder/${poid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return ApiResponse.error(`Lỗi: ${response.status} - ${errorMessage}`);
        }

        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        console.error('/api/v1/purchase-orders/cancel-purchaseOrder error:', error);
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi không xác định');
    }
}
