import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const url = new URL(request.url);
        const supplierid = url.searchParams.get('supplierid');

        if (!supplierid || isNaN(Number(supplierid))) {
            return ApiResponse.error('Thiếu hoặc sai định dạng `supplierid`');
        }

        const response = await fetch(
            `${process.env.SERVER}/api/v1/suppliers/delete-supplier/${supplierid}`,
            {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                },
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] Backend error response:', result);
            return ApiResponse.error(result.message || 'Lỗi khi xoá nhà cung cấp');
        }

        return ApiResponse.success(result.data || 'Xoá thành công');
    } catch (error) {
        console.error('[ERROR] DELETE supplier route exception:', error);
        return ApiResponse.error(
            error instanceof Error ? error.message : 'Lỗi khi xoá nhà cung cấp'
        );
    }
}
