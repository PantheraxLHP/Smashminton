import { SigninSchema } from '@/app/(auth)/auth.schema';
import { ApiResponse } from '@/lib/apiResponse';

export async function POST(req: Request) {
    const signinData: SigninSchema = await req.json();
    const res = await fetch(`${process.env.SERVER}/api/v1/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signinData),
    });

    if (!res.ok) {
        return ApiResponse.unauthorized('Invalid credentials');
    }

    const { accessToken, refreshToken } = await res.json();

    const response = ApiResponse.success('Đăng ký thành công');

    // Set accessToken and refreshToken in HTTP-only cookies
    response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 15, // 15 minutes
    });

    response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
}
