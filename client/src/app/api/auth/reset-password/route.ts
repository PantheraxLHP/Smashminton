import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const resetPasswordData = await request.json();

        const res = await fetch(`${process.env.SERVER}/api/v1/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resetPasswordData),
            credentials: 'include',
        });

        const result = await res.json();

        if (!res.ok) {
            console.error('Server error:', result);
            return ApiResponse.error(result.message || 'Đặt lại mật khẩu thất bại');
        }

        return ApiResponse.success('Đặt lại mật khẩu thành công');
    } catch (error) {
        console.error('Server route error:', error);
        return ApiResponse.error('Đặt lại mật khẩu thất bại');
    }
}
