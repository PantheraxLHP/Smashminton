'use client';

import React, { useRef, useEffect, useState } from "react";
import { postZones } from "@/services/zones.service";
import { toast } from 'sonner';
import { FaPen } from "react-icons/fa";
import { Zone } from './page';
import { zoneSchema } from "../warehouse.schema";
import { z } from "zod";

interface ZoneModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onSubmit: (newZone: Zone) => void;
}

export default function AddZoneModal({ open, onClose, onSubmit, onSuccess }: ZoneModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState({
        zonename: "",
        zonetype: "",
        zonedescription: "",
        zoneAvatar: null as File | null,
        zonePreview: ""
    });

    useEffect(() => {
        if (open) {
            setFormData({
                zonename: "",
                zonetype: "",
                zonedescription: "",
                zoneAvatar: null,
                zonePreview: ""
            });
            setMessage("");
        }
    }, [open]);

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
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                zoneAvatar: file,
                zonePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async () => {
        setErrors({});
        try {
            zoneSchema.parse({
                ...formData,
            });

            if (!formData.zonename || !formData.zonetype) {
                setMessage("Vui lòng điền đủ tên và loại zone.");
                return;
            }

            setLoading(true);
            setMessage("");

            const fd = new FormData();
            fd.append("zonename", formData.zonename);
            fd.append("zonetype", formData.zonetype);
            fd.append("zonedescription", formData.zonedescription);
            if (formData.zoneAvatar) {
                fd.append("image", formData.zoneAvatar);
            }

            try {
                const response = await postZones(fd);
                if (response.ok) {
                    toast.success("Thêm zone thành công");
                    onSuccess();
                    onSubmit({
                        zonename: formData.zonename,
                        type: formData.zonetype,
                        description: formData.zonedescription,
                        image: response.data?.imageUrl || "",
                    });
                } else {
                    toast.error(response.message || "Thêm zone thất bại");
                }
            } catch (error) {
                toast.error("Có lỗi xảy ra");
            } finally {
                setLoading(false);
                setErrors({});
                onClose();
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: any = {};
                error.errors.forEach((err) => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
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
            <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-40"></div>
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div
                    ref={modalRef}
                    className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg relative"
                >
                    <h2 className="text-lg font-semibold mb-4">Thêm Zone</h2>

                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative w-24 h-24">
                                {formData.zonePreview ? (
                                    <img
                                        src={formData.zonePreview}
                                        alt="Zone Preview"
                                        className="w-24 h-24 rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 border flex items-center justify-center text-gray-500 text-xl">
                                        📷
                                    </div>
                                )}
                                <label htmlFor="zone-upload-file">
                                    <div className="absolute bottom-0 right-0 p-1 bg-gray-200 rounded-full border hover:bg-gray-300 cursor-pointer">
                                        <FaPen size={14} />
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleZoneImageChange}
                                    className="hidden"
                                    id="zone-upload-file"
                                />
                            </div>
                            <p className="text-sm text-gray-500">Ảnh Zone</p>
                        </div>

                        <div className="flex-1 grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Tên Zone</label>
                                <input
                                    type="text"
                                    value={formData.zonename}
                                    onChange={(e) => setFormData({ ...formData, zonename: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.zonename && <p className="text-red-500 text-sm">{errors.zonename}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Loại Zone</label>
                                <select
                                    value={formData.zonetype}
                                    onChange={(e) => setFormData({ ...formData, zonetype: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Chọn loại Zone</option>
                                    <option value="Normal">Normal</option>
                                    <option value="AirConditioner">Air Conditioner</option>
                                    <option value="Private">Private</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Mô tả</label>
                                <input
                                    type="text"
                                    value={formData.zonedescription}
                                    onChange={(e) => setFormData({ ...formData, zonedescription: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.zonedescription && <p className="text-red-500 text-sm">{errors.zonedescription}</p>}
                            </div>
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
