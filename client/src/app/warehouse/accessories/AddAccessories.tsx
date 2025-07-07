'use client';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from 'react';
import { FaPen } from "react-icons/fa";
import { accessorySchema } from "../warehouse.schema";
import { z } from "zod";
import { toast } from "sonner";
import { createProducts, getSingleProductFilterValue, updateProducts, updateProductsWithoutBatch } from "@/services/products.service";
import { Accessory } from './page';
import { getSuppliers, patchSuppliers } from '@/services/suppliers.service';
import { Supplier } from '../suppliers/page'; // hoặc đúng path bạn có định nghĩa
import { findSupplier } from '@/services/products.service';


interface AccessoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: Accessory) => void;
    editData?: Accessory | null;
    showBatch: boolean;
}

export default function AccessoryModal({ open, onClose, onSubmit, editData, showBatch }: AccessoryModalProps) {
    const [accessoryAvatar, setAccessoryAvatar] = useState<File | null>(null);
    const [accessoryPreview, setAccessoryPreview] = useState<string>("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const originalSupplierIdsRef = useRef<number[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [supplierList, setSupplierList] = useState<{ supplierid: number; suppliername: string; costprice: number }[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
    const [costPrice, setCostPrice] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(99);
    const [predefinedCategories, setPredefinedCategories] = useState<{ value: string, productfiltervalueid: string }[]>([]);
    const [formData, setFormData] = useState<Accessory>({
        id: 0,
        name: '',
        batchid: '',
        sellingprice: 0,
        category: '',
        stock: 0,
        image: '/default.png',
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const fetchCategories = async () => {
        try {
            const res = await getSingleProductFilterValue(2);
            if (res.ok) {
                const mapped = res.data.product_filter_values.map((item: any) => ({
                    value: item.value,
                    productfiltervalueid: item.productfiltervalueid,
                }));
                setPredefinedCategories(mapped);
            }
        } catch (err) {
            console.error('Lỗi khi lấy loại phụ kiện:', err);
        }
    };

    useEffect(() => {
        if (open) {
            fetchCategories();
        }
    }, [open]);

    // Lấy danh sách nhà cung cấp khi modal mở
    useEffect(() => {
        if (open) {
            getSuppliers(page, pageSize).then((res) => {
                if (res.ok) {
                    const { data } = res.data;
                    const mapped: Supplier[] = data.map((s: any) => ({
                        supplierid: s.supplierid,
                        name: s.suppliername || '',
                        phone: s.phonenumber || '',
                        email: s.email || '',
                        contactname: s.contactname || '',
                        address: s.address || '',
                        products: (s.products || []).map((p: any) => ({
                            productid: p.productid,
                            productname: p.productname,
                            costprice: p.costprice || 0,
                        })),
                    }));
                    setSuppliers(mapped);
                    // originalSupplierIdsRef.current = suppliers.map(s => s.supplierid);
                }
            });
        }
    }, [open, page, pageSize]);

    // Cập nhật form và supplierList khi mở modal
    useEffect(() => {
        if (open) {
            if (editData) {
                setFormData(editData);
                setAccessoryPreview(editData.image || "");
                setSupplierList([]);

                findSupplier(editData.id).then((res) => {
                    if (res.ok && Array.isArray(res.data)) {
                        const suppliers = res.data.map((s: any) => ({
                            supplierid: s.supplierid,
                            suppliername: s.suppliername,
                            costprice: parseInt(s.costprice),
                        }));
                        setSupplierList(suppliers);
                    }
                });
            } else {
                // Reset nếu tạo mới
                setFormData({
                    id: 0,
                    name: '',
                    sellingprice: 0,
                    category: '',
                    stock: 0,
                    batchid: '',
                    image: '/default.png',
                });
                setAccessoryAvatar(null);
                setAccessoryPreview('');
                setSupplierList([]);
            }

            setSelectedSupplierId(0);
            setCostPrice(0);
            setErrors({});
        }
    }, [open, editData]);


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
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'sellingprice' ? Number(value) : value,
        }));
    };

    const handleAccessoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAccessoryAvatar(file);
            setAccessoryPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setErrors({});
        try {
            accessorySchema.parse({ ...formData });

            const categoryValue = formData.category?.trim();
            if (!categoryValue && !editData) {
                setErrors({ category: 'Vui lòng nhập hoặc chọn một loại phụ kiện' });
                toast.error('Vui lòng nhập hoặc chọn một loại phụ kiện');
                return;
            }

            setLoading(true);

            const formDataObj = new FormData();
            formDataObj.append('productname', formData.name);
            formDataObj.append('sellingprice', formData.sellingprice.toString());
            formDataObj.append('rentalprice', '0');
            
            if (accessoryAvatar) {
                formDataObj.append('productimgurl', accessoryAvatar);
            } else {
                formDataObj.append('productimgurl', formData.image || '/default.png');
            }

            let result;

            if (editData) {
                if (!editData.batchid?.trim() || !showBatch) {
                    result = await updateProductsWithoutBatch(formDataObj, editData.id.toString());
                } else {
                    formDataObj.append('discount', '0');
                    result = await updateProducts(formDataObj, editData.id.toString(), editData.batchid);
                }
            } else {
                result = await createProducts(formDataObj, '2', categoryValue);
            }

            if (result.status === 'success') {
                toast.success(editData ? 'Cập nhật thành công' : 'Thêm phụ kiện mới thành công');
                const productId = editData ? editData.id : (result as any).product.productid;
                await updateSupplier(productId);
                if (onSubmit) onSubmit(formData);
                onClose();
            } else {
                toast.error(result.message || 'Lỗi thao tác');
                setErrors({ general: result.message || 'Lỗi thao tác' });
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: any = {};
                error.errors.forEach(err => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
            }
        } finally {
            setLoading(false);
        }
    };    

    const updateSupplier = async (productId: number) => {
        if (supplierList.length === 0) return;

        try {
            for (const s of supplierList) {
                const supplierInfo = suppliers.find(sup => sup.supplierid === s.supplierid);
                if (!supplierInfo) continue;

                const payload = {
                    suppliername: supplierInfo.name,
                    contactname: supplierInfo.contactname || '',
                    phonenumber: supplierInfo.phone || '',
                    email: supplierInfo.email || '',
                    address: supplierInfo.address || '',
                    products_costs: [{ productid: productId, costprice: s.costprice }],
                };

                await patchSuppliers(s.supplierid, payload);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật nhà cung cấp:", error);
        }
    };    

    useEffect(() => {
            if (!open) {
                setErrors({});
                setAccessoryAvatar(null);
                setAccessoryPreview("");
            }
        }, [open]);

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div ref={modalRef} className="bg-white rounded-xl p-6 w-full max-w-xl border border-gray-300 shadow-xl">
                    <h2 className="text-lg font-semibold mb-6">{editData ? 'Sửa phụ kiện' : 'Thêm phụ kiện'}</h2>

                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative w-24 h-24">
                                {accessoryPreview ? (
                                    <img src={accessoryPreview} alt="/default.png" className="w-24 h-24 rounded-full object-cover border" />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 border flex items-center justify-center text-gray-500 text-xl">📷</div>
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
                            <p className="text-sm text-gray-500">Ảnh phụ kiện</p>
                        </div>

                        <div className="flex-1 grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Tên phụ kiện</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Giá bán</label>
                                <input name="sellingprice" type="number" value={formData.sellingprice} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                                {errors.sellingprice && <p className="text-red-500 text-sm">{errors.sellingprice}</p>}
                            </div>

                            {!editData && (
                                <div>
                                    <label className="block text-sm mb-1">Loại</label>
                                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between border-gray-200 text-black hover:bg-gray-100 hover:text-black"
                                            >
                                                {formData.category || "Chọn hoặc nhập loại"}
                                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" ref={popoverRef}>
                                            <Command>
                                                <CommandInput
                                                    placeholder="Nhập loại mới hoặc chọn..."
                                                    value={formData.category}
                                                    onValueChange={(input) => setFormData((prev) => ({ ...prev, category: input }))}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && formData.category.trim()) {
                                                            e.preventDefault();
                                                            setCategoryOpen(false);
                                                        }
                                                    }}
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
                                                                setCategoryOpen(false);
                                                            }}
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", formData.category === item.value ? "opacity-100" : "opacity-0")} />
                                                            {item.value}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                                </div>
                            )}
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Chọn nhà cung cấp</label>
                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    <select
                                        value={selectedSupplierId}
                                        onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                                        className="flex-1 border rounded px-3 py-2"
                                    >
                                        <option value={0}>Chọn nhà cung cấp</option>
                                        {suppliers.map((s) => (
                                            <option key={s.supplierid} value={s.supplierid}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!selectedSupplierId || !costPrice) {
                                                toast.error("Chưa chọn nhà cung cấp hoặc giá nhập không hợp lệ");
                                                return;
                                            }

                                            const exists = supplierList.some(s => s.supplierid === selectedSupplierId);
                                            if (exists) {
                                                toast.warning("Nhà cung cấp này đã được thêm");
                                                return;
                                            }

                                            const selectedSupplier = suppliers.find(s => s.supplierid === selectedSupplierId);

                                            if (!selectedSupplier) {
                                                toast.error("Không tìm thấy nhà cung cấp");
                                                return;
                                            }

                                            const supplierid = Number(selectedSupplier.supplierid);
                                            if (isNaN(supplierid)) {
                                                toast.error("ID nhà cung cấp không hợp lệ");
                                                return;
                                            }

                                            const newSupplier = {
                                                supplierid,
                                                suppliername: selectedSupplier.name ?? "",
                                                costprice: costPrice,
                                            };

                                            setSupplierList(prev => [...prev, newSupplier]);

                                            setSelectedSupplierId(0);
                                            setCostPrice(0);
                                        }}                                        
                                        className="w-full sm:w-auto px-3 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                                    >
                                        Thêm
                                    </button>
                                </div>

                                {selectedSupplierId > 0 && (
                                    <div className="mt-2">
                                        <label className="block text-sm mb-1">Giá nhập</label>
                                        <input
                                            type="number"
                                            value={costPrice}
                                            onChange={(e) => setCostPrice(Number(e.target.value))}
                                            className="w-full border rounded px-3 py-2"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {supplierList.length > 0 && (
                        <div className="mt-4 mb-4">
                            <label className="block text-md font-medium mb-1">Nhà cung cấp</label>
                            <div className="flex flex-wrap gap-2">
                                {supplierList.map((s) => (
                                    <span key={s.supplierid} className="inline-flex items-center gap-1 bg-gray-200 text-sm px-2 py-1 rounded">
                                        {s.suppliername} - {s.costprice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}


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
                            className="px-4 py-2 rounded border text-primary-600 border-primary-600 hover:bg-primary-50 disabled:opacity-60"
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
