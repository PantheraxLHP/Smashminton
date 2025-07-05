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
import { serviceSchema } from "../../price-management/price-management.schema";
import { z } from "zod";
import { createProducts, updateService, findSupplier } from "@/services/products.service";
import { getSuppliers, patchSuppliers } from '@/services/suppliers.service';
import { toast } from "sonner";
import { Supplier } from "../suppliers/page";

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
    const [loading, setLoading] = useState(false);
    const shoePopoverRef = useRef<HTMLDivElement>(null);
    const racketPopoverRef = useRef<HTMLDivElement>(null);
    const [racketOpen, setRacketOpen] = useState(false);
    const [shoeOpen, setShoeOpen] = useState(false);
    const [serviceAvatar, setServiceAvatar] = useState<File | null>(null);
    const [servicePreview, setServicePreview] = useState<string>("");
    const [filterData, setFilterData] = useState<any[]>([]);
    const [availableValues, setAvailableValues] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [page, setPage] = useState(1);
    const [pageSize] = useState(99);
    const [totalPages, setTotalPages] = useState(2);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
    const [costPrice, setCostPrice] = useState<number>(0);
    const [supplierList, setSupplierList] = useState<
        { supplierid: number; suppliername: string; costprice: number }[]
    >([]);
    const [formData, setFormData] = useState<Service>({
        productid: 0,
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
        if (open) {
            if (editData) {
                setFormData({
                    ...editData,
                    image: editData.image || '/default.png',
                    value: editData.value || '',
                });

                setServicePreview(editData.image || '/default.png');
                setServiceAvatar(null);

                if (editData.servicetype === "Thuê giày") {
                    setShoeSize(editData.value || "");
                } else if (editData.servicetype === "Thuê vợt") {
                    setRacketWeight(editData.value || "");
                }

                setSupplierList([]);
                findSupplier(editData.productid).then((res) => {
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
                    productid: 0,
                    productname: "",
                    price: 0,
                    servicetype: "",
                    image: '/default.png',
                    quantity: 0,
                    productfiltervalueid: 0,
                    value: "",
                });
                setShoeSize("");
                setRacketWeight("");
                setServiceAvatar(null);
                setServicePreview('');
                setSupplierList([]);
            }

            setSelectedSupplierId(0);
            setCostPrice(0);
            setErrors({});

            fetchSuppliers();
        }
    }, [open, editData]);
    
    
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

    const supplierListRef = useRef(supplierList);
    useEffect(() => {
        supplierListRef.current = supplierList;
    }, [supplierList]);

    useEffect(() => {
        if (open && editData) {
            findSupplier(editData.productid).then((res) => {
                if (res.ok && Array.isArray(res.data)) {
                    const suppliers = res.data.map((s: any) => ({
                        supplierid: s.supplierid,
                        suppliername: s.suppliername,
                        costprice: parseInt(s.costprice),
                    }));
                    setSupplierList(suppliers);
                }
            });
        }
    }, [open, editData]);


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

    const updateSupplier = async (productId: number) => {
        const suppliersToUpdate = supplierListRef.current;
        if (suppliersToUpdate.length === 0) return;

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

    async function handleSubmit() {
        setErrors({});
        setLoading(true);
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

            if (!selectedValue || !selectedValue.trim()) {
                setErrors({ value: "Vui lòng nhập hoặc chọn một giá trị hợp lệ." });
                toast.error("Vui lòng nhập hoặc chọn một giá trị hợp lệ.");
                return;
            }

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
                result = await createProducts(formDataObj, typeId.toString(), selectedValue);
            }

            if (result.status === "success") {
                const createdProductId = editData ? editData.productid : (result as any).product.productid;
                if (supplierListRef.current.length > 0) {
                    await updateSupplier(createdProductId);
                }

                if (onSubmit) {
                    onSubmit({
                        ...formData,
                        image: serviceAvatar ? URL.createObjectURL(serviceAvatar) : formData.image,
                        value: selectedValue,
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
        finally {
            setLoading(false);
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
                            className="border border-gray-400 text-black px-4 py-2 rounded hover:bg-gray-100"
                        >
                            Thoát
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="border border-primary-600 text-primary-600 px-4 py-2 rounded hover:bg-primary-100"
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
