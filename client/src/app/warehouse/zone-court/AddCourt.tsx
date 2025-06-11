'use client';

import React, { useRef, useEffect, useState } from "react";
import { Court } from "./page";
import { getZones } from "@/services/zones.service";

interface CourtModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: Court) => void;
}

export default function AddCourtModal({
    open,
    onClose,
    onSubmit,
}: CourtModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [zoneImages, setZoneImages] = useState<File[]>([]);

    function handleZoneImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setZoneImages((prev) => [...prev, ...newFiles]);
        }
    }

    function handleRemoveZoneImage(index: number) {
        setZoneImages((prev) => prev.filter((_, i) => i !== index));
    }

    const [formData, setFormData] = useState<Court>({
        courtname: "",
        image: "",
        status: "Đang hoạt động",
        avgrating: 0,
        timecalavg: "2025-06-04",
        zonename: "",
    });

    useEffect(() => {
        if (!open) {
            setZoneImages([]);
            return;
        } else {
            setFormData({
                courtname: "",
                image: "",
                status: "Đang hoạt động",
                avgrating: 0,
                timecalavg: "2025-06-04",
                zonename: "",
            });
        }
    }, [open]);
    

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            // Kiểm tra nếu click ngoài modal
            if (
                modalRef.current && !modalRef.current.contains(target)
            ) {
                onClose();
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit() {
        if (onSubmit) {
            onSubmit({
                ...formData,
                image: zoneImages[0] ? URL.createObjectURL(zoneImages[0]) : "/default.png",
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
                    className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative"
                >
                    <h2 className="text-lg font-semibold mb-4">
                        Thêm Sân
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-black">
                                Ảnh sân
                            </label>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleZoneImageChange}
                                    className="hidden"
                                    id="zone-upload-file"
                                    multiple
                                />
                                <label
                                    htmlFor="zone-upload-file"
                                    className="cursor-pointer rounded-md border border-gray-300 bg-gray-300 px-4 py-2 hover:bg-gray-100 hover:text-black"
                                >
                                    📂 Chọn ảnh
                                </label>

                                {zoneImages.length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {zoneImages.map((file, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`Zone Image ${index + 1}`}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-md border border-gray-300 object-contain"
                                                />
                                                <button
                                                    onClick={() => handleRemoveZoneImage(index)}
                                                    className="mt-1 rounded-md px-2 text-red-500 transition hover:bg-red-500 hover:text-white"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Tên sân</label>
                            <input
                                name="courtname"
                                type="text"
                                value={formData.courtname || ""}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Zone chứa sân</label>
                            <div className="relative">
                                <select
                                    name="zoneid"
                                    value={formData.zonename}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            zoneid: Number(e.target.value),
                                        }))
                                    }
                                    className={`w-full border rounded px-3 py-2`}
                                >
                                    <option value="">Chọn Zone</option>
                                    <option value="1">Zone A</option>
                                    <option value="2">Zone B</option>
                                    <option value="3">Zone C</option>
                                </select>

                            </div>
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
                            Tạo
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
