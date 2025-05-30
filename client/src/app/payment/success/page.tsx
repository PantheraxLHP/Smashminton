'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createReceipt } from '@/services/payment.service';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();

    useEffect(() => {
        // General params
        const userId = searchParams.get('userId');
        const userName = searchParams.get('userName');
        const paymentMethod = searchParams.get('paymentMethod');
        const totalAmount = searchParams.get('amount');
        const guestPhoneNumber = searchParams.get('guestPhoneNumber');
        const voucherId = searchParams.get('voucherId');
        // MoMo params
        const partnerCode = searchParams.get('partnerCode');
        const resultCode = searchParams.get('resultCode');
        // PayOS params
        const code = searchParams.get('code');
        const status = searchParams.get('status');

        let apiParams: any = {};

        if (partnerCode) {
            // MoMo
            apiParams = {
                userId: userId || '',
                userName: userName || '',
                paymentMethod: paymentMethod,
                totalAmount: '222222',
                guestPhoneNumber: guestPhoneNumber || '',
                voucherId: '1',
                status: resultCode === '0' ? 'PAID' : 'FAILED',
                resultCode: resultCode || '',
            };
        } else {
            // PayOS
            const payosResultCode = code === '00' ? '0' : code || '';
            apiParams = {
                userId: userId || '',
                userName: userName || '',
                paymentMethod: paymentMethod,
                totalAmount: '333333',
                guestPhoneNumber: guestPhoneNumber || '',
                voucherId: '1',
                status: status,
                resultCode: payosResultCode || '',
            };
        }
        const handleCreateReceipt = async () => {
            if (apiParams.paymentMethod) {
                const response = await createReceipt(apiParams);

                if (response.ok) {
                    toast.success('Đơn hàng đã được tạo thành công!');
                } else {
                    toast.error(response.message || 'Lỗi xảy ra khi tạo đơn hàng!');
                }
            }
        };

        handleCreateReceipt();
    }, [searchParams, user]);

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
