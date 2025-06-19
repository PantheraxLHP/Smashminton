'use client';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from 'react';
import { Accessory } from './page';
import { FaPen } from "react-icons/fa";
import { productSchema } from "../warehouse.schema";
import { z } from "zod";

const predefinedCategories = ["Quả cầu lông", "Quấn cán", "Phụ kiện khác"];

interface AccessoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: Accessory) => void;
    editData?: Accessory | null;
}

export default function AccessoryModal({
    open,
    onClose,
    onSubmit,
    editData,
}: AccessoryModalProps) {
    const [accessoryAvatar, setAccessoryAvatar] = useState<File | null>(null);
    const [accessoryPreview, setAccessoryPreview] = useState<string>("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<Accessory>({
        name: '',
        sellingprice: 0,
        category: '',
        stock: 0,
        costprice: 0,
        image: '/default.png',
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                ...editData,
                sellingprice: editData.sellingprice,
            });
            setAccessoryPreview(editData.image);
        } else {
            setFormData({
                name: '',
                sellingprice: 0,
                category: '',
                stock: 0,
                costprice: 0,
                image: '/default.png',
            });
        }
    }, [editData, open]);

    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (
                modalRef.current && !modalRef.current.contains(target) &&
                !popoverRef.current?.contains(target)
            ) {
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
        if (name === "sellingprice") {
            const numericValue = Number(value);
            setFormData(prev => ({ ...prev, [name]: isNaN(numericValue) ? 0 : numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }


    function handleSubmit() {
        try {
            productSchema.parse({
                ...formData,
            });

            if (onSubmit) {
                onSubmit({
                    ...formData,
                    sellingprice: formData.sellingprice,
                    image: accessoryAvatar ? URL.createObjectURL(accessoryAvatar) : formData.image,
                });
            }
            setErrors({});
            onClose();
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


    const handleAccessoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAccessoryAvatar(file);
            setAccessoryPreview(URL.createObjectURL(file));
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
                    className="bg-white rounded-xl p-6 w-full max-w-xl border border-gray-300 shadow-xl"
                >
                    <h2 className="text-lg font-semibold mb-6">
                        {editData ? 'Sửa hàng hoá' : 'Thêm hàng hoá'}
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative w-24 h-24">
                                {accessoryPreview ? (
                                    <img
                                        src={accessoryPreview}
                                        alt="/default.png"
                                        className="w-24 h-24 rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 border flex items-center justify-center text-gray-500 text-xl">
                                        📷
                                    </div>
                                )}
                                <label htmlFor="accessory-upload-file">
                                    <div className="absolute bottom-0 right-0 p-1 bg-gray-200 rounded-full border hover:bg-gray-300 cursor-pointer">
                                        <FaPen size={14} />
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAccessoryImageChange}
                                    className="hidden"
                                    id="accessory-upload-file"
                                />
                            </div>
                            <p className="text-sm text-gray-500">Ảnh food</p>
                        </div>
                        <div className="flex-1 grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Tên hàng hoá</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Giá bán</label>
                                <input
                                    name="sellingprice"
                                    type="number"
                                    value={formData.sellingprice}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.sellingprice && <p className="text-red-500 text-sm">{errors.sellingprice}</p>}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Loại</label>
                                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between border-gray-200 text-black hover:bg-gray-100 hover:text-black"
                                        >
                                            {formData.category || "Chọn hoặc nhập loại"}
                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0" ref={popoverRef}>
                                        <Command
                                            shouldFilter={false}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    setCategoryOpen(false); // đóng popover
                                                }
                                            }}
                                        >
                                            <CommandInput
                                                placeholder="Nhập loại mới hoặc chọn..."
                                                value={formData.category}
                                                onValueChange={(input) =>
                                                    setFormData((prev) => ({ ...prev, category: input }))
                                                }
                                            />
                                            <CommandEmpty>
                                                <div className="p-2 text-sm text-muted-foreground">
                                                    Không tìm thấy. Nhấn Enter để dùng loại mới: <strong>{formData.category}</strong>
                                                </div>
                                            </CommandEmpty>
                                            <CommandGroup heading="Loại có sẵn">
                                                {predefinedCategories.map((item) => (
                                                    <CommandItem
                                                        key={item}
                                                        value={item}
                                                        onSelect={() => {
                                                            setFormData((prev) => ({ ...prev, category: item }));
                                                            setCategoryOpen(false); // đóng popover khi chọn
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                formData.category === item ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {item}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
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
