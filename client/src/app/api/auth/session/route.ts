import { cookies } from 'next/headers';
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

export async function GET() {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('accessToken')?.value;

    if (!accessToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // ❗ Decode không verify để lấy payload
        const decoded = decodeJWT(accessToken) as {
            id: string;
            username: string;
            role: string;
            accounttype: string;
            exp: number;
        };

        if (!decoded) throw new Error('Invalid token');

        return NextResponse.json({ user: decoded });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
}
