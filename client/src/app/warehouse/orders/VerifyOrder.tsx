'use client';

import { useRef, useEffect, useState } from 'react';
import { PurchaseOrder } from './page';
import { verifyOrderSchema } from "../warehouse.schema";
import { z } from 'zod';
import { updatePurchaseOrder, createPurchaseOrder } from '@/services/purchaseorder.service';
import { toast } from 'sonner';


interface VerifyOrderModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: PurchaseOrder) => void;
    orderData?: PurchaseOrder | null;
}

interface VerifyOrderFormData extends PurchaseOrder {
    receivedQuantity: number;
    expiryDate: string;
}


export default function VerifyOrderModal({
    open,
    onClose,
    onSubmit,
    orderData,
}: VerifyOrderModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<VerifyOrderFormData>({
        orderid: 0,
        productid: 0,
        productname: '',
        supplierid: 0,
        suppliername: '',
        batchid: '',
        employeeid: 0,
        price: 0,
        quantity: 0,
        deliverydate: '',
        status: '',
        receivedQuantity: 0,
        expiryDate: '',
    });

    useEffect(() => {
        if (open && orderData) {
            setFormData((prev) => ({
                ...prev,
                ...orderData,
            }));
        }
    }, [open, orderData]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, onClose]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        if (name === "receivedQuantity" || name === "price") {
            const numericValue = Number(value);
            setFormData(prev => ({ ...prev, [name]: isNaN(numericValue) ? 0 : numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }


    const handleSubmit = async () => {
        if (!orderData) return;

        try {
            verifyOrderSchema.parse({
                receivedQuantity: Number(formData.receivedQuantity),
                expiryDate: formData.expiryDate,
            });
            
            setErrors({});

            const received = formData.receivedQuantity;
            const ordered = formData.quantity;

            // Gọi API xác nhận đơn hàng chính
            const updateRes = await updatePurchaseOrder(formData.orderid, {
                realityQuantity: received,
                realityExpiryDate: formData.expiryDate,
            });

            if (!updateRes.ok) {
                toast.error(updateRes.message || 'Xác nhận đơn hàng thất bại');
                return;
            }

            // Nếu giao thiếu => tạo đơn mới
            if (received < ordered) {
                const remaining = ordered - received;

                const createRes = await createPurchaseOrder({
                    productid: formData.productid,
                    productname: formData.productname,
                    employeeid: formData.employeeid,
                    supplierid: formData.supplierid,
                    quantity: remaining,
                });

                if (!createRes.ok) {
                    toast.error(createRes.message || 'Tạo đơn hàng mới thất bại');
                    return;
                }

                toast.success('Xác nhận đơn hàng thành công');
            } else {
                toast.success('Xác nhận đơn hàng thành công');
            }

            onSubmit({
                ...orderData,
                quantity: received,
                deliverydate: new Date().toISOString().split('T')[0],
                status: 'Đã nhận hàng',
            });

            onClose();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: any = {};
                error.errors.forEach((err) => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
            } else {
                toast.error('Có lỗi xảy ra khi xác nhận đơn hàng');
            }
        }
    };
    

    useEffect(() => {
        if (!open) {
            setErrors({});
        }
    }, [open]);

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>

            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    ref={modalRef}
                    className="bg-white rounded-xl p-6 w-full max-w-4xl border border-gray-300 shadow-xl"
                >
                    <h2 className="text-lg font-semibold mb-6">
                        Xác nhận đơn hàng
                    </h2>

                    <div >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 border-b border-black pb-4">
                            <div>
                                <label className="block text-sm mb-1">Mã đơn hàng</label>
                                <input
                                    name="orderid"
                                    value={formData.orderid}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 bg-gray-100"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Ngày nhập hàng</label>
                                <input
                                    name="deliverydate"
                                    value={new Date().toISOString().split('T')[0]}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 bg-gray-100"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Nhà cung cấp</label>
                                <input
                                    name="suppliername"
                                    value={formData.suppliername}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 bg-gray-100"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Tên sản phẩm</label>
                                <input
                                    name="productname"
                                    value={formData.productname}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 bg-gray-100"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Đơn giá</label>
                                <input
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 bg-gray-100"
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Số lượng đặt</label>
                                <input
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 bg-gray-100"
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm mb-1">Số lượng giao</label>
                                <input
                                    name="receivedQuantity"
                                    type="number"
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder='Nhập số lượng giao'
                                />
                                {errors.receivedQuantity && <p className="text-red-500 text-sm">{errors.receivedQuantity}</p>}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Ngày hết hạn</label>
                                <input
                                    name="expiryDate"
                                    type="date"
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded border border-gray-500 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                            Thoát
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded border text-primary-600 border-primary-600 hover:bg-primary-500 hover:text-white cursor-pointer"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
