import { SigninSchema } from '@/app/(auth)/auth.schema';
import { ApiResponse } from '@/lib/apiResponse';

export async function POST(req: Request) {
    const signinData: SigninSchema = await req.json();

    const nestRes = await fetch(`${process.env.SERVER}/api/v1/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signinData),
        credentials: 'include',
    });

    if (!nestRes.ok) {
        return ApiResponse.unauthorized('Invalid credentials');
    }

    // 🍪 Grab the Set-Cookie header from NestJS
    const setCookie = nestRes.headers.get('set-cookie');

    const { accessToken } = await nestRes.json();

    // Create Next.js response to send to browser
    const response = ApiResponse.success('Đăng nhập thành công');

    // 🍪 Set access token cookie manually
    response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    // Also forward refreshToken from NestJS (if present)
    if (setCookie) {
        response.headers.append('set-cookie', setCookie); // Set it in the final response
    }

    return response;
}
