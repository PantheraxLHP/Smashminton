import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const forgotPasswordData = await request.json();

        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const res = await fetch(`${process.env.SERVER}/api/v1/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
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
