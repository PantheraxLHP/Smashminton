'use client';

import React, { useRef, useEffect, useState } from "react";
import { postZones } from "@/services/zones.service";
import { toast } from 'sonner';
import { Zone } from './page';

interface ZoneModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onSubmit: (newZone: Zone) => void;
}

export default function AddZoneModal({ open, onClose, onSubmit, onSuccess }: ZoneModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [zoneImages, setZoneImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [zonename, setZonename] = useState("");
    const [zonetype, setZonetype] = useState("");
    const [zonedescription, setZonedescription] = useState("");
    const [zoneimgurl, setZoneimgurl] = useState("");

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setZonename("");
            setZonetype("");
            setZonedescription("");
            setZoneimgurl("");
            setZoneImages([]);
            setMessage("");
        }
    }, [open]);

    // Handle outside click to close modal
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

    const handleZoneImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            setZoneImages((prev) => [...prev, ...newFiles]);
            setZoneimgurl(URL.createObjectURL(newFiles[0]));
        }
    };

    const handleRemoveZoneImage = (index: number) => {
        const updated = zoneImages.filter((_, i) => i !== index);
        setZoneImages(updated);
        if (index === 0 && updated.length > 0) {
            setZoneimgurl(URL.createObjectURL(updated[0]));
        } else if (updated.length === 0) {
            setZoneimgurl("");
        }
    };

    const handleSubmit = async () => {
        if (!zonename || !zonetype) {
            setMessage("Vui lòng điền đủ tên và loại zone.");
            return;
        }

        setLoading(true);
        setMessage("");

        const newZone: Zone = {
            zonename,
            type: zonetype,
            description: zonedescription,
            image: zoneimgurl,
        };

        try {
            const response = await postZones(newZone);
            if (response.ok) {
                toast.success("Thêm zone thành công");
                onSuccess();
                onSubmit(newZone);
            } else {
                toast.error(response.message || "Thêm zone thất bại");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };
    

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-40"></div>
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div
                    ref={modalRef}
                    className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative"
                >
                    <h2 className="text-lg font-semibold mb-4">Thêm Zone</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-black">Ảnh Zone</label>
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
                            <label className="block text-sm mb-1">Tên Zone</label>
                            <input
                                name="zonename"
                                type="text"
                                value={zonename}
                                onChange={(e) => setZonename(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Loại Zone</label>
                            <select
                                name="zonetype"
                                value={zonetype}
                                onChange={(e) => setZonetype(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">Chọn loại Zone</option>
                                <option value="Normal">Normal</option>
                                <option value="AirConditioner">Air Conditioner</option>
                                <option value="Private">Private</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Mô tả</label>
                            <input
                                name="zonedescription"
                                type="text"
                                value={zonedescription}
                                onChange={(e) => setZonedescription(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    {message && <p className="text-sm text-center text-red-500 mb-4">{message}</p>}

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="border border-gray-400 text-black px-4 py-2 rounded hover:bg-gray-100"
                        >
                            Thoát
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="border border-primary-600 text-primary-600 px-4 py-2 rounded hover:bg-primary-100"
                        >
                            {loading ? "Đang tạo..." : "Tạo"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
