'use client';

import React, { useEffect, useState } from 'react';
import CustomerInfo from './CustomerInfo';
import PaymentMethod from './PaymentMethod';
import { Icon } from '@iconify/react';

type PaymentMethodType = 'momo' | 'payos' | null;

interface Item {
    icon: string;
    description: string;
    quantity: string;
    duration: string;
    time: string;
    unitPrice: number;
    total: number;
    productid: number;
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
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [items, setItems] = useState<Item[]>(paymentData.items);

    const handleSelect = (method: PaymentMethodType) => {
        setSelectedMethod((prev) => (prev === method ? null : method));
    };

    const handleIncrement = (id: number) => {
        setQuantities((prev) => {
            const newQty = prev[id] + 1;
            updateItemTotal(id, newQty);
            return { ...prev, [id]: newQty };
        });
    };

    const handleDecrement = (id: number) => {
        setQuantities((prev) => {
            const newQty = Math.max(1, prev[id] - 1);
            updateItemTotal(id, newQty);
            return { ...prev, [id]: newQty };
        });
    };

    const updateItemTotal = (id: number, newQty: number) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.productid === id
                    ? {
                        ...item,
                        quantity: newQty.toString(),
                        total: newQty * item.unitPrice,
                    }
                    : item
            )
        );
    };

    const total = items.reduce((sum, item) => sum + item.total, 0);
    const finalTotal = total * (1 - paymentData.discount);


    useEffect(() => {
        setSelectedMethod(paymentData.selectedMethod);
    }, [paymentData.selectedMethod]);

    useEffect(() => {
        const initialQuantities = paymentData.items.reduce((acc, item) => {
            acc[item.productid] = parseInt(item.quantity) || 1;
            return acc;
        }, {} as { [key: number]: number });
        setQuantities(initialQuantities);
    }, [paymentData]);

    return (
        <div className="mx-auto w-full rounded-lg bg-white p-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pt-5 pb-5">
                <h2 className="w-full text-center text-xl font-semibold">THÔNG TIN THANH TOÁN</h2>
            </div>

            {/* Order Info - Desktop */}
            <div className="mt-4 hidden grid-cols-[0.7fr_1fr] text-center md:grid">
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

            {/* Order Info - Mobile/Tablet */}
            <div className="bg-primary-50 mt-4 flex flex-col gap-2 rounded-lg p-4 md:hidden">
                <h3 className="text-md mb-2 text-center font-semibold text-green-700">THÔNG TIN ĐƠN HÀNG</h3>
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
            <div className="hidden grid-cols-[0.7fr_1fr] md:grid">
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
                            {items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-200 text-center">
                                    <td className="px-2 py-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                className="group bg-gray-50 hover:bg-primary flex h-5 w-5 cursor-pointer items-center justify-center rounded"
                                                onClick={() => handleDecrement(item.productid)}
                                            >
                                                <Icon icon="ic:baseline-minus" className="text-lg text-gray-500 group-hover:text-white" />
                                            </button>
                                            <span>{quantities[item.productid]}</span>
                                            <button
                                                className="group bg-gray-50 hover:bg-primary flex h-5 w-5 cursor-pointer items-center justify-center rounded"
                                                onClick={() => handleIncrement(item.productid)}
                                            >
                                                <Icon icon="ic:baseline-plus" className="text-lg text-gray-500 group-hover:text-white" />
                                            </button>
                                        </div>
                                    </td>

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

            {/* Payment Table - Mobile/Tablet */}
            <div className="mt-4 flex flex-col gap-4 md:hidden">
                {items.map((item, idx) => (
                    <div key={idx} className="rounded-lg border bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                            {item.icon && <img src={item.icon} alt="icon" className="h-5 w-5 object-contain" />}
                            <span className="font-medium text-gray-800">{item.description}</span>
                        </div>
                        <div className="flex flex-wrap text-sm text-gray-600">
                            <div className="mb-1 w-1/2">
                                <strong>Số lượng:</strong>
                                <div className="mt-1 flex items-center gap-2">
                                    <button
                                        className="group bg-gray-50 hover:bg-primary flex h-5 w-5 items-center justify-center rounded"
                                        onClick={() => handleDecrement(item.productid)}
                                    >
                                        <Icon icon="ic:baseline-minus" className="text-lg text-gray-500 group-hover:text-white" />
                                    </button>
                                    <span>{quantities[item.productid]}</span>
                                    <button
                                        className="group bg-gray-50 hover:bg-primary flex h-5 w-5 items-center justify-center rounded"
                                        onClick={() => handleIncrement(item.productid)}
                                    >
                                        <Icon icon="ic:baseline-plus" className="text-lg text-gray-500 group-hover:text-white" />
                                    </button>
                                </div>
                            </div>
                            <div className="mb-1 w-1/2">
                                <strong>Thời gian:</strong> {item.time}
                            </div>
                            <div className="mb-1 w-1/2">
                                <strong>Thời lượng:</strong> {item.duration}
                            </div>
                            <div className="mb-1 w-1/2">
                                <strong>Đơn giá:</strong> {item.unitPrice.toLocaleString()} đ
                            </div>
                            <div className="mt-1 w-full">
                                <strong>Thành tiền:</strong> {item.total.toLocaleString()} đ
                            </div>
                        </div>
                    </div>
                ))}

                {/* Tổng cộng - Mobile/Tablet */}
                <div className="bg-primary-50 mt-4 rounded-lg p-4 text-sm md:hidden">
                    <p className="text-left font-semibold">Tổng tiền: {total.toLocaleString()} đ</p>
                    <p className="text-left font-semibold text-red-600">S - Student: -10%</p>
                    <p className="text-left text-lg font-bold text-black">Tổng cộng: {finalTotal.toLocaleString()} đ</p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 rounded-lg border-t p-4 lg:grid-cols-[0.7fr_1fr]">
                <CustomerInfo customerInfo={paymentData.customerInfo} />
                <PaymentMethod selectedMethod={selectedMethod} onSelect={handleSelect} finalTotal={finalTotal} />
            </div>
        </div>
    );
};

export default PaymentInfo;
