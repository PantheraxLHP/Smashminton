import { NextResponse } from 'next/server';

function decodeJWT(token: string) {
    if (!token) return null;

    try {
        const payload = token.split('.')[1]; // Lấy phần payload
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/')); // Giải mã base64
        return JSON.parse(decoded); // Chuyển từ chuỗi JSON thành object
    } catch (e) {
        console.error('Invalid token', e);
        return null;
    }
}

export async function GET(req: Request) {
    const cookies = req.headers.get('cookie');
    const accessToken = cookies
        ?.split('; ')
        .find((c) => c.startsWith('accessToken='))
        ?.split('=')[1];

    if (!accessToken) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const decodedUser = decodeJWT(accessToken); // Decode without verifying
        return NextResponse.json({ user: decodedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}
