import { loginSchema } from '@/types/schema';

export const handleLogin = async (username: string, password: string) => {
    // Xác thực đầu vào với Zod
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
        return { success: false, error: 'Thông tin đăng nhập không hợp lệ' };
    }

    try {
        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.message || 'Đăng nhập thất bại' };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Lỗi hệ thống, vui lòng thử lại sau' };
    }
};
