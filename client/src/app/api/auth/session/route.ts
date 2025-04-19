import { cookies } from 'next/headers';
import { ApiResponse } from '@/lib/apiResponse';

function decodeJWT(token: string) {
    if (!token) return null;
    try {
        const payload = token.split('.')[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    if (!accessToken) {
        return ApiResponse.unauthorized();
    }

    const decoded = decodeJWT(accessToken);
    if (!decoded) {
        return ApiResponse.unauthorized('Invalid token');
    }
    // Return data{user: decoded} => Get user: data.user.sub
    return ApiResponse.success({ user: decoded });
}
