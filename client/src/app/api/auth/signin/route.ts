import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { username, password } = await req.json();

    // Gửi yêu cầu đăng nhập đến server NestJS
    const res = await fetch('http://localhost:8000/api/v1/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { accessToken, refreshToken } = await res.json();

    const response = NextResponse.json({ success: true });

    // Lưu accessToken và refreshToken vào HTTP-only cookies
    response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 15, // 15 phút
    });

    response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 ngày
    });

    return response;
}
