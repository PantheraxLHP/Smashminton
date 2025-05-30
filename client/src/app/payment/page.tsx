'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { formatPrice } from '@/lib/utils';
import { getVouchers } from '@/services/vouchers.service';
import { Voucher } from '@/types/types';
import { useEffect, useState } from 'react';
import OrderSummary from './OrderSummary';
import PaymentMethodSection from './PaymentMethodSection';
import { Button } from '@/components/ui/button';
import { createPayOS } from '@/services/payment.service';

export default function PaymentPage() {
    const [selectedMethod, setSelectedMethod] = useState<'momo' | 'payos'>('momo');
    const { totalCourtPrice, totalProductPrice } = useBooking();
    const { user } = useAuth();
    const [customerPhone, setCustomerPhone] = useState('');
    const [discount, setDiscount] = useState(0);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState<number>();
    const userProfile = user;

    let studentStatus = userProfile?.isStudent;
    studentStatus = true;

    let totalCourtPriceWithDiscount = totalCourtPrice;
    if (selectedVoucherId) {
        totalCourtPriceWithDiscount = totalCourtPrice * 0.9;
    }

    const total = totalCourtPriceWithDiscount + totalProductPrice;
    const totalWithDiscount = total * (1 - discount);

    useEffect(() => {
        const loadVouchers = async () => {
            const vouchersResponse = await getVouchers();
            if (vouchersResponse.ok) {
                setVouchers(vouchersResponse.data.vouchers);
            }
        };
        loadVouchers();
    }, []);

    const handlePayment = async () => {
        const PayloadPayOS = {
            userId: userProfile?.accountid?.toString() || '',
            userName: userProfile?.username || '',
            guestPhoneNumber: userProfile?.accounttype !== 'Customer' ? customerPhone : userProfile?.phonenumber || '',
            paymentMethod: selectedMethod,
            voucherId: selectedVoucherId?.toString() || '',
            totalAmount: totalWithDiscount,
        };

        const response = await createPayOS(PayloadPayOS);

        if (response.ok) {
            const PaymentUrlPayOS = await response.data;
            window.location.href = PaymentUrlPayOS;
        } else {
            alert(response.message || 'Thanh toán thất bại!');
        }
    };

    return (
        <div className="w-full space-y-4 p-4 text-sm">
            <h1 className="text-center text-xl font-semibold">THÔNG TIN THANH TOÁN</h1>

            <div className="flex flex-wrap items-center gap-4">
                <div className="flex w-full items-center gap-2">
                    <span className="font-bold">SỐ ĐIỆN THOẠI KHÁCH HÀNG:</span>
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
                    <span className="font-bold">MÃ NHÂN VIÊN:</span>
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
                                <Select
                                    onValueChange={(selected) => {
                                        if (selected === 'none') {
                                            setSelectedVoucherId(undefined);
                                            setDiscount(0);
                                        } else {
                                            setSelectedVoucherId(parseInt(selected));
                                            setDiscount(
                                                vouchers.find((voucher) => voucher.voucherid.toString() === selected)
                                                    ?.discountamount || 0,
                                            );
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-[220px] rounded-md border-1 border-black text-black hover:border-black hover:text-black">
                                        <SelectValue placeholder="Chọn mã giảm giá" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Không chọn</SelectItem>
                                        {vouchers.map((voucher) => (
                                            <SelectItem key={voucher.voucherid} value={voucher.voucherid.toString()}>
                                                {voucher.vouchername}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-32 pr-16">
                                <div className="flex items-center gap-2">
                                    <span>Học sinh / Sinh viên</span>
                                    <input type="checkbox" checked={!!studentStatus} readOnly />- 10% giá sân
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 text-base font-semibold">
                        <span className="pr-16">THÀNH TIỀN: {formatPrice(totalWithDiscount)}</span>
                    </div>

                    <PaymentMethodSection selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
                </div>
            </div>

            <div className="text-center">
                <Button onClick={handlePayment} variant={'default'}>
                    THANH TOÁN — {formatPrice(totalWithDiscount)}
                </Button>
            </div>
        </div>
    );
}
