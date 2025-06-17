'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
    const router = useRouter();

    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    const handleRetry = () => {
        reset();
        router.refresh();
    };

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-gray-50 p-8">
            <div className="text-center">
                <h2 className="mb-2 text-xl font-semibold text-gray-900">Không thể tải dữ liệu dashboard</h2>
                <p className="mb-6 text-gray-600">Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.</p>
                <div className="space-x-4">
                    <button
                        onClick={handleRetry}
                        className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                    <button
                        onClick={() => router.push('/admin')}
                        className="rounded border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
            {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 max-w-2xl rounded border bg-white p-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700">
                        Chi tiết lỗi (Development)
                    </summary>
                    <pre className="mt-2 text-xs break-words whitespace-pre-wrap text-red-600">
                        {error.message}
                        {error.stack && '\n\nStack trace:\n' + error.stack}
                    </pre>
                </details>
            )}
        </div>
    );
}
