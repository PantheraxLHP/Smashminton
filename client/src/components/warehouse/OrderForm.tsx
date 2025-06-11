'use client';

import { useEffect, useState } from 'react';

export interface BaseItem {
    name: string;
    costprice: number;
  }

interface OrderFormData {
    productName: string;
    productPrice: string;
    supplier: string;
    quantity: number;
}

interface PurchaseOrderFormProps<T extends BaseItem> {
    open: boolean;
    onClose: () => void;
    item?: T;
}

const suppliers = ['Nhà cung cấp A', 'Nhà cung cấp B', 'Nhà cung cấp C'];

export default function PurchaseOrderForm<T extends BaseItem>({
    open,
    onClose,
    item,
}: PurchaseOrderFormProps<T>) {
    const [formData, setFormData] = useState<OrderFormData>({
        productName: '',
        productPrice: '',
        supplier: '',
        quantity: 0,
    });

    useEffect(() => {
        if (item) {
            setFormData((prev) => ({
                ...prev,
                productName: item.name || '',
                productPrice: item.costprice.toString() || '',
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                productName: '',
                productPrice: '',
            }));
        }
    }, [item]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'quantity' ? Number(value) : value,
        }));
    };

    const handleSubmit = () => {
        console.log('Dữ liệu phiếu đặt hàng:', formData);
        onClose();
    };

    const handleExit = () => {
        console.log('Thoát khỏi phiếu đặt hàng');
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-center mb-6">
                    Phiếu đặt hàng
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên hàng</label>
                        <input
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            readOnly
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Giá nhập</label>
                        <input
                            name="productPrice"
                            value={formData.productPrice}
                            onChange={handleChange}
                            readOnly
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nhà cung cấp</label>
                        <select
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Chọn nhà cung cấp</option>
                            {suppliers.map((s, i) => (
                                <option key={i} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Số lượng</label>
                        <input
                            name="quantity"
                            type="number"
                            value={formData.quantity || ''}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Nhập số lượng"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={handleExit}
                        className="px-4 py-2 rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
                    >
                        Thoát
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
                    >
                        Tạo
                    </button>
                </div>
            </div>
        </div>
    );
}
