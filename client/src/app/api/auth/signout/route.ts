import { ApiResponse } from '@/lib/apiResponse';
import { NextResponse } from 'next/server';

export async function POST() {
    const response = ApiResponse.success('Đăng xuất thành công');

    // Xóa cookies
    response.cookies.set('accessToken', '', { httpOnly: true, path: '/', maxAge: 0 });
    response.cookies.set('refreshToken', '', { httpOnly: true, path: '/', maxAge: 0 });

    return response;
}
