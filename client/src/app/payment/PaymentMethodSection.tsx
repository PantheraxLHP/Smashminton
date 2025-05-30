import Image from 'next/image';
import React from 'react';

interface PaymentMethodSectionProps {
    selectedMethod: 'momo' | 'payos';
    setSelectedMethod: (method: 'momo' | 'payos') => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({ selectedMethod, setSelectedMethod }) => {
    return (
        <div className="min-w-[800px] border-t border-gray-400 pt-4">
            <p className="mb-2 font-semibold">HÌNH THỨC THANH TOÁN</p>
            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="payment"
                        checked={selectedMethod === 'momo'}
                        onChange={() => setSelectedMethod('momo')}
                        className="accent-primary-500"
                    />
                    <span>Momo</span>
                    <Image src="/momo.png" alt="momo" width={24} height={24} className="h-6 w-6" />
                </label>
                <label className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="payment"
                        checked={selectedMethod === 'payos'}
                        onChange={() => setSelectedMethod('payos')}
                        className="accent-primary-500"
                    />
                    <span>PayOS</span>
                    <Image src="/payos.png" alt="payos" width={24} height={24} className="h-6 w-6 border" />
                </label>
            </div>
        </div>
    );
};

export default PaymentMethodSection;
