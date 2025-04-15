'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
    return (
        <div className="container mx-auto bg-white px-4 py-16 text-center">
            <h3 className="text-2xl font-bold text-gray-800 md:text-3xl">Đã xảy ra lỗi</h3>
            <p className="mt-3 text-gray-600">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
            <Button onClick={() => reset()}>Thử lại</Button>
        </div>
    );
}
