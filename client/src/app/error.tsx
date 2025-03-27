'use client';

import { useEffect } from 'react';

interface ErrorProps {
    error: Error;
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('Error occurred:', error);
    }, [error]);

    return (
        <div className="container mx-auto bg-white px-4 py-16 text-center">
            <h3 className="text-2xl font-bold text-gray-800 md:text-3xl">Đã xảy ra lỗi</h3>
            <p className="mt-3 text-gray-600">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
            <button
                onClick={() => reset()}
                className="bg-primary-600 hover:bg-primary-700 mt-5 rounded px-4 py-2 text-white"
            >
                Thử lại
            </button>
        </div>
    );
}
