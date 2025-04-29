'use client';

import React, { useState, useEffect } from "react";
import BookingStep from "@/app/booking/(court-booking)/BookingStep";
import CustomerInfo from "./CustomerInfo";
import PaymentMethod from "./PaymentMethod";

type PaymentMethodType = "momo" | "payos" | null;

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
        <div className="w-full mx-auto bg-white p-6 rounded-lg">

            {/* Header */}
            <div className="flex justify-between items-center border-b pb-5 pt-5">
                <h2 className="text-xl font-semibold text-center w-full">THÔNG TIN THANH TOÁN</h2>
            </div>

            {/* Order Info - Desktop */}
            <div className="hidden md:grid grid-cols-[0.7fr_1fr] text-center mt-4">
                <div className="bg-primary-50 p-4 rounded-lg rounded-br-none">
                    <h3 className="text-md font-semibold text-green-700 text-center">THÔNG TIN ĐƠN HÀNG</h3>
                </div>
                <div className="w-full flex justify-around items-baseline">
                    <div className="text-sm text-gray-700 flex flex-col items-center">
                        <p className="font-medium">Mã hóa đơn:</p>
                        <strong>{paymentData.invoiceCode}</strong>
                    </div>
                    <div className="text-sm text-gray-700 flex flex-col items-center">
                        <p className="font-medium">Mã nhân viên:</p>
                        <strong>{paymentData.employeeCode}</strong>
                    </div>
                    <div className="text-sm text-gray-700 flex flex-col items-center">
                        <p className="font-medium">Ngày tạo:</p>
                        <strong>{paymentData.createdAt}</strong>
                    </div>
                </div>
            </div>

            {/* Order Info - Mobile/Tablet */}
            <div className="flex flex-col gap-2 mt-4 md:hidden bg-primary-50 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-green-700 mb-2 text-center">THÔNG TIN ĐƠN HÀNG</h3>
                <div className="text-sm text-gray-700">
                    <p className="font-medium">Mã hóa đơn:</p>
                    <p className="mb-1">{paymentData.invoiceCode}</p>
                    <p className="font-medium">Mã nhân viên:</p>
                    <p className="mb-1">{paymentData.employeeCode}</p>
                    <p className="font-medium">Ngày tạo:</p>
                    <p>{paymentData.createdAt}</p>
                </div>
            </div>

            {/* Payment Table - Desktop */}
            <div className="hidden md:grid grid-cols-[0.7fr_1fr]">
                <div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-300">
                            <tr className="text-gray-600">
                                <th className="px-4 py-2">Mô tả</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-gray-800">
                            {paymentData.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-200">
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        {item.icon && (
                                            <img src={item.icon} alt="icon" className="w-5 h-5 object-contain" />
                                        )}
                                        {item.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-primary-50 rounded-lg rounded-tl-none">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-gray-300">
                            <tr className="text-gray-600 text-center">
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
                        <tfoot className="text-gray-800 text-right">
                            <tr>
                                <td colSpan={4} className="px-2 py-2 font-semibold text-right">Tổng tiền</td>
                                <td className="px-2 py-2 text-right">{total.toLocaleString()} đ</td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="px-2 py-2 font-semibold text-right">S - Student</td>
                                <td className="px-2 py-2 text-right text-red-600">- 10%</td>
                            </tr>
                            <tr className="font-bold text-black">
                                <td colSpan={4} className="px-2 py-2 text-right">Tổng cộng</td>
                                <td className="px-2 py-2 text-right">{finalTotal.toLocaleString()} đ</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Payment Table - Mobile/Tablet */}
            <div className="md:hidden mt-4 flex flex-col gap-4">
                {paymentData.items.map((item, idx) => (
                    <div key={idx} className="border p-4 rounded-lg bg-white shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            {item.icon && (
                                <img src={item.icon} alt="icon" className="w-5 h-5 object-contain" />
                            )}
                            <span className="font-medium text-gray-800">{item.description}</span>
                        </div>
                        <div className="flex flex-wrap text-sm text-gray-600">
                            <div className="w-1/2 mb-1"><strong>Số lượng:</strong> {item.quantity}</div>
                            <div className="w-1/2 mb-1"><strong>Thời gian:</strong> {item.time}</div>
                            <div className="w-1/2 mb-1"><strong>Thời lượng:</strong> {item.duration}</div>
                            <div className="w-1/2 mb-1"><strong>Đơn giá:</strong> {item.unitPrice.toLocaleString()} đ</div>
                            <div className="w-full mt-1"><strong>Thành tiền:</strong> {item.total.toLocaleString()} đ</div>
                        </div>
                    </div>
                ))}

                {/* Tổng cộng - Mobile/Tablet */}
                <div className="text-sm mt-4 bg-primary-50 p-4 rounded-lg md:hidden">
                    <p className="font-semibold text-left">Tổng tiền: {total.toLocaleString()} đ</p>
                    <p className="text-red-600 font-semibold text-left">S - Student: -10%</p>
                    <p className="text-lg font-bold text-black text-left">Tổng cộng: {finalTotal.toLocaleString()} đ</p>
                </div>

            </div>


            <div className="mt-6 p-4 rounded-lg grid grid-cols-1 lg:grid-cols-[0.7fr_1fr] gap-6 border-t">
                <CustomerInfo customerInfo={paymentData.customerInfo} />
                <PaymentMethod
                    selectedMethod={selectedMethod}
                    onSelect={handleSelect}
                    finalTotal={finalTotal}
                />
            </div>
        </div>
    );
};

export default PaymentInfo;
