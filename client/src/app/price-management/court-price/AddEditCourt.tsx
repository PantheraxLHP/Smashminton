'use client';

import React, { useRef, useEffect, useState } from "react";
import { Service } from "../type";

interface ServiceModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: Service) => void;
    editData?: Service | null;
}

function normalizeTimeString(time: string) {
    const [hour, minute] = time.split(":").map(Number);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hour)}:${pad(minute)}`;
}

function formatPrice(price: string): string {
    const number = Number(price.replace(/\D/g, ""));
    return new Intl.NumberFormat("vi-VN").format(number) + " VND";
}

export default function ServiceModal({ open, onClose, onSubmit, editData }: ServiceModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    
    const [formData, setFormData] = useState<Service>({
        name: "",
        price: "",
        type: "",
        product: "",
        startTime: "06:00",
        endTime: "21:30",
        image: "",
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                ...editData,
                price: editData.price.replace(/[^\d]/g, ""), // loại bỏ dấu và VND
                startTime: normalizeTimeString(editData.startTime),
                endTime: normalizeTimeString(editData.endTime),
                image: editData.image || "", // tránh lỗi src=""
            });
        } else {
            setFormData({
                name: "",
                price: "",
                type: "",
                product: "",
                startTime: "06:00",
                endTime: "21:30",
                image: "",
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
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onClose]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit() {
        if (onSubmit) {
            onSubmit({
                ...formData,
                price: formatPrice(formData.price),
                startTime: normalizeTimeString(formData.startTime),
                endTime: normalizeTimeString(formData.endTime),
                image: formData.image || "", // luôn gán rỗng để tránh warning
            });
        }
        onClose();
    }

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-40"></div>

            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div
                    ref={modalRef}
                    className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg"
                >
                    <h2 className="text-lg font-semibold mb-4">
                        {editData ? "Sửa giá sân" : "Thêm sân"}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm mb-1">Tên sân</label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Giá thuê theo giờ</label>
                            <input
                                name="price"
                                type="text"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Loại</label>
                            <input
                                name="type"
                                type="text"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Sản phẩm áp dụng</label>
                            <select
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Chọn sản phẩm</option>
                                <option value="Zone A">Zone A</option>
                                <option value="Zone B">Zone B</option>
                                <option value="Atlas">Atlas</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Giờ bắt đầu</label>
                            <input
                                name="startTime"
                                type="time"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Giờ kết thúc</label>
                            <input
                                name="endTime"
                                type="time"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="border border-gray-400 text-black px-4 py-2 rounded hover:bg-gray-100"
                        >
                            Thoát
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="border border-primary-600 text-primary-600 px-4 py-2 rounded hover:bg-primary-100"
                        >
                            {editData ? "Lưu thay đổi" : "Tạo"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
