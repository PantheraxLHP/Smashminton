'use client';

import { useAuth } from '@/context/AuthContext';
import { handleSignin } from '@/services/auth.service';
import { loginSchema } from '@/types/schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function useSignIn() {
    const { login } = useAuth(); // Access the login function from AuthContext
    const [username, setUsername] = useState(''); // State for username input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for general error messages
    const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({}); // State for form validation errors

    const router = useRouter(); // Next.js router for navigation

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission

        // Validate form inputs using loginSchema
        const result = loginSchema.safeParse({ username, password });

        if (!result.success) {
            // Extract and set validation errors
            const formattedErrors = result.error.format();
            setFormErrors({
                username: formattedErrors.username?._errors?.[0],
                password: formattedErrors.password?._errors?.[0],
            });
            return;
        }

        try {
            // Call the sign-in service
            const res = await handleSignin(username, password);
            if (res.success) {
                login(res.data.accessToken); // Save access token using login function
                toast.success('Đăng nhập thành công!'); // Show success toast
                router.push('/'); // Redirect to home page
            } else {
                setError(res.error || 'Đăng nhập thất bại'); // Set error message
            }
        } catch (err) {
            setError('Lỗi hệ thống, vui lòng thử lại sau'); // Handle system errors
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
