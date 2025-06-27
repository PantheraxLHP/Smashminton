import { ApiResponse } from '@/lib/apiResponse';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const signupFormData = await req.formData();

        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const res = await fetch(`${process.env.SERVER}/api/v1/auth/signup`, {
            method: 'POST',
            body: signupFormData,
            headers: {
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            credentials: 'include',
        });

        const result = await res.json();

        if (!res.ok) {
            console.error('Server error:', result);
            return ApiResponse.error(result.message || 'Đăng ký thất bại');
        }

        return ApiResponse.success(result);
    } catch (error) {
        console.error('Server route error:', error);
        return ApiResponse.error('Đăng ký thất bại');
    }
}
