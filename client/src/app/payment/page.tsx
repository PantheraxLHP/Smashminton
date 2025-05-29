'use client';

import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { formatPrice } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { DiscountCodeSelector } from './Discount';
import OrderSummary from './OrderSummary';
import PaymentMethodSection from './PaymentMethodSection';

export default function PaymentPage() {
    const [selectedMethod, setSelectedMethod] = useState<'momo' | 'payos'>('momo');
    const { totalCourtPrice, totalProductPrice } = useBooking();
    const { user } = useAuth();
    const [customerPhone, setCustomerPhone] = useState('');

    const userProfile = user;

    const total = totalCourtPrice + totalProductPrice;
    const totalWithDiscount = useMemo(() => total * 0.9, [total]);

    return (
        <div className="w-full space-y-4 p-4 text-sm">
            <h1 className="text-center text-lg font-semibold">THÔNG TIN THANH TOÁN</h1>

            <div className="flex flex-wrap items-center gap-4">
                <div className="flex w-full items-center gap-2">
                    <span className="font-medium">SỐ ĐIỆN THOẠI KHÁCH HÀNG:</span>
                    {userProfile?.accounttype !== 'Customer' ? (
                        <input
                            type="text"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="Số điện thoại khách hàng"
                            className="w-48 rounded border border-gray-300 px-2 py-1 text-xs"
                        />
                    ) : (
                        <span className="rounded bg-gray-200 px-2 py-1 text-xs">{userProfile?.phonenumber}</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">MÃ NHÂN VIÊN:</span>
                    <span className="rounded bg-gray-200 px-2 py-1 text-xs">
                        {userProfile?.accounttype !== 'Customer' ? userProfile?.accountid : '#####'}
                    </span>
                </div>
            </div>

            <div className="w-full overflow-auto rounded border border-black bg-gray-50">
                <div className="bg-primary-500 min-w-[800px] border-b border-black py-2 text-center font-semibold text-white">
                    THÔNG TIN ĐƠN HÀNG
                </div>

                <div className="space-y-3 pt-2 pr-4 pb-3 pl-4">
                    <OrderSummary />

                    <div className="min-w-[800px] border-t border-gray-400 pt-4">
                        <div className="flex flex-col items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="font-semibold whitespace-nowrap">MÃ GIẢM GIÁ</span>
                                <DiscountCodeSelector />
                            </div>
                            <div className="flex items-center gap-32 pr-16">
                                <div className="flex items-center gap-2">
                                    <span>Học sinh / Sinh viên</span>
                                    <input type="checkbox" defaultChecked />
                                </div>
                                <span>- 10%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 text-base font-semibold">
                        <span className="pr-16">TỔNG CỘNG: {formatPrice(totalWithDiscount)}</span>
                    </div>

                    <PaymentMethodSection selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
                </div>
            </div>

            <div className="text-center">
                <button className="bg-primary-500 hover:bg-primary-600 cursor-pointer rounded px-6 py-3 font-semibold text-white">
                    THANH TOÁN — {formatPrice(totalWithDiscount)}
                </button>
            </div>
        </div>
    );
}
