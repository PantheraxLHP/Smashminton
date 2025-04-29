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

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Họ và tên", key: "fullName" },
                    { label: "Số điện thoại", key: "phone" },
                    { label: "Email", key: "email" },
                ].map((item) => (
                    <div className="flex flex-col w-full" key={item.key}>
                        <label className="text-sm font-medium text-gray-600">{item.label}</label>
                        <input
                            type="text"
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md text-gray-700"
                            value={customerInfo[item.key as keyof typeof customerInfo]}
                            disabled
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerInfo;
