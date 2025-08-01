'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { formatPrice, formatTime } from '@/lib/utils';
import { createMomo, createPayOS } from '@/services/payment.service';
import { getVouchers } from '@/services/vouchers.service';
import { Voucher } from '@/types/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import OrderSummary from './OrderSummary';
import PaymentMethodSection from './PaymentMethodSection';
import { customerPhoneSchema, paymentMethodSchema, sanitizePhone } from '@/lib/validation.schema';

export default function PaymentPage() {
    const [selectedMethod, setSelectedMethod] = useState<'momo' | 'payos'>('momo');
    const { totalCourtPrice, totalProductPrice, TTL, selectedCourts, clearRentalOrder } = useBooking();
    const { user } = useAuth();
    const [customerPhone, setCustomerPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [discount, setDiscount] = useState(0);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState<number>();
    const userProfile = user;
    const [timeLeft, setTimeLeft] = useState(TTL);

    // Handle customer phone validation
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = sanitizePhone(e.target.value);
        setCustomerPhone(value);
        
        // Real-time validation
        try {
            customerPhoneSchema.parse(value);
            setPhoneError('');
        } catch (error: any) {
            if (value.length > 0) {
                setPhoneError(error.errors?.[0]?.message || 'Số điện thoại không hợp lệ');
            } else {
                setPhoneError('');
            }
        }
    };

    const total = totalCourtPrice + totalProductPrice;
    let courtPriceDiscount = 0;
    if (userProfile?.studentCard?.studentcardid) {
        courtPriceDiscount = totalCourtPrice * 0.1;
    }
    const totalWithDiscount = total * (1 - discount) - courtPriceDiscount;

    useEffect(() => {
        const loadVouchers = async () => {
            const vouchersResponse = await getVouchers();
            if (vouchersResponse.ok) {
                setVouchers(vouchersResponse.data.vouchers);
            }
        };
        loadVouchers();
    }, []);

    useEffect(() => {
        if (selectedCourts && selectedCourts.length > 0) {
            setTimeLeft(TTL);
        }
    }, [TTL, selectedCourts]);

    useEffect(() => {
        if (timeLeft <= 0 || !selectedCourts || selectedCourts.length === 0) {
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerId);
                    toast.warning('Thời gian đặt sân đã hết. Vui lòng chọn lại sân.');
                    clearRentalOrder();
                    window.location.reload();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(timerId);
    }, [TTL, selectedCourts, timeLeft, clearRentalOrder]);

    const handlePayment = async () => {
        if (totalProductPrice === 0 && totalCourtPrice === 0) {
            toast.error('Vui lòng chọn sản phẩm hoặc sân để thanh toán!');
            return;
        }

        // Validate payment method
        try {
            paymentMethodSchema.parse(selectedMethod);
        } catch (error) {
            toast.error('Vui lòng chọn phương thức thanh toán hợp lệ');
            return;
        }

        // Validate customer phone number if user is not a Customer
        let validatedPhone = userProfile?.phonenumber || '';
        if (userProfile?.accounttype !== 'Customer') {
            try {
                validatedPhone = customerPhoneSchema.parse(sanitizePhone(customerPhone));
            } catch (error) {
                toast.error('Số điện thoại khách hàng không hợp lệ');
                return;
            }
        }

        const Payload = {
            userId: userProfile?.accountid?.toString() || '',
            userName: userProfile?.username || '',
            guestPhoneNumber: validatedPhone,
            paymentMethod: selectedMethod,
            voucherId: selectedVoucherId?.toString() || '',
            totalAmount: totalWithDiscount,
        };

        if (selectedMethod === 'momo') {
            const response = await createMomo(Payload);
            if (response.ok) {
                const PaymentUrlMoMo = await response.data;
                window.location.href = PaymentUrlMoMo;
            } else {
                alert(response.message || 'Thanh toán thất bại!');
            }
        } else {
            const response = await createPayOS(Payload);
            if (response.ok) {
                const PaymentUrlPayOS = await response.data;
                window.location.href = PaymentUrlPayOS;
            } else {
                alert(response.message || 'Thanh toán thất bại!');
            }
        }
    };

    return (
        <div className="w-full space-y-4 p-4 text-sm">
            <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="font-bold">SỐ ĐIỆN THOẠI KHÁCH HÀNG:</span>
                        {userProfile?.accounttype !== 'Customer' ? (
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    value={customerPhone}
                                    onChange={handlePhoneChange}
                                    placeholder="Số điện thoại khách hàng"
                                    className={`w-48 rounded border px-2 py-1 text-xs ${
                                        phoneError ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {phoneError && (
                                    <span className="mt-1 text-xs text-red-500">{phoneError}</span>
                                )}
                            </div>
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
                {/* Countdown Timer UI */}
                {selectedCourts && selectedCourts.length > 0 && timeLeft > 0 && (
                    <div className="mt-4 flex w-full justify-end sm:mt-0 sm:w-auto">
                        <div className="text-primary border-primary flex min-w-[120px] flex-col items-center rounded-lg border-2 border-solid bg-white p-2">
                            <span className="text-sm">Thời gian giữ sân:</span>
                            <span className="w-full text-3xl">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full overflow-auto rounded border border-black bg-gray-50">
                <div className="min-w-[800px] bg-primary-500 border-b border-black text-center font-semibold text-white py-2 pr-4 pl-4">
                    THÔNG TIN ĐƠN HÀNG
                </div>

                <div className="min-w-[800px] space-y-3 pt-2 pb-3 pl-4 pr-4">
                    <OrderSummary />

                    <div className="border-t border-gray-400 pt-4">
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
                                    <Checkbox
                                        disabled
                                        checked={!!userProfile?.studentCard?.studentcardid}
                                        className="size-5 disabled:cursor-default disabled:opacity-100"
                                    />
                                    - 10% giá sân
                                </div>
                            </div>
                            <div className="flex items-center gap-32 pr-16">
                                <div className="flex items-center gap-2">
                                    <span className="text-orange-500">
                                        Giảm giá - {formatPrice(total - totalWithDiscount)}
                                    </span>
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
                <Button 
                    onClick={handlePayment} 
                    variant={'default'}
                    disabled={
                        (userProfile?.accounttype !== 'Customer' && (!!phoneError || !customerPhone)) ||
                        (totalWithDiscount <= 0)
                    }
                >
                    THANH TOÁN — {formatPrice(totalWithDiscount)}
                </Button>
            </div>
        </div>
    );
}
