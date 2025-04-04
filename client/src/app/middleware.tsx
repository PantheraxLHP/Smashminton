import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    if (!token && !request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (request.nextUrl.pathname === '/logout') {
        const response = NextResponse.redirect(new URL('/login', request.url));
        // Xóa cookie
        response.cookies.set('accessToken', '', {
            expires: new Date(0),
            path: '/',
        });
        return response;
    }
    return NextResponse.next();
}
