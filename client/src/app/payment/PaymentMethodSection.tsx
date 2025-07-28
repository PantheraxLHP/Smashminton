import Image from 'next/image';
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentMethodSectionProps {
    selectedMethod: 'momo' | 'payos';
    setSelectedMethod: (method: 'momo' | 'payos') => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({ selectedMethod, setSelectedMethod }) => {
    return (
        <div className="border-t border-gray-400 pt-4">
            <p className="mb-2 font-semibold">HÌNH THỨC THANH TOÁN</p>
            <div className="flex flex-col gap-2">
                <RadioGroup
                    value={selectedMethod}
                    onValueChange={(value) => setSelectedMethod(value as 'momo' | 'payos')}
                >
                    <div className="flex items-center gap-2">
                        <RadioGroupItem id='momo' value='momo' className="cursor-pointer" />
                        <Label
                            htmlFor='momo'
                            className="cursor-pointer flex items-center gap-2"
                        >
                            Momo
                            <Image src="/momo.png" alt="momo" width={24} height={24} className="h-6 w-6" />
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem id='payos' value='payos' className="cursor-pointer" />
                        <Label
                            htmlFor='payos'
                            className="cursor-pointer flex items-center gap-2"
                        >
                            PayOS
                            <Image src="/payos.png" alt="payos" width={24} height={24} className="h-6 w-6 border" />
                        </Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
};

export default PaymentMethodSection;
