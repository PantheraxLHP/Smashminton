import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface PaymentResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: 'success' | 'failed';
    billId: string;
}

const PaymentResultModal: React.FC<PaymentResultModalProps> = ({ isOpen, onClose, status, billId }) => {
    if (!isOpen) return null;

    const isSuccess = status === 'success';

    return (
        <div
            className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-[400px] rounded-2xl bg-white p-6 text-center shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="absolute top-2 right-5 text-2xl text-gray-400 hover:text-black" onClick={onClose}>
                    ×
                </button>

                <div className="mb-4 flex justify-center">
                    {isSuccess ? (
                        <CheckCircle className="text-green-500" size={60} />
                    ) : (
                        <XCircle className="text-red-500" size={60} />
                    )}
                </div>

                <h2 className="mb-2 text-lg font-semibold">
                    {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
                </h2>

                {isSuccess ? (
                    <>
                        <p className="mb-1 text-sm text-gray-600">
                            Mã hóa đơn của bạn là <span className="font-semibold text-green-600">#{billId}</span>
                        </p>
                        <p className="mb-4 text-xs text-gray-500">
                            Bạn có thể xem chi tiết trong{' '}
                            <Link href="/lich-su" className="text-blue-500 underline">
                                Lịch sử đặt sân
                            </Link>
                        </p>
                        <button
                            className="rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600"
                            onClick={onClose}
                        >
                            Tiếp tục đặt sân
                        </button>
                    </>
                ) : (
                    <>
                        <p className="mb-4 text-sm text-gray-600">
                            Đơn hàng của quý khách đã không thể hoàn tất thanh toán
                            <br />
                            Hãy thử lại...
                        </p>
                        <button
                            className="rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600"
                            onClick={onClose}
                        >
                            Thử thanh toán lại
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentResultModal;
