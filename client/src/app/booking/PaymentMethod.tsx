import React, { useState } from "react";
import QRCodeModal from "./QRCodeModal";
import PaymentResultModal from "./PaymentResultModal"; // 👈 import thêm modal kết quả

type PaymentMethodType = "momo" | "payos" | null;

interface PaymentMethodProps {
    selectedMethod: PaymentMethodType;
    onSelect: (method: PaymentMethodType) => void;
    finalTotal: number;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
    selectedMethod,
    onSelect,
    finalTotal,
}) => {
    const [showQR, setShowQR] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false); // 👈 thêm state mới
    const billId = "AB2324-01";
    const qrValue = `Thanh toán đơn ${billId} với ${finalTotal.toLocaleString()} VND`;

    const handlePaymentSuccess = () => {
        setShowQR(false);         // Ẩn QR
        setShowResultModal(true); // Hiện kết quả thành công
    };

    return (
        <div className="text-center">
            <div className="flex flex-row items-start">
                <h3 className="text-lg font-semibold text-gray-700 mr-5 mt-4 whitespace-nowrap">
                    Hình thức thanh toán
                </h3>

                <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-center gap-6 mb-2">
                        {["momo", "payos"].map((method) => (
                            <button
                                key={method}
                                onClick={() => onSelect(method as PaymentMethodType)}
                                className={`flex flex-row items-center justify-center w-25 h-15 border-2 rounded-lg 
                  ${selectedMethod === method
                                        ? "border-green-500 text-black bg-green-100"
                                        : "border-gray-300 text-black hover:border-green-500 hover:text-green-600 hover:bg-green-100"
                                    }`}
                            >
                                <img src={`/${method}.png`} alt={method} className="w-10 h-10 mr-2" />
                                <span className="text-xs">{method === "momo" ? "Momo" : "PayOS"}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowQR(true)}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Thanh toán {finalTotal.toLocaleString()} VND
                    </button>
                </div>
            </div>

            {/* Hiển thị QR khi click */}
            <QRCodeModal
                isOpen={showQR}
                onClose={() => setShowQR(false)}
                onPaymentSuccess={handlePaymentSuccess}
                amount={finalTotal}
                billId={billId}
                qrValue={qrValue}
                selectedMethod={selectedMethod || 'momo'}
            />

            {/* Hiển thị kết quả thanh toán */}
            <PaymentResultModal
                isOpen={showResultModal}
                onClose={() => setShowResultModal(false)}
                status="success" // luôn thành công vì test thôi
                billId={billId}
            />
        </div>
    );
};

export default PaymentMethod;
