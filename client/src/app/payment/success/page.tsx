import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white px-6 py-8 text-center shadow-md">
                <div className="mb-6">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                </div>
                <h1 className="mb-4 text-2xl font-bold text-gray-900">Thanh toán thành công!</h1>
                <p className="mb-8 text-gray-600">
                    Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được hoàn thành thành công.
                </p>
                <div className="space-y-4">
                    <Link
                        href="/profile"
                        className="block w-full rounded-md bg-green-600 px-4 py-3 font-semibold text-white transition duration-200 hover:bg-green-700"
                    >
                        Xem lịch sử đặt sân
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
