import React, { useEffect, useState } from "react";
import BookingStep from "@/app/booking/BookingStep";

const PaymentInfo = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);  // Set to true once component mounts on client
    }, []);

    const items = [
        {
            icon: "/icons/zone-a.svg",
            description: "Sân 1 (Zone A)",
            quantity: "01",
            duration: "01h",
            time: "16/11/24 08:00",
            unitPrice: 45000,
            total: 45000,
        },
        {
            icon: "/icons/shuttlecock.svg",
            description: "Ống cầu lông Taro xanh",
            quantity: "01",
            duration: "",
            time: "",
            unitPrice: 130000,
            total: 130000,
        },
        {
            icon: "/icons/shoes.svg",
            description: "Giày NIKE",
            quantity: "02",
            duration: "01h",
            time: "16/11/24 08:00",
            unitPrice: 60000,
            total: 60000,
        },
    ];

    const total = items.reduce((sum, item) => sum + item.total, 0);
    const discount = 0.1;
    const finalTotal = total * (1 - discount);

    if (!isClient) {
        return null;  // Ensure that no dynamic content is rendered before client
    }

    return (
        <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
            <BookingStep currentStep={3} />

            {/* Header */}
            <div className="flex justify-between items-center border-b pb-5 pt-5">
                <h2 className="text-xl font-semibold text-center w-full">
                    THÔNG TIN THANH TOÁN
                </h2>
            </div>

            {/* Order Info Section */}
            <div className="grid grid-cols-[0.7fr_1fr] text-center mt-4">
                <div className="bg-primary-50 p-4 rounded-lg rounded-br-none">
                    <h3 className="text-md font-semibold text-green-700 text-center">
                        THÔNG TIN ĐƠN HÀNG
                    </h3>
                </div>
                <div className="w-full flex justify-around items-baseline">
                    <div className="text-sm text-gray-700 flex flex-col items-center">
                        <p className="font-medium">Mã hóa đơn:</p>
                        <strong>#AB2324-01</strong>
                    </div>
                    <div className="text-sm text-gray-700 flex flex-col items-center">
                        <p className="font-medium">Mã nhân viên:</p>
                        <strong>#NV-QL-0001</strong>
                    </div>
                    <div className="text-sm text-gray-700 flex flex-col items-center">
                        <p className="font-medium">Ngày tạo:</p>
                        <strong>16/11/2024</strong>
                    </div>
                </div>
            </div>

            {/* Payment Table */}
            <div className="grid grid-cols-[0.7fr_1fr]">
                {/* Left table: Mô tả */}
                <div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-gray-300">
                            <tr className="text-gray-600">
                                <th className="px-4 py-2">Mô tả</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-gray-800">
                            {items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-200">
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        {item.icon && (
                                            <img
                                                src={item.icon}
                                                alt="icon"
                                                className="w-5 h-5 object-contain"
                                            />
                                        )}
                                        {item.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Right table: Các thông tin khác */}
                <div className="bg-primary-50 rounded-lg rounded-tl-none">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-gray-300">
                            <tr className="text-gray-600 text-center">
                                <th className="px-2 py-2">Số lượng</th>
                                <th className="px-2 py-2">Thời lượng</th>
                                <th className="px-2 py-2">Thời gian</th>
                                <th className="px-2 py-2 text-right">Đơn giá</th>
                                <th className="px-2 py-2 text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800">
                            {items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-200 text-center">
                                    <td className="px-2 py-2">{item.quantity}</td>
                                    <td className="px-2 py-2">{item.duration}</td>
                                    <td className="px-2 py-2">{item.time}</td>
                                    <td className="px-2 py-2 text-right">
                                        {item.unitPrice.toLocaleString()} đ
                                    </td>
                                    <td className="px-2 py-2 text-right">
                                        {item.total.toLocaleString()} đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="text-gray-800 text-right">
                            <tr>
                                <td colSpan={4} className="px-2 py-2 font-semibold text-right">
                                    Tổng tiền
                                </td>
                                <td className="px-2 py-2 text-right">
                                    {total.toLocaleString()} đ
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4} className="px-2 py-2 font-semibold text-right">
                                    S - Student
                                </td>
                                <td className="px-2 py-2 text-right text-red-600">- 10%</td>
                            </tr>
                            <tr className="font-bold text-black">
                                <td colSpan={4} className="px-2 py-2 text-right">
                                    Tổng cộng
                                </td>
                                <td className="px-2 py-2 text-right">
                                    {finalTotal.toLocaleString()} đ
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Customer Info and Payment Method Section */}
            <div className="mt-6 p-4 rounded-lg grid grid-cols-[0.7fr_1fr] gap-6">
                {/* Customer Info Section */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Thông tin khách hàng</h3>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Họ và tên</label>
                            <input
                                type="text"
                                className="p-2 mt-1 border border-gray-300 rounded-md text-gray-700"
                                value="Phạm Văn A"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                            <input
                                type="text"
                                className="p-2 mt-1 border border-gray-300 rounded-md text-gray-700"
                                value="0908123123"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="text"
                                className="p-2 mt-1 border border-gray-300 rounded-md text-gray-700"
                                value="phudeptrai2103@gmail.com"
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method Section */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Hình thức thanh toán</h3>
                    <div className="flex justify-center gap-6 mb-6">
                        <button className="flex flex-col items-center justify-center w-24 h-24 border-2 text-black rounded-lg">
                            <img src="/momo.png" alt="Momo" className="w-15 h-15 mb-2" />
                            <span className="text-xs">Momo</span>
                        </button>
                        <button className="flex flex-col items-center justify-center w-24 h-24 border-2 text-black rounded-lg">
                            <img src="/payos.png" alt="PayOS" className="w-15 h-15 mb-2" />
                            <span className="text-xs">PayOS</span>
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <button className="px-6 py-2 bg-green-500 text-white rounded-lg">
                            Thanh toán {finalTotal.toLocaleString()} VND
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-6">
                <button className="px-6 py-2">
                    ← Quay lại
                </button>
            </div>
        </div>
    );
};

export default PaymentInfo;
