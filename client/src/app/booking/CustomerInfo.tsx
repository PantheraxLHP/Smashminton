import React from "react";

interface CustomerInfoProps {
    customerInfo: {
        fullName: string;
        phone: string;
        email: string;
    };
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customerInfo }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mt-4">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 gap-4 mt-4">
                {["Họ và tên", "Số điện thoại", "Email"].map((label, index) => {
                    const key = ["fullName", "phone", "email"][index] as keyof typeof customerInfo;
                    return (
                        <div className="flex flex-col" key={label}>
                            <label className="text-sm font-medium text-gray-600">{label}</label>
                            <input
                                type="text"
                                className="p-2 mt-1 border border-gray-300 rounded-md text-gray-700"
                                value={customerInfo[key]}
                                disabled
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomerInfo;
