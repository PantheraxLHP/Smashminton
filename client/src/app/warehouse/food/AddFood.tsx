'use client';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from 'react';
import { FaPen } from "react-icons/fa";
import { productSchema } from "../warehouse.schema";
import { z } from "zod";
import { createProducts, getSingleProductFilterValue, updateProducts } from "@/services/products.service";
import { FoodItem } from "./page";
import { toast } from "sonner";

interface FoodModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: FoodItem) => void;
    editData?: FoodItem | null;
}

export default function FoodModal({ open, onClose, onSubmit, editData }: FoodModalProps) {
    const [loading, setLoading] = useState(false);
    const [foodAvatar, setFoodAvatar] = useState<File | null>(null);
    const [foodPreview, setFoodPreview] = useState<string>("");  // Preview image
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FoodItem>({
        id: 0, name: '', sellingprice: 0, category: '', stock: 0, batchid: '', expiry: '', discount: 0, image: '/default.png',
    });

    const [predefinedCategories, setPredefinedCategories] = useState<{ value: string; productfiltervalueid: string }[]>([]); // Store category and productfiltervalueid

    useEffect(() => {
        if (open) {
            // Gọi API để lấy dữ liệu các loại sản phẩm
            async function fetchCategories() {
                try {
                    const response = await getSingleProductFilterValue(1); // truyền productfilterid = 1
                    if (response.ok) {
                        const categories = response.data.product_filter_values.map((item: any) => ({
                            value: item.value,
                            productfiltervalueid: item.productfiltervalueid,
                        }));
                        setPredefinedCategories(categories);
                    }
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            }

            fetchCategories();
        }
    }, [open]); // Chỉ gọi API khi modal mở

    useEffect(() => {
        if (editData) {
            setFormData(editData);
            setFoodPreview(editData.image);
        } else {
            setFormData({
                id: 0,
                name: '',
                sellingprice: 0,
                category: '',
                stock: 0,
                batchid: '',
                expiry: '',
                discount: 0,
                image: '/default.png',
                status: '',
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

    async function handleSubmit() {
        setErrors({});
        try {
            productSchema.parse({ ...formData });

            const selectedCategory = predefinedCategories.find(
                (cat) => cat.value === formData.category
            );
            if (!selectedCategory && !editData) {
                setErrors({ category: 'Vui lòng chọn một loại hợp lệ' });
                return;
            }

            setLoading(true);

            const formDataObj = new FormData();
            formDataObj.append('productname', formData.name);
            formDataObj.append('sellingprice', formData.sellingprice.toString());

            if (editData) {
                formDataObj.append('discount', formData.discount?.toString() || '0');
            } else {
                // chỉ khi tạo mới mới cần gửi rentalprice và status
                formDataObj.append('status', 'Available');
                formDataObj.append('rentalprice', '0');
            }

            // Hình ảnh (mới nếu có, hoặc giữ lại ảnh cũ)
            if (foodAvatar) {
                formDataObj.append('productimgurl', foodAvatar);
            } else {
                formDataObj.append('productimgurl', formData.image || '/default.png');
            }

            let result;
            if (editData) {
                result = await updateProducts(
                    formDataObj,
                    editData.id.toString(),
                    editData.batchid || ''
                );
            } else {
                result = await createProducts(
                    formDataObj,
                    selectedCategory!.productfiltervalueid
                );
            }

            if (result.status === 'success') {
                toast.success(editData ? 'Cập nhật thành công' : 'Thêm sản phẩm mới thành công');
                setErrors({});
                onClose();
            } else {
                setErrors({ general: result.message || 'Thao tác thất bại' });
                toast.error(result.message || 'Thao tác thất bại');
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: any = {};
                error.errors.forEach((err) => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
            }
        } finally {
            setLoading(false);
        }
    }


    const handleFoodImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFoodAvatar(file);
            setFoodPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (!open) {
            setErrors({});
            setFoodAvatar(null);
            setFoodPreview("");
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
                    <h2 className="text-lg font-semibold mb-6">Thêm đồ ăn / Thức uống</h2>

                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative w-24 h-24">
                                {foodPreview ? (
                                    <img
                                        src={foodPreview}
                                        alt="/default.png"
                                        className="w-24 h-24 rounded-full object-cover border"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 border flex items-center justify-center text-gray-500 text-xl">
                                        📷
                                    </div>
                                )}
                                <label htmlFor="food-upload-file">
                                    <div className="absolute bottom-0 right-0 p-1 bg-gray-200 rounded-full border hover:bg-gray-300 cursor-pointer">
                                        <FaPen size={14} />
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFoodImageChange}
                                    className="hidden"
                                    id="food-upload-file"
                                />
                            </div>
                            <p className="text-sm text-gray-500">Ảnh food</p>
                        </div>
                        <div className="flex-1 grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Tên đồ ăn, thức uống</label>
                                <input
                                    name="name"
                                    type="text"
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
                            {!editData && (
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
                                                            key={item.value}
                                                            value={item.value}
                                                            onSelect={() => {
                                                                setFormData((prev) => ({ ...prev, category: item.value }));
                                                                setCategoryOpen(false); // đóng popover khi chọn
                                                            }}
                                                            className="cursor-pointer"
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formData.category === item.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {item.value}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}

                            {editData && (
                                <div>
                                    <label className="block text-sm mb-1">Giảm giá</label>
                                    <input
                                        name="discount"
                                        type="number"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                    {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
                                </div>
                            )}
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
                            disabled={loading}
                            className="px-4 py-2 rounded border text-primary-600 border-primary-600 hover:bg-primary-50 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? editData
                                    ? 'Đang lưu...'
                                    : 'Đang tạo...'
                                : editData
                                    ? 'Lưu'
                                    : 'Tạo'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
