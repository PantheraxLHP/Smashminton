import React from 'react';

interface PaymentMethodSectionProps {
    selectedMethod: 'momo' | 'payos';
    setSelectedMethod: (method: 'momo' | 'payos') => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
    selectedMethod,
    setSelectedMethod,
}) => {
    return (
        <div className="pt-4 border-t border-gray-400 min-w-[800px]">
            <p className="font-semibold mb-2">HÌNH THỨC THANH TOÁN</p>
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="payment"
                        checked={selectedMethod === 'momo'}
                        onChange={() => setSelectedMethod('momo')}
                    />
                    <span className="text-primary-600">Thanh toán qua Momo</span>
                    <img src="/momo.png" alt="momo" className="w-6 h-6" />
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="payment"
                        checked={selectedMethod === 'payos'}
                        onChange={() => setSelectedMethod('payos')}
                    />
                    <span className="text-primary-600">Thanh toán qua PayOS</span>
                    <img src="/payos.png" alt="payos" className="w-6 h-6 border" />
                </label>
            </div>
        </div>
    );
};

export default PaymentMethodSection;
