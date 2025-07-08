'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 bg-gray-200 p-4">
            <h2 className="text-xl font-semibold text-red-600">Đã xảy ra lỗi!</h2>
            <p className="text-gray-600">Không thể tải dữ liệu dự đoán.</p>
            <button
                onClick={reset}
                className="bg-primary-500 hover:bg-primary-600 rounded px-4 py-2 text-white transition-colors"
            >
                Thử lại
            </button>
        </div>
    );
} 