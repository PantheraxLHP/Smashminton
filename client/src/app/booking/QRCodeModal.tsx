import React, { useEffect } from 'react';
import QRCode from "react-qr-code";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    billId: string;
    qrValue: string;
    onPaymentSuccess: () => void;
    selectedMethod: 'momo' | 'payos';
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, amount, billId, qrValue, onPaymentSuccess, selectedMethod }) => {
    // Đóng modal khi nhấn ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10 bg-opacity-40"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white rounded-2xl p-6 w-[350px] shadow-lg relative text-center"
                onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng khi click vào bên trong modal
            >
                <h2 className="text-gray-500 text-sm mb-1">Số tiền cần thanh toán</h2>
                <h1 className="text-2xl font-bold text-[#242424] mb-3">{amount.toLocaleString()} VNĐ</h1>

                <div
                    className={`border-[3px] rounded-xl p-2 mb-2 flex flex-col items-center
                                ${selectedMethod === 'momo' ? 'border-pink-500' : 'border-purple-600'} `}>
                    <div className={`${selectedMethod === 'momo' ? 'bg-pink-500' : 'bg-purple-600'} text-white text-xs px-2 py-1 rounded-t-md inline-block mb-1`}>
                        QR Nhận Tiền
                    </div>
                    <div className="bg-white p-1 rounded-md">
                        <QRCode value={qrValue} size={180} />
                    </div>
                </div>

                <p className="text-xs text-gray-500 mb-2">Nhận tiền từ mọi Ngân hàng và Ví điện tử</p>

                <div className="text-center text-xs text-gray-700 mb-4">
                    <p><strong>Mã hóa đơn:</strong> <span className="text-black font-medium">#{billId}</span></p>
                </div>

                <button
                    onClick={onPaymentSuccess}
                    className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded-lg text-sm font-semibold"
                >
                    HỦY
                </button>
            </div>
        </div>
    );
};

export default QRCodeModal;
