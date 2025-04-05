// not-found.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/signin');
        }
    }, [isAuthenticated, router]);

    return (
        <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <motion.h1
                className="from-primary mb-4 bg-gradient-to-r to-pink-500 bg-clip-text text-7xl font-extrabold text-transparent md:text-8xl"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                404
            </motion.h1>

            <motion.h2
                className="mb-2 text-2xl font-semibold md:text-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Không tìm thấy trang
            </motion.h2>

            <motion.p
                className="text-muted-foreground mb-6 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                Có thể địa chỉ đã bị thay đổi hoặc trang bạn đang tìm không tồn tại.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <Button
                    variant="default"
                    className="rounded-2xl px-6 py-2 text-base shadow-md"
                    onClick={() => router.push('/')}
                >
                    Quay về trang chủ
                </Button>
            </motion.div>
        </div>
    );
}
