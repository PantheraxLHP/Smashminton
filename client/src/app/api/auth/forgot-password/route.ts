import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const forgotPasswordData = await request.json();

        const res = await fetch(`${process.env.SERVER}/api/v1/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(forgotPasswordData),
            credentials: 'include',
        });

        const result = await res.json();

        if (!res.ok) {
            console.error('Server error:', result);
            return ApiResponse.error(result.message || 'Quên mật khẩu thất bại');
        }

        return ApiResponse.success('Quên mật khẩu thành công');
    } catch (error) {
        console.error('Server route error:', error);
        return ApiResponse.error('Quên mật khẩu thất bại');
    }
}
