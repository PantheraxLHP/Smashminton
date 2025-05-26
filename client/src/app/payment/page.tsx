'use client';

import { useBooking } from '@/context/BookingContext';
import { DiscountCodeSelector } from "./Discount";
import OrderSummary from "./OderSummary";
import React, { useMemo, useState } from "react";
import PaymentMethodSection from './PaymentMethodSection';
import QRCodeModal from './QRCodeModal';
import { useAuth } from '@/context/AuthContext';

export default function PaymentPage() {
    const [selectedMethod, setSelectedMethod] = useState<'momo' | 'payos'>('momo');
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const { selectedCourts, selectedProducts } = useBooking();
    const [productQuantities, setProductQuantities] = useState(
        Object.fromEntries(selectedProducts.map((p) => [p.productid, p.quantity]))
    );
    const { user, setUser } = useAuth();
    const [customerPhone, setCustomerPhone] = useState('');


    const userProfile = user;
    const qrValue = 'https://example.com/qr';

    const formatCurrency = (value: number) => value.toLocaleString("vi-VN") + " đ";

    const courtTotal = useMemo(() => {
        return selectedCourts.reduce((sum, court) => {
            const numericPrice =
                typeof court.price === "string"
                    ? parseInt(court.price.replace(/[^\d]/g, ""), 10)
                    : court.price;
            const duration = court.duration ?? 1;
            return sum + (isNaN(numericPrice) ? 0 : numericPrice * duration);
        }, 0);
    }, [selectedCourts]);

    const productTotal = useMemo(() => {
        return selectedProducts.reduce((sum, p) => {
            const qty = productQuantities[p.productid] || 1;
            return sum + p.unitprice * qty;
        }, 0);
    }, [selectedProducts, productQuantities]);

    const total = useMemo(() => courtTotal + productTotal, [courtTotal, productTotal]);
    const totalWithDiscount = useMemo(() => total * 0.9, [total]);



    return (
        <div className="w-full p-4 space-y-4 text-sm">
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-48"
                        />
                    ) : (
                        <span className="bg-gray-200 px-2 py-1 rounded text-xs">{userProfile?.phonenumber}</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">MÃ NHÂN VIÊN:</span>
                    <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                        {userProfile?.accounttype !== 'Customer' ? userProfile?.accountid : '#####'}
                    </span>
                </div>
            </div>


            <div className="border border-black w-full overflow-auto rounded">
                <div className="min-w-[800px] bg-primary-500 font-semibold text-center py-2 border-b border-black text-white">
                    THÔNG TIN ĐƠN HÀNG
                </div>

                <div className="pt-2 pr-4 pb-3 pl-4 space-y-3">
                    <OrderSummary
                        formatCurrency={formatCurrency}
                        productQuantities={productQuantities}
                        setProductQuantities={setProductQuantities}
                    />


                    <div className="pt-4 border-t border-gray-400 min-w-[800px]">
                        <div className="flex flex-wrap justify-between items-center gap-4">
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

                    <PaymentMethodSection
                        selectedMethod={selectedMethod}
                        setSelectedMethod={setSelectedMethod}
                    />

                    <div className="border-t border-black pt-3 flex justify-between items-center text-base font-semibold">
                        <span>TỔNG CỘNG</span>
                        <span className="pr-16">{formatCurrency(totalWithDiscount)}</span>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded font-semibold cursor-pointer"
                    onClick={() => setQrModalOpen(true)}>
                    THANH TOÁN — {formatCurrency(totalWithDiscount)}
                </button>
            </div>
            <QRCodeModal
                isOpen={qrModalOpen}
                onClose={() => setQrModalOpen(false)}
                amount={totalWithDiscount}
                qrValue={qrValue}
                selectedMethod={selectedMethod}
                onPaymentSuccess={() => {
                    setQrModalOpen(false);
                    alert('Thanh toán thành công!');
                }}
            />
        </div>
    );
}
