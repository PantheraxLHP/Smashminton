import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define role permissions based on the menu structure from menus.ts
const ROLE_PERMISSIONS = {
    guest: ['/booking', '/products', '/rentals'],
    customer: ['/booking', '/products', '/rentals'],
    employee: ['/booking', '/booking-detail', '/assignments', '/enrollments'],
    hr_manager: ['/employees', '/approvals', '/assignments', '/fingerprint'],
    wh_manager: [
        '/assignments',
        '/price-management',
        '/price-management/court-price',
        '/price-management/rental-price',
        '/warehouse',
        '/warehouse/zone-court',
        '/warehouse/accessories',
        '/warehouse/suppliers',
        '/warehouse/orders',
    ],
    admin: ['/admin/dashboard', '/admin/prediction'],
} as const;

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
    '/',
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/contact',
    '/terms',
    '/privacy-policy',
    '/faq',
    '/products',
    '/rentals',
] as const;

// Common authenticated routes accessible to all logged-in users
const COMMON_AUTH_ROUTES = ['/profile'] as const;

// Default redirects for each role based on their first menu item
const ROLE_REDIRECTS = {
    admin: '/admin/dashboard',
    hr_manager: '/employees',
    wh_manager: '/price-management',
    employee: '/booking',
    customer: '/booking',
    guest: '/booking',
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

    // Debug logging (remove in production)
    console.log(`[Middleware] Checking permission for role: ${role}, pathname: ${pathname}`);
    console.log(`[Middleware] Allowed routes for ${role}:`, permissions);

    // Check exact route matches first
    const exactMatch = permissions.some((route) => route === pathname);
    if (exactMatch) {
        console.log(`[Middleware] Exact match found for ${pathname}`);
        return true;
    }

    // For sub-routes, be very explicit about what's allowed
    for (const route of permissions) {
        if (pathname.startsWith(`${route}/`)) {
            console.log(`[Middleware] Sub-route check: ${pathname} starts with ${route}/`);

            // Special handling for wh_manager only
            if (role === 'wh_manager' && (route === '/price-management' || route === '/warehouse')) {
                console.log(`[Middleware] Allowing wh_manager sub-route access`);
                return true;
            }

            // For other roles, only allow if it's not a restricted admin route
            if (pathname.startsWith('/admin/') && role !== 'admin') {
                console.log(`[Middleware] BLOCKING: Non-admin trying to access admin route`);
                return false;
            }

            // Allow other sub-routes for non-admin routes
            if (!pathname.startsWith('/admin/')) {
                console.log(`[Middleware] Allowing non-admin sub-route`);
                return true;
            }
        }
    }

    console.log(`[Middleware] ACCESS DENIED for ${role} to ${pathname}`);
    return false;
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

// This function can be marked `async` if using `await` inside
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
        const url = new URL('/signin', request.url);
        return NextResponse.redirect(url);
    }

    // Decode token
    const payload = decodeJWT(token);
    if (!payload) {
        const url = new URL('/signin', request.url);
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

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files with extensions
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
