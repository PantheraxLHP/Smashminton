'use client';

import React, { useRef, useEffect, useState } from "react";
import { Court } from "./page";
import { FaPen } from "react-icons/fa";
import { getZones } from "@/services/zones.service";
import { postCourts } from "@/services/courts.service";
import { Zone } from "./page";
import { toast } from "sonner";
import { courtSchema } from "../warehouse.schema";
import { z } from "zod";

interface CourtModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: Court) => void;
    onSuccess?: () => void;
}

export default function AddCourtModal({
    open,
    onClose,
    onSubmit,
    onSuccess,
}: CourtModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [courtAvatar, setCourtAvatar] = useState<File | null>(null);
    const [courtPreview, setCourtPreview] = useState<string>("");
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<Court>({
        courtname: "",
        image: "",
        status: "Đang hoạt động",
        avgrating: 0,
        timecalavg: "2025-06-04",
        zoneid: 0,
    });

    useEffect(() => {
        const fetchZones = async () => {
            if (open) {
                const response = await getZones();
                if (Array.isArray(response.data?.zones)) {
                    setZones(response.data.zones);
                } else {
                    console.error("Dữ liệu zones không hợp lệ:", response.data);
                    setZones([]);
                }
            }
        };
        fetchZones();
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

    const handleCourtImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCourtAvatar(file);
            setCourtPreview(URL.createObjectURL(file));
        }
    };

    async function handleSubmit() {
        setErrors({});
        try {
            courtSchema.parse({
                ...formData,
            });
            if (!formData.courtname || !formData.zoneid) {
                toast.error("Vui lòng nhập tên sân và chọn Zone.");
                return;
            }

            setLoading(true);
            const submitData = new FormData();
            submitData.append("courtname", formData.courtname);
            submitData.append("zoneid", String(formData.zoneid));
            submitData.append("statuscourt", "Active");
            submitData.append("avgrating", "5");
            const today = new Date().toISOString().split("T")[0];
            submitData.append("timecalculateavg", today);


            if (courtAvatar) {
                submitData.append("image", courtAvatar);
            }

            try {
                const response = await postCourts(submitData);
                if (response.ok) {
                    toast.success("Thêm sân thành công!");
                    onSubmit?.({
                        ...formData,
                        image: response.data?.imageUrl || "",
                        zonename: zones.find(z => z.zoneid === formData.zoneid)?.zonename ?? '',
                    });
                    setErrors({});
                    onClose();
                    onSuccess?.();
                } else {
                    toast.error(response.message || "Thêm sân thất bại.");
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi thêm sân.");
                console.error(error);
            }
            finally {
                setLoading(false);
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
    }

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
                    className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative"
                >
                    <h2 className="text-lg font-semibold mb-4">
                        Thêm Sân
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative w-24 h-24">
                                {courtPreview ? (
                                    <img
                                        src={courtPreview}
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
                                    onChange={handleCourtImageChange}
                                    className="hidden"
                                    id="zone-upload-file"
                                />
                            </div>
                            <p className="text-sm text-gray-500">Ảnh sân</p>
                        </div>
                        <div className="flex-1 grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Tên sân</label>
                                <input
                                    name="courtname"
                                    type="text"
                                    value={formData.courtname || ""}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.courtname && <p className="text-red-500 text-sm">{errors.courtname}</p>}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Zone chứa sân</label>
                                <div className="relative">
                                    <select
                                        name="zoneid"
                                        value={formData.zoneid}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                zoneid: Number(e.target.value),
                                            }))
                                        }
                                        className={`w-full border rounded px-3 py-2`}
                                    >
                                        <option value="">Chọn Zone</option>
                                        {zones.map((zone) => (
                                            <option key={zone.zoneid} value={zone.zoneid}>
                                                {zone.zonename}
                                            </option>
                                        ))}

                                    </select>
                                </div>
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
