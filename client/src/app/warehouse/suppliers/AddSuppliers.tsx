'use client';

import { useRef, useEffect, useState } from 'react';

export interface SupplierFormData {
    name: string;
    phone: string;
    email: string;
    address: string;
}

interface AddSupplierModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: SupplierFormData) => void;
    editData?: SupplierFormData | null;
}

export default function AddSupplierModal({
    open,
    onClose,
    onSubmit,
    editData,
}: AddSupplierModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<SupplierFormData>({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        } else {
            setFormData({
                name: '',
                phone: '',
                email: '',
                address: '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>

            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    ref={modalRef}
                    className="bg-white rounded-xl p-6 w-full max-w-md border border-gray-300 shadow-xl"
                >
                    <h2 className="text-lg font-semibold mb-6">
                        {editData ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm mb-1">Tên nhà cung cấp</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Số điện thoại</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-1">Địa chỉ</label>
                            <input
                                name="address"
                                value={formData.address}
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
                            {editData ? 'Lưu thay đổi' : 'Tạo'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
