'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Redirect to the new dynamic route format
            router.replace(`/reset-password/${token}`);
        } else {
            // If no token, redirect to forgot password page
            router.replace('/forgot-password');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-[url('https://res.cloudinary.com/dnagyxwcl/image/upload/v1747907584/loginbg_l2ss1n.jpg')] bg-cover bg-center">
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-2xl">
                    <div className="text-center">
                        <p className="text-gray-600">Đang chuyển hướng...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
