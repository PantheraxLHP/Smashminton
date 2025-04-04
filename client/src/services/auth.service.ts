export async function handleLogin(
    username: string,
    password: string,
): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const response = await fetch('/api/auth/signin');

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'Đăng nhập thất bại' };
        }
    } catch (err) {
        console.error('Error during login:', err);
        return { success: false, error: 'Lỗi kết nối đến server' };
    }
}
