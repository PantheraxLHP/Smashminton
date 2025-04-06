import type { SigninSchema } from '@/app/(auth)/auth.schema';
export const handleSignin = async (values: SigninSchema) => {
    try {
        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        const data = await res.json();
        if (res.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.message || 'Đăng nhập thất bại' };
        }
    } catch {
        return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' };
    }
};
