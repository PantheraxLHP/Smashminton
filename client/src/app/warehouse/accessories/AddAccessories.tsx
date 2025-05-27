'use client';

import React, { useRef, useEffect, useState } from 'react';

export interface AccessoryFormData {
    name: string;
    price: string;
    category: string;
    brand: string;
    distributor: string;
    stock: string;
}

interface AccessoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: AccessoryFormData) => void;
    editData?: AccessoryFormData | null;
}

export default function AccessoryModal({ open, onClose, onSubmit, editData }: AccessoryModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<AccessoryFormData>({
        name: '',
        price: '',
        category: '',
        brand: '',
        distributor: '',
        stock: '',
    });

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({
                name: '',
                price: '',
                category: '',
                brand: '',
                distributor: '',
                stock: '',
            });
        }
    }, [editData, open]);

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
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit() {
        if (onSubmit) {
            onSubmit(formData);
        }
        onClose();
    }

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>

            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    ref={modalRef}
                    className="bg-white rounded-xl p-6 w-full max-w-xl border border-gray-300 shadow-xl"
                >
                    <h2 className="text-lg font-semibold mb-6">Thêm hàng hoá</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm mb-1">Tên hàng hoá</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Giá</label>
                            <input
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Loại</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Chọn loại</option>
                                <option value="Quả cầu lông">Quả cầu lông</option>
                                <option value="Quấn cán">Quấn cán</option>
                                <option value="Phụ kiện khác">Phụ kiện khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Thương hiệu</label>
                            <select
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Chọn thương hiệu</option>
                                <option value="Yonex">Yonex</option>
                                <option value="Lining">Lining</option>
                                <option value="Victor">Victor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Nhà phân phối</label>
                            <select
                                name="distributor"
                                value={formData.distributor}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Chọn nhà phân phối</option>
                                <option value="VNB">VNB</option>
                                <option value="Đại Hưng">Đại Hưng</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Tồn kho</label>
                            <input
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded border border-gray-500 text-gray-700 hover:bg-gray-100"
                        >
                            Thoát
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded border text-green-600 border-green-600 hover:bg-green-50"
                        >
                            {editData ? 'Lưu' : 'Tạo'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
