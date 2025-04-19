'use client';

import React, { useState, useEffect } from 'react';
import BookingStep from '@/app/booking/BookingStep';
import CustomerInfo from './CustomerInfo';
import PaymentMethod from './PaymentMethod';

type PaymentMethodType = 'momo' | 'payos' | null;

interface Item {
    icon: string;
    description: string;
    quantity: string;
    duration: string;
    time: string;
    unitPrice: number;
    total: number;
}

interface PaymentData {
    selectedMethod: PaymentMethodType;
    finalTotal: number;
    items: Item[];
    discount: number;
    invoiceCode: string;
    employeeCode: string;
    createdAt: string;
    customerInfo: {
        fullName: string;
        phone: string;
        email: string;
    };
}

interface PaymentInfoProps {
    paymentData: PaymentData;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ paymentData }) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(paymentData.selectedMethod);

    const handleSelect = (method: PaymentMethodType) => {
        setSelectedMethod((prev) => (prev === method ? null : method));
    };

    const total = paymentData.items.reduce((sum, item) => sum + item.total, 0);
    const finalTotal = total * (1 - paymentData.discount);

    useEffect(() => {
        setSelectedMethod(paymentData.selectedMethod);
    }, [paymentData.selectedMethod]);

    return (
        <div className="mx-auto w-full rounded-lg bg-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pt-5 pb-5">
                <h2 className="w-full text-center text-xl font-semibold">THÔNG TIN THANH TOÁN</h2>
            </div>

            {/* Order Info */}
            <div className="mt-4 grid grid-cols-[0.7fr_1fr] text-center">
                <div className="bg-primary-50 rounded-lg rounded-br-none p-4">
                    <h3 className="text-md text-center font-semibold text-green-700">THÔNG TIN ĐƠN HÀNG</h3>
                </div>
                <div className="flex w-full items-baseline justify-around">
                    <div className="flex flex-col items-center text-sm text-gray-700">
                        <p className="font-medium">Mã hóa đơn:</p>
                        <strong>{paymentData.invoiceCode}</strong>
                    </div>
                    <div className="flex flex-col items-center text-sm text-gray-700">
                        <p className="font-medium">Mã nhân viên:</p>
                        <strong>{paymentData.employeeCode}</strong>
                    </div>
                    <div className="flex flex-col items-center text-sm text-gray-700">
                        <p className="font-medium">Ngày tạo:</p>
                        <strong>{paymentData.createdAt}</strong>
                    </div>
                </div>
            </div>

            {/* Payment Table */}
            <div className="grid grid-cols-[0.7fr_1fr]">
                <div>
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-300 bg-white">
                            <tr className="text-gray-600">
                                <th className="px-4 py-2">Mô tả</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-gray-800">
                            {paymentData.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-200">
                                    <td className="flex items-center gap-2 px-4 py-2">
                                        {item.icon && (
                                            <img src={item.icon} alt="icon" className="h-5 w-5 object-contain" />
                                        )}
                                        {item.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-primary-50 rounded-lg rounded-tl-none">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-300">
                            <tr className="text-center text-gray-600">
                                <th className="px-2 py-2">Số lượng</th>
                                <th className="px-2 py-2">Thời gian</th>
                                <th className="px-2 py-2">Thời lượng</th>
                                <th className="px-2 py-2 text-right">Đơn giá</th>
                                <th className="px-2 py-2 text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {paymentData.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-200 text-center">
                                    <td className="px-2 py-2">{item.quantity}</td>
                                    <td className="px-2 py-2">{item.time}</td>
                                    <td className="px-2 py-2">{item.duration}</td>
                                    <td className="px-2 py-2 text-right">{item.unitPrice.toLocaleString()} đ</td>
                                    <td className="px-2 py-2 text-right">{item.total.toLocaleString()} đ</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="text-right text-gray-800">
                            <tr>
                                <td colSpan={4} className="px-2 py-2 text-right font-semibold">
                                    Tổng tiền
                                </td>
                                <td className="px-2 py-2 text-right">{total.toLocaleString()} đ</td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="px-2 py-2 text-right font-semibold">
                                    S - Student
                                </td>
                                <td className="px-2 py-2 text-right text-red-600">- 10%</td>
                            </tr>
                            <tr className="font-bold text-black">
                                <td colSpan={4} className="px-2 py-2 text-right">
                                    Tổng cộng
                                </td>
                                <td className="px-2 py-2 text-right">{finalTotal.toLocaleString()} đ</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-[0.7fr_1fr] gap-6 rounded-lg border-t-1 p-4">
                <CustomerInfo customerInfo={paymentData.customerInfo} />
                <PaymentMethod selectedMethod={selectedMethod} onSelect={handleSelect} finalTotal={finalTotal} />
            </div>
        </div>
    );
};

export default PaymentInfo;
