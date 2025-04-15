import { ApiResponse } from '@/lib/apiResponse';

export async function POST(req: Request) {
    try {
        const signupFormData = await req.formData();
        
        const res = await fetch(`${process.env.SERVER}/api/v1/auth/signup`, {
            method: 'POST',
            body: signupFormData,
            credentials: 'include',
        });

        const result = await res.json();

        if (!res.ok) {
            console.error('Server error:', result);
            return ApiResponse.error(result.message || 'Đăng ký thất bại');
        }

        return ApiResponse.success('Đăng ký thành công');
    } catch (error) {
        console.error('Server route error:', error);
        return ApiResponse.error('Đăng ký thất bại');
    }
}
