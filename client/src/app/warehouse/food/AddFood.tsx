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
import { createProducts, getSingleProductFilterValue, updateProducts, updateProductsWithoutBatch, findSupplier } from "@/services/products.service";
import { getSuppliers, patchSuppliers } from '@/services/suppliers.service';
import { FoodItem } from "./page";
import { toast } from "sonner";
import { Supplier } from "../suppliers/page";

interface FoodModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: FoodItem) => void;
    editData?: FoodItem | null;
}

export default function FoodModal({ open, onClose, onSubmit, editData }: FoodModalProps) {
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [foodAvatar, setFoodAvatar] = useState<File | null>(null);
    const [foodPreview, setFoodPreview] = useState<string>("");  // Preview image
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
    const [costPrice, setCostPrice] = useState<number>(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(99);
    const [totalPages, setTotalPages] = useState(2);
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FoodItem>({
        id: 0, name: '', sellingprice: 0, category: '', stock: 0, batchid: '', expiry: '', discount: 0, image: '/default.png',
    });
    const [supplierList, setSupplierList] = useState<
        { supplierid: number; suppliername: string; costprice: number }[]
    >([]);


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
                    await fetchSuppliers();
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            }

            fetchCategories();
        }
    }, [open]); // Chỉ gọi API khi modal mở

    useEffect(() => {
        if (open) {
            if (editData) {
                setFormData(editData);
                setFoodPreview(editData.image || "");
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
                setFoodAvatar(null);
                setFoodPreview('');
                setSupplierList([]);
            }

            setSelectedSupplierId(0);
            setCostPrice(0);
            setErrors({});
        }
    }, [open, editData]);

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
        if (["sellingprice", "discount"].includes(name)) {
            const numericValue = Number(value);
            setFormData(prev => ({ ...prev, [name]: isNaN(numericValue) ? 0 : numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    const supplierListRef = useRef(supplierList);

    useEffect(() => {
        supplierListRef.current = supplierList;
    }, [supplierList]);


    async function handleSubmit() {
        setErrors({});
        try {
            productSchema.parse({ ...formData });

            if (!editData && !formData.category.trim()) {
                setErrors({ category: 'Vui lòng nhập hoặc chọn loại sản phẩm' });
                toast.error('Vui lòng nhập hoặc chọn loại sản phẩm');
                return;
            }

            setLoading(true);

            const formDataObj = new FormData();
            formDataObj.append('productname', formData.name);
            formDataObj.append('sellingprice', formData.sellingprice.toString());
            formDataObj.append('rentalprice', '0');

            if (editData) {
                formDataObj.append('discount', (formData.discount ?? 0).toString());
            }

            if (foodAvatar) {
                formDataObj.append('productimgurl', foodAvatar);
            } else {
                formDataObj.append('productimgurl', formData.image || '/default.png');
            }

            let result;

            if (editData) {
                // Cập nhật sản phẩm (có hoặc không có batch)
                if (!editData.batchid?.trim()) {
                    result = await updateProductsWithoutBatch(
                        formDataObj,
                        editData.id.toString()
                    );
                } else {
                    result = await updateProducts(
                        formDataObj,
                        editData.id.toString(),
                        editData.batchid
                    );
                }
            } else {
                const value = formData.category.trim();
                const productfilterid = '1';

                result = await createProducts(formDataObj, productfilterid, value);
            }

            if (result.status === 'success') {
                toast.success(editData ? 'Cập nhật thành công' : 'Thêm sản phẩm mới thành công');

                const productId = editData ? editData.id : (result as any).product.productid;

                if (supplierListRef.current.length > 0) {
                    await updateSupplier(productId);
                }

                setErrors({});
                onClose();
                if (onSubmit) onSubmit(formData);
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

    const fetchSuppliers = async () => {
        const response = await getSuppliers(page, pageSize);
        if (response.ok) {
            const { data, pagination } = response.data;

            const mapped: Supplier[] = data.map((supplier: any) => ({
                supplierid: supplier.supplierid,
                name: supplier.suppliername || '',
                phone: supplier.phonenumber || '',
                email: supplier.email || '',
                contactname: supplier.contactname || '',
                address: supplier.address || '',
                products: (supplier.products || []).map((p: any) => ({
                    productid: p.productid,
                    productname: p.productname,
                    costprice: p.costprice || 0,
                })),
            }));

            setSuppliers(mapped);
            setTotalPages(pagination.totalPages);
        }
    };

    const updateSupplier = async (productId: number) => {
        const suppliersToUpdate = supplierListRef.current;
        if (supplierList.length === 0) return;

        try {
            for (const s of suppliersToUpdate) {
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

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    ref={modalRef}
                    className="bg-white rounded-xl p-2 w-full max-w-xl border border-gray-300 shadow-xl"
                    style={{ maxHeight: '90vh' }}
                >
                    <div className="p-6 overflow-y-auto max-h-[80vh]">
                        <h2 className="text-lg font-semibold mb-6">{editData ? "Sửa đồ ăn / Thức uống" : "Thêm đồ ăn / Thức uống"}</h2>

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
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            setCategoryOpen(false);
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

                                {editData?.batchid?.trim() && (
                                    <div>
                                        <label className="block text-sm mb-1">Phần trăm giảm giá</label>
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

                                <div className="">
                                    <label className="block text-sm font-medium mb-1">Chọn nhà cung cấp cho sản phẩm</label>
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

                                                if (!selectedSupplier || selectedSupplier.supplierid === undefined || selectedSupplier.name === undefined) {
                                                    toast.error("Không tìm thấy nhà cung cấp");
                                                    return;
                                                }

                                                const newSupplier = {
                                                    supplierid: selectedSupplier.supplierid,
                                                    suppliername: selectedSupplier.name,
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
                                        <div className="mt-4 w-full sm:w-auto">
                                            <label className="block text-sm font-medium mb-1">Giá nhập</label>
                                            <input
                                                type="number"
                                                value={costPrice ?? ''}
                                                onChange={(e) => setCostPrice(Number(e.target.value))}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="Nhập giá nhập"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {supplierList.length > 0 && (
                            <div className="mt-6 mb-6">
                                <label className="block text-md font-medium mb-1 text-black">
                                    Nhà cung cấp
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {supplierList.map((s) => (
                                        <span
                                            key={s.supplierid}
                                            className="inline-flex items-center gap-1 bg-gray-200 text-sm px-2 py-1 rounded"
                                        >
                                            {s.suppliername} - {s.costprice.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
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
            </div>
        </>
    );
}
