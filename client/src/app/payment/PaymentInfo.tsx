'use client'; // Đảm bảo chạy trên client

import React, { useState, useEffect } from "react";
import BookingStep from "@/app/booking/BookingStep";

type PaymentMethod = "momo" | "payos" | null;

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
    selectedMethod: PaymentMethod;
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
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentData.selectedMethod);

    const handleSelect = (method: PaymentMethod) => {
        setSelectedMethod((prev) => (prev === method ? null : method));
    };

    const total = paymentData.items.reduce((sum, item) => sum + item.total, 0);
    const finalTotal = total * (1 - paymentData.discount);

    useEffect(() => {
        setSelectedMethod(paymentData.selectedMethod);
    }, [paymentData.selectedMethod]);

    return (
        <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
            <BookingStep currentStep={3} />

            {/* Header */}
            <div className="flex justify-between items-center border-b pb-5 pt-5">
                <h2 className="text-xl font-semibold text-center w-full">THÔNG TIN THANH TOÁN</h2>
            </div>

            {/* Order Info Section */}
            <div className="grid grid-cols-[0.7fr_1fr] text-center mt-4">
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

            {/* Payment Table */}
            <div className="grid grid-cols-[0.7fr_1fr]">
                {/* Left table: Description */}
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

                {/* Right table: Quantity, Duration, Time, Unit Price, Total */}
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

            {/* Customer Info Section */}
            <div className="mt-6 p-4 rounded-lg grid grid-cols-[0.7fr_1fr] gap-6 border-t-1">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Thông tin khách hàng</h3>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                            <input
                                type="text"
                                className="p-2 mt-1 border border-gray-300 rounded-md text-gray-700"
                                value={paymentData.customerInfo.fullName}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                            <input
                                type="text"
                                className="p-2 mt-1 border border-gray-300 rounded-md text-gray-700"
                                value={paymentData.customerInfo.phone}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="text"
                                className="p-2 mt-1 border border-gray-300 rounded-md text-gray-700"
                                value={paymentData.customerInfo.email}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method Section */}
                <div className="text-center">
                    <div className="flex flex-row items-start">
                        <h3 className="text-lg font-semibold text-gray-700 mr-5 mt-4 whitespace-nowrap">
                            Hình thức thanh toán
                        </h3>

                        <div className="flex flex-col items-center gap-4">
                            <div className="flex justify-center gap-6 mb-2">
                                <button
                                    onClick={() => handleSelect("momo")}
                                    className={`flex flex-row items-center justify-center w-25 h-15 border-2 rounded-lg  ${selectedMethod === "momo"
                                        ? "border-green-500 text-black bg-green-100"
                                        : "border-gray-300 text-black hover:border-green-500 hover:text-green-600 hover:bg-green-100"}`}
                                >
                                    <img src="/momo.png" alt="Momo" className="w-10 h-10 mr-2" />
                                    <span className="text-xs">Momo</span>
                                </button>
                                <button
                                    onClick={() => handleSelect("payos")}
                                    className={`flex flex-row items-center justify-center w-25 h-15 border-2 rounded-lg  ${selectedMethod === "payos"
                                        ? "border-green-500 text-black bg-green-100"
                                        : "border-gray-300 text-black hover:border-green-500 hover:text-green-600 hover:bg-green-100"}`}
                                >
                                    <img src="/payos.png" alt="PayOS" className="w-10 h-10 mr-2 border-1" />
                                    <span className="text-xs">PayOS</span>
                                </button>
                            </div>

                            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                Thanh toán {finalTotal.toLocaleString()} VND
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button className="px-6 py-2">
                    ← Quay lại
                </button>
            </div>
        </div>
    );
};

export default PaymentInfo;
