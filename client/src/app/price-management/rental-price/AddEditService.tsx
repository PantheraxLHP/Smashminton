'use client';

import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput, CommandEmpty, } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from "react";
import { Service } from "./page";
import { getRentalFilters } from "@/services/products.service";
import { FaPen } from "react-icons/fa";
import { serviceSchema } from "../price-management.schema";
import { z } from "zod";
import { createProducts, updateService } from "@/services/products.service";
import { toast } from "sonner";

interface ServiceModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: Service) => void;
    editData?: Service | null;
}

function formatPrice(price: string): string {
    const number = Number(price.replace(/\D/g, ""));
    return new Intl.NumberFormat("vi-VN").format(number) + " VND";
}

export default function ServiceModal({ open, onClose, onSubmit, editData }: ServiceModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const shoePopoverRef = useRef<HTMLDivElement>(null);
    const racketPopoverRef = useRef<HTMLDivElement>(null);
    const [racketOpen, setRacketOpen] = useState(false);
    const [shoeOpen, setShoeOpen] = useState(false);
    const [serviceAvatar, setServiceAvatar] = useState<File | null>(null);
    const [servicePreview, setServicePreview] = useState<string>("");
    const [filterData, setFilterData] = useState<any[]>([]);
    const [availableValues, setAvailableValues] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<Service>({
        productname: "",
        price: 0,
        servicetype: "",
        image: "",
        quantity: 0,
        productfiltervalueid: 0,
        value: "",
    });

    const [shoeSize, setShoeSize] = useState<string>("");
    const [racketWeight, setRacketWeight] = useState<string>("");

    useEffect(() => {
        if (editData) {
            setFormData({
                ...editData,
                price: editData.price,
                image: editData.image || '/default.png',
                value: editData.value || "",
            });
            if (editData.servicetype === "Thuê giày") {
                setShoeSize(editData.value || "");
            } else if (editData.servicetype === "Thuê vợt") {
                setRacketWeight(editData.value || "");
            }
            setServicePreview(editData.image || '/default.png');
            setServiceAvatar(null);
        } else {
            setFormData({
                productname: "",
                price: 0,
                servicetype: "",
                image: '/default.png',
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
            const target = event.target as Node;
            // Đảm bảo chỉ đóng modal nếu click ngoài modal và popover
            if (
                modalRef.current && !modalRef.current.contains(target) &&
                !(shoePopoverRef.current && shoePopoverRef.current.contains(target)) &&
                !(racketPopoverRef.current && racketPopoverRef.current.contains(target))
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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'price') {
            setFormData(prev => ({
                ...prev,
                [name]: value ? parseFloat(value) : 0,
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };



    async function handleSubmit() {
        setErrors({});
        try {
            serviceSchema.parse({
                ...formData,
                shoeSize: shoeSize || undefined,
                racketWeight: racketWeight || undefined,
            });

            const typeId = formData.servicetype === "Thuê vợt" ? 3
                : formData.servicetype === "Thuê giày" ? 4
                    : null;
            if (!typeId) {
                setErrors({ servicetype: "Vui lòng chọn loại dịch vụ hợp lệ" });
                return;
            }

            const selectedValue = formData.servicetype === "Thuê giày" ? shoeSize : racketWeight;

            const filterItem = filterData
                .find((f) => f.producttypeid === typeId)
                ?.product_filter[0]
                ?.product_filter_values
                .find((val: any) => val.value === selectedValue);

            if (!filterItem) {
                setErrors({ value: "Giá trị không hợp lệ. Vui lòng chọn từ danh sách hoặc nhập mới đã được hỗ trợ." });
                return;
            }

            const productfiltervalueid = filterItem.productfiltervalueid;

            const formDataObj = new FormData();
            formDataObj.append("productname", formData.productname);
            formDataObj.append("rentalprice", formData.price.toString());
            formDataObj.append("sellingprice", "0");
            if (serviceAvatar) {
                formDataObj.append("productimgurl", serviceAvatar);
            } else {
                formDataObj.append("productimgurl", formData.image || "/default.png");
            }

            let result;

            if (editData?.productid != null) {
                result = await updateService(formDataObj, editData.productid.toString());
            } else {
                result = await createProducts(formDataObj, productfiltervalueid);
            }            

            if (result.status === "success") {
                if (onSubmit) {
                    onSubmit({
                        ...formData,
                        image: serviceAvatar ? URL.createObjectURL(serviceAvatar) : formData.image,
                        value: selectedValue,
                        productfiltervalueid,
                    });
                }

                toast.success(editData ? "Cập nhật thành công!" : "Tạo sản phẩm thành công!");
                onClose();
                setServiceAvatar(null);
                setServicePreview("");
            } else {
                setErrors({ general: result.message || (editData ? "Cập nhật thất bại" : "Tạo sản phẩm thất bại") });
                toast.error(result.message || (editData ? "Cập nhật thất bại" : "Tạo sản phẩm thất bại"));
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
    
    

    const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setServiceAvatar(file);
            setServicePreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (!open) {
            setErrors({});
            setServicePreview("");
        }
    }, [open]);


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

                    <div className="flex flex-col sm:flex-row gap-6 mb-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative w-24 h-24">
                                {servicePreview ? (
                                    <img
                                        src={servicePreview}
                                        alt="food Preview"
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
                                    onChange={handleServiceImageChange}
                                    className="hidden"
                                    id="food-upload-file"
                                />
                            </div>
                            <p className="text-sm text-gray-500">Ảnh giày, vợt</p>
                        </div>
                        <div className="flex-1 grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Tên dịch vụ</label>
                                <input
                                    name="productname"
                                    type="text"
                                    value={formData.productname}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.productname && <p className="text-red-500 text-sm">{errors.productname}</p>}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Giá thuê</label>
                                <input
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                            </div>
                            {!editData && (
                                <div>
                                    <label className="block text-sm mb-1">Dịch vụ áp dụng</label>
                                    <select
                                        name="servicetype"
                                        value={formData.servicetype}
                                        onChange={handleChange}
                                        className="w-full border rounded px-3 py-2 pb-2"
                                    >
                                        <option value="">Chọn dịch vụ</option>
                                        <option value="Thuê giày">Thuê giày</option>
                                        <option value="Thuê vợt">Thuê vợt</option>
                                    </select>


                                    {formData.servicetype === "Thuê giày" && (
                                        <div>
                                            <label className="block text-sm mb-1 mt-1">Kích cỡ giày</label>
                                            <Popover open={shoeOpen} onOpenChange={setShoeOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-full justify-between border-gray-200 text-black hover:bg-gray-100 hover:text-black"
                                                    >
                                                        {shoeSize || "Chọn hoặc nhập kích cỡ"}
                                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent ref={shoePopoverRef} className="w-full p-0">
                                                    <Command
                                                        shouldFilter={false}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                setShoeOpen(false);
                                                            }
                                                        }}
                                                    >
                                                        <CommandInput
                                                            placeholder="Nhập kích cỡ mới hoặc chọn..."
                                                            value={shoeSize}
                                                            onValueChange={(input) => setShoeSize(input)}
                                                        />
                                                        <CommandEmpty>
                                                            <div className="p-2 text-sm text-muted-foreground">
                                                                Không tìm thấy. Nhấn Enter để dùng kích cỡ mới: <strong>{shoeSize}</strong>
                                                            </div>
                                                        </CommandEmpty>
                                                        <CommandGroup heading="Kích cỡ có sẵn">
                                                            {availableValues.map((item) => (
                                                                <CommandItem
                                                                    key={item}
                                                                    value={item}
                                                                    onSelect={() => {
                                                                        setShoeSize(item);
                                                                        setShoeOpen(false);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            shoeSize === item ? "opacity-100" : "opacity-0"
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
                                    )}

                                    {formData.servicetype === "Thuê vợt" && (
                                        <div>
                                            <label className="block text-sm mb-1 mt-1">Trọng lượng vợt</label>
                                            <Popover open={racketOpen} onOpenChange={setRacketOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-full justify-between border-gray-200 text-black hover:bg-gray-100 hover:text-black"
                                                    >
                                                        {racketWeight || "Chọn hoặc nhập trọng lượng"}
                                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent ref={racketPopoverRef} className="w-full p-0">
                                                    <Command
                                                        shouldFilter={false}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                setRacketOpen(false);
                                                            }
                                                        }}
                                                    >
                                                        <CommandInput
                                                            placeholder="Nhập trọng lượng mới hoặc chọn..."
                                                            value={racketWeight}
                                                            onValueChange={(input) => setRacketWeight(input)}
                                                        />
                                                        <CommandEmpty>
                                                            <div className="p-2 text-sm text-muted-foreground">
                                                                Không tìm thấy. Nhấn Enter để dùng trọng lượng mới: <strong>{racketWeight}</strong>
                                                            </div>
                                                        </CommandEmpty>
                                                        <CommandGroup heading="Trọng lượng có sẵn">
                                                            {availableValues.map((item) => (
                                                                <CommandItem
                                                                    key={item}
                                                                    value={item}
                                                                    onSelect={() => {
                                                                        setRacketWeight(item);
                                                                        setRacketOpen(false);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            shoeSize === item ? "opacity-100" : "opacity-0"
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
                                    )}
                                </div>
                            )}
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
                            {editData ? "Lưu thay đổi" : "Tạo"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
