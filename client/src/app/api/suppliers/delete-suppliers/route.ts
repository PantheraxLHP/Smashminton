import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const supplierid = Number(body.supplierid);

        if (!supplierid || isNaN(supplierid)) {
            return ApiResponse.error('Thiếu hoặc sai định dạng `supplierid`');
        }

        // Gửi DELETE tới server backend (Spring/Express/whatever)
        const response = await fetch(`${process.env.SERVER}/api/v1/suppliers/${supplierid}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] Backend delete failed:', result);
            return ApiResponse.error(result.message || 'Lỗi khi xoá nhà cung cấp');
        }

        console.log('[DEBUG] delete supplier backend success:', result);
        return ApiResponse.success(result.data || 'Xoá nhà cung cấp thành công');
    } catch (error) {
        console.error('[ERROR] DELETE supplier route exception:', error);
        return ApiResponse.error(error instanceof Error ? error.message : 'Lỗi server khi xoá nhà cung cấp');
    }
}
