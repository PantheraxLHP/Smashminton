'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentFailPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white px-6 py-8 text-center shadow-md">
                <div className="mb-6">
                    <XCircle className="mx-auto h-16 w-16 text-red-500" />
                </div>
                <h1 className="mb-4 text-2xl font-bold text-gray-900">Thanh toán thất bại</h1>
                <p className="mb-8 text-gray-600">
                    Chúng tôi không thể xử lý thanh toán của bạn. Điều này có thể do số dư không đủ, thông tin thẻ không
                    chính xác, hoặc vấn đề tạm thời.
                </p>
                <div className="space-y-4">
                    <Link
                        href="/payment"
                        className="block w-full rounded-md bg-red-600 px-4 py-3 font-semibold text-white transition duration-200 hover:bg-red-700"
                    >
                        Thử lại
                    </Link>
                    <Link
                        href="/"
                        className="block w-full rounded-md bg-gray-200 px-4 py-3 font-semibold text-gray-800 transition duration-200 hover:bg-gray-300"
                    >
                        Quay về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
