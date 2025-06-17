'use client';

import React, { useRef, useEffect, useState } from "react";
import { Service } from "./page";
import { getRentalFilters } from "@/services/products.service";


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
    const [filterData, setFilterData] = useState<any[]>([]);
    const [availableValues, setAvailableValues] = useState<string[]>([]);    
    const [formData, setFormData] = useState<Service>({
        productname: "",
        price: "",
        servicetype: "",
        image: "",
        quantity: 0,
    });

    const [shoeSize, setShoeSize] = useState<string>("");
    const [racketWeight, setRacketWeight] = useState<string>("");

    useEffect(() => {
        if (editData) {
            setFormData({
                ...editData,
                price: editData.price.replace(/[^\d]/g, ""),
                image: editData.image || "",
            });
        } else {
            setFormData({
                productname: "",
                price: "",
                servicetype: "",
                image: "",
                quantity: 0,
            });
            setShoeSize("");
            setRacketWeight("");
        }
    }, [editData, open]);

    useEffect(() => {
        async function fetchFilters() {
            try {
                const response = await getRentalFilters();
                if (response.ok && Array.isArray(response.data)) {
                    setFilterData(response.data);
                } else {
                    console.error("Dữ liệu filters không hợp lệ:", response);
                    setFilterData([]);
                }

            } catch (error) {
                console.error("Lỗi khi lấy filter:", error);
            }
        }
        fetchFilters();
    }, []);

    useEffect(() => {
        const selectedTypeId = formData.servicetype === "Thuê vợt" ? 3 : formData.servicetype === "Thuê giày" ? 4 : null;

        if (selectedTypeId) {
            const typeData = filterData.find(f => f.producttypeid === selectedTypeId);
            if (typeData && typeData.product_filter.length > 0) {
                const values = typeData.product_filter[0].product_filter_values.map(
                    (v: { value: string }) => v.value
                );
                
                setAvailableValues(values);
            } else {
                setAvailableValues([]);
            }
        } else {
            setAvailableValues([]);
        }
    }, [formData.servicetype, filterData]);
    


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
            const extendedData: any = {
                ...formData,
                price: formatPrice(formData.price),
                image: formData.image || "",
            };

            if (formData.servicetype === "Thuê giày") {
                extendedData.size = shoeSize;
            } else if (formData.servicetype === "Thuê vợt") {
                extendedData.weight = racketWeight;
            }

            onSubmit(extendedData);
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
                        {editData ? "Sửa dịch vụ" : "Thêm giày, vợt mới"}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm mb-1">Tên dịch vụ</label>
                            <input
                                name="productname"
                                type="text"
                                value={formData.productname}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Giá thuê</label>
                            <input
                                name="price"
                                type="text"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Dịch vụ áp dụng</label>
                            <select
                                name="servicetype"
                                value={formData.servicetype}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Chọn dịch vụ</option>
                                <option value="Thuê giày">Thuê giày</option>
                                <option value="Thuê vợt">Thuê vợt</option>
                            </select>
                        </div>

                        {formData.servicetype === "Thuê giày" && (
                            <div>
                                <label className="block text-sm mb-1">Kích cỡ giày</label>
                                <select
                                    value={shoeSize}
                                    onChange={e => setShoeSize(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Chọn kích cỡ</option>
                                    {availableValues.map((value, index) => (
                                        <option key={index} value={value}>{value}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {formData.servicetype === "Thuê vợt" && (
                            <div>
                                <label className="block text-sm mb-1">Trọng lượng vợt</label>
                                <select
                                    value={racketWeight}
                                    onChange={e => setRacketWeight(e.target.value)}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Chọn trọng lượng</option>
                                    {availableValues.map((value, index) => (
                                        <option key={index} value={value}>{value}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {editData && (
                            <div>
                                <label className="block text-sm mb-1">Số lượng</label>
                                <input
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        )}
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
