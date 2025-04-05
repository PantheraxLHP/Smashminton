import { useAuth } from '@/context/AuthContext';
import { handleSignin } from '@/services/auth.service';
import { loginSchema } from '@/types/schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function useSignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({});
    const { login } = useAuth();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = loginSchema.safeParse({ username, password });
        if (!result.success) {
            const formattedErrors = result.error.format();
            setFormErrors({
                username: formattedErrors.username?._errors?.[0],
                password: formattedErrors.password?._errors?.[0],
            });
            return;
        }

        try {
            const res = await handleSignin(username, password);
            if (res.success) {
                login();
                setError('');
            } else {
                setError(res.error || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Lỗi hệ thống, vui lòng thử lại sau');
        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        error,
        formErrors,
        onSubmit,
        setFormErrors,
    };
}
