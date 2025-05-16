'use client';

import React, { useRef, useEffect } from "react";

interface ServiceModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
}

export default function ServiceModal({ open, onClose, onSubmit }: ServiceModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Đóng popup khi click ra ngoài
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

    if (!open) return null;

    return (
        <>
            {/* Background mờ nhẹ */}
            <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-40"></div>

            {/* Modal chính */}
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div
                    ref={modalRef}
                    className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg"
                >
                    <h2 className="text-lg font-semibold mb-4">Thêm dịch vụ</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm mb-1">Tên dịch vụ</label>
                            <input type="text" className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Giá thuê theo giờ</label>
                            <input type="text" className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Loại</label>
                            <select className="w-full border rounded px-3 py-2">
                                <option>Chọn loại</option>
                                <option>Thuê sân</option>
                                <option>Thuê vợt</option>
                                <option>Thuê giày</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Sản phẩm áp dụng</label>
                            <select className="w-full border rounded px-3 py-2">
                                <option>Chọn sản phẩm</option>
                                <option>Zone A</option>
                                <option>Zone B</option>
                                <option>Atlas</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Giờ bắt đầu</label>
                            <input type="time" defaultValue="06:00" className="w-full border rounded px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Giờ kết thúc</label>
                            <input type="time" defaultValue="21:30" className="w-full border rounded px-3 py-2" />
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
                            onClick={onSubmit}
                            className="border border-primary-600 text-primary-600 px-4 py-2 rounded hover:bg-primary-100"
                        >
                            Tạo
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
