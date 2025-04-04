'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { handleLogin } from '@/services/auth.service';
import { loginSchema } from '@/types/schema';

export function useSignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({});

    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate data using Zod
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
            const res = await handleLogin(username, password);
            if (res.success) {
                localStorage.setItem('token', res.data.token);
                toast.success('Đăng nhập thành công!');
                router.push('/');
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
