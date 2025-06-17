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
    const shoePopoverRef = useRef<HTMLDivElement>(null);
    const racketPopoverRef = useRef<HTMLDivElement>(null);
    const [racketOpen, setRacketOpen] = useState(false);
    const [shoeOpen, setShoeOpen] = useState(false);
    const [serviceAvatar, setServiceAvatar] = useState<File | null>(null);
    const [servicePreview, setServicePreview] = useState<string>("");
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
    
    const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setServiceAvatar(file);
                setServicePreview(URL.createObjectURL(file));
            }
        };

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
                                    <label className="block text-sm mb-1">Trọng lượng vợt</label>
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
