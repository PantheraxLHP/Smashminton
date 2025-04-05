export const handleSignin = async (username: string, password: string) => {
    try {
        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            cache: 'no-store',
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

export const handleSignout = async () => {
    try {
        const res = await fetch('/api/auth/signout', {
            method: 'POST',
            cache: 'no-store',
        });
        const data = await res.json();
        if (res.ok) {
            return { success: true };
        } else {
            return { success: false, error: data.error || 'Logout failed' };
        }
    } catch {
        return { success: false, error: 'System error, please try again later' };
    }
};
