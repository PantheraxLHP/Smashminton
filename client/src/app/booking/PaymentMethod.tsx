import React from "react";

type PaymentMethodType = "momo" | "payos" | null;

interface PaymentMethodProps {
    selectedMethod: PaymentMethodType;
    onSelect: (method: PaymentMethodType) => void;
    finalTotal: number;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ selectedMethod, onSelect, finalTotal }) => {
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
                                        : "border-gray-300 text-black hover:border-green-500 hover:text-green-600 hover:bg-green-100"}`}
                            >
                                <img src={`/${method}.png`} alt={method} className="w-10 h-10 mr-2" />
                                <span className="text-xs">{method === "momo" ? "Momo" : "PayOS"}</span>
                            </button>
                        ))}
                    </div>
                    <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        Thanh toán {finalTotal.toLocaleString()} VND
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;
