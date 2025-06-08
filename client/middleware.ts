import { NextRequest, NextResponse } from 'next/server';

// Define role permissions based on the menu structure
const ROLE_PERMISSIONS = {
    guest: ['/booking', '/products', '/rentals'],
    customer: ['/booking', '/products', '/rentals', '/profile', '/payment', '/bookingdetail'],
    employee: ['/booking', '/support', '/work-management'],
    hr_manager: ['/employees', '/approvals'],
    wh_manager: ['/price-management', '/warehouse'],
    admin: ['/dashboard', '/prediction-support'],
} as const;

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/auth/signin', '/auth/signup', '/contact', '/terms', '/privacy-policy', '/faq'] as const;

// Common authenticated routes accessible to all logged-in users
const COMMON_AUTH_ROUTES = ['/profile'] as const;

// Default redirects for each role
const ROLE_REDIRECTS = {
    admin: '/dashboard',
    hr_manager: '/employees',
    wh_manager: '/price-management',
    employee: '/booking',
    customer: '/booking',
    guest: '/',
} as const;

function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isCommonAuthRoute(pathname: string): boolean {
    return COMMON_AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function hasPermission(role: string, pathname: string): boolean {
    if (isCommonAuthRoute(pathname)) return true;

    const permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || [];
    return permissions.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`) ||
            // Allow sub-routes for wh_manager
            (role === 'wh_manager' &&
                (pathname.startsWith('/price-management/') || pathname.startsWith('/warehouse/'))),
    );
}

function decodeJWT(token: string) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

        return JSON.parse(atob(padded));
    } catch {
        return null;
    }
}

function getEffectiveRole(payload: any): string {
    if (!payload) return 'guest';

    const { accounttype, role } = payload;
    return accounttype === 'Customer' ? 'customer' : role || 'guest';
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // Get token from cookies
    const token = request.cookies.get('accessToken')?.value;

    // Redirect to signin if no token
    if (!token) {
        const url = new URL('/auth/signin', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }

    // Decode token
    const payload = decodeJWT(token);
    if (!payload) {
        const url = new URL('/auth/signin', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }

    // Get user role
    const userRole = getEffectiveRole(payload);

    // Check permissions
    if (!hasPermission(userRole, pathname)) {
        const redirectPath = ROLE_REDIRECTS[userRole as keyof typeof ROLE_REDIRECTS] || '/';
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
