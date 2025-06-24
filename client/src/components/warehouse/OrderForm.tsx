'use client';

import { useEffect, useState } from 'react';
import { findSupplier } from '@/services/products.service';
import { useAuth } from '@/context/AuthContext';
import { createPurchaseOrder } from '@/services/purchaseorder.service';
import { toast } from 'sonner';

interface OrderFormData {
    productid: number;
    productname: string;
    costprice?: number;
    supplierid?: number;
    suppliername?: string;
    quantity?: number;
}

interface PurchaseOrderFormProps<T extends OrderFormData> {
    open: boolean;
    onClose: () => void;
    item?: T;
}

export default function PurchaseOrderForm<T extends OrderFormData>({
    open,
    onClose,
    item,
}: PurchaseOrderFormProps<T>) {
    const { user } = useAuth(); // 👈 lấy user từ context
    const [supplierList, setSupplierList] = useState<
        { supplierid: number; suppliername: string; costprice: number }[]
    >([]);
    const [formData, setFormData] = useState<OrderFormData>({
        productid: 0,
        productname: '',
        costprice: 0,
        supplierid: 0,
        suppliername: '',
        quantity: 0,
    });

    useEffect(() => {
        if (item) {
            setFormData({
                productid: item.productid,
                productname: item.productname || '',
                costprice: item.costprice || 0,
                quantity: item.quantity || 0,
                supplierid: undefined,
                suppliername: '',
            });

            findSupplier(item.productid).then((res) => {
                if (res.ok && Array.isArray(res.data)) {
                    const suppliers = res.data.map((s: any) => ({
                        supplierid: s.supplierid,
                        suppliername: s.suppliername,
                        costprice: parseInt(s.costprice),
                    }));
                    setSupplierList(suppliers);
                } else {
                    setSupplierList([]);
                    console.error('Không tìm thấy nhà cung cấp:', res.message);
                }
            });
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

    const handleSubmit = async () => {
        if (!formData.supplierid || !formData.quantity || !user?.accountid) {
            toast.error('Vui lòng chọn nhà cung cấp và nhập số lượng hợp lệ.');
            return;
        }

        const payload = {
            productid: formData.productid,
            productname: formData.productname,
            employeeid: user.accountid,
            supplierid: formData.supplierid,
            quantity: formData.quantity,
        };

        const res = await createPurchaseOrder(payload);

        if (res.ok) {
            toast.success('Đơn đặt hàng đã được tạo thành công.');
            onClose();
        } else {
            toast.error(`Lỗi: ${res.message}`);
        }
    };

    const handleExit = () => {
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-center mb-6">Phiếu đặt hàng</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên hàng</label>
                        <input
                            name="productname"
                            value={formData.productname}
                            readOnly
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Giá nhập</label>
                        <input
                            name="costprice"
                            value={formData.costprice}
                            readOnly
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nhà cung cấp</label>
                        <select
                            name="supplierid"
                            value={formData.supplierid ?? ''}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const selectedSupplier = supplierList.find(
                                    (s) => s.supplierid === selectedId
                                );
                                if (selectedSupplier) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        supplierid: selectedSupplier.supplierid,
                                        suppliername: selectedSupplier.suppliername,
                                        costprice: selectedSupplier.costprice,
                                    }));
                                }
                            }}
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Chọn nhà cung cấp</option>
                            {supplierList.map((s) => (
                                <option key={s.supplierid} value={s.supplierid}>
                                    {`${s.suppliername} - ${s.costprice.toLocaleString('vi-VN')} VND`}
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
                            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                        className="px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition"
                    >
                        Tạo
                    </button>
                </div>
            </div>
        </div>
    );
}
