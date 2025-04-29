import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface PaymentResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: "success" | "failed";
    billId: string;
}

const PaymentResultModal: React.FC<PaymentResultModalProps> = ({
    isOpen,
    onClose,
    status,
    billId,
}) => {
    if (!isOpen) return null;

    const isSuccess = status === "success";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10 bg-opacity-40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-6 w-[400px] shadow-lg text-center relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 right-5 text-2xl text-gray-400 hover:text-black"
                    onClick={onClose}
                >
                    ×
                </button>

                <div className="flex justify-center mb-4">
                    {isSuccess ? (
                        <CheckCircle className="text-green-500" size={60} />
                    ) : (
                        <XCircle className="text-red-500" size={60} />
                    )}
                </div>

                <h2 className="font-semibold text-lg mb-2">
                    {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
                </h2>

                {isSuccess ? (
                    <>
                        <p className="text-gray-600 text-sm mb-1">
                            Mã hóa đơn của bạn là <span className="text-green-600 font-semibold">#{billId}</span>
                        </p>
                        <p className="text-gray-500 text-xs mb-4">
                            Bạn có thể xem chi tiết trong <a href="/lich-su" className="text-blue-500 underline">Lịch sử đặt sân</a>
                        </p>
                        <button
                            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                            onClick={onClose}
                        >
                            Tiếp tục đặt sân
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-gray-600 text-sm mb-4">
                            Đơn hàng của quý khách đã không thể hoàn tất thanh toán
                            <br />
                            Hãy thử lại...
                        </p>
                        <button
                            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
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
