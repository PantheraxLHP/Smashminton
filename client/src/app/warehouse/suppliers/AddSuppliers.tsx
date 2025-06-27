'use client';

import { useRef, useEffect, useState } from 'react';
import { Supplier } from './page';
import { getAllProducts } from '@/services/products.service';
import { postSuppliers, patchSuppliers } from '@/services/suppliers.service';
import { toast } from 'sonner';
import { supplierSchema } from '../warehouse.schema';
import { z } from 'zod';

export interface ProductOption {
    productid: number;
    productname: string;
    costprice: number;
}

interface AddSupplierModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Supplier, isEdit: boolean) => void;
    editData?: Supplier | null;
}

async function fetchProducts(): Promise<ProductOption[]> {
    const res = await getAllProducts();
    return res.data.map((product: any) => ({
        productid: product.productid,
        productname: product.productname,
        costprice: product.costprice,
    }));
}

export default function AddSupplierModal({
    open,
    onClose,
    onSubmit,
    editData,
}: AddSupplierModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState<Supplier>({
        name: '',
        contactname: '',
        phone: '',
        email: '',
        address: '',
        products: [],
    });

    const [productsList, setProductsList] = useState<ProductOption[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number>(0);
    const [productCostPrice, setProductCostPrice] = useState<number | null>(null);

    useEffect(() => {
        if (open) {
            fetchProducts().then(setProductsList).catch(console.error);
        }
    }, [open]);

    useEffect(() => {
        if (open && editData) {
            setFormData(editData);
        }
    }, [open, editData]);

    useEffect(() => {
        if (!open) {
            setFormData({
                name: '',
                contactname: '',
                phone: '',
                email: '',
                address: '',
                products: [],
            });
            setSelectedProductId(0);
            setProductCostPrice(null);
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = () => {
        const product = productsList.find(p => p.productid === selectedProductId);
        if (!productCostPrice || isNaN(productCostPrice)) {
            toast.error("Chưa nhập giá cho sản phẩm");
            return;
        }

        if (productCostPrice < 0 || productCostPrice > 1000000000) {
            toast.error("Giá sản phẩm không hợp lệ");
            return;
        }

        if (product && productCostPrice != null) {
            const newProduct = {
                ...product,
                costprice: productCostPrice,
            };
            if (!formData.products.some(p => p.productid === selectedProductId)) {
                setFormData((prev) => ({
                    ...prev,
                    products: [...prev.products, newProduct],
                }));
            }
            setProductCostPrice(null);
        }
        setSelectedProductId(0);
    };

    const handleRemoveProduct = (id: number) => {
        setFormData((prev) => ({
            ...prev,
            products: prev.products.filter(p => p.productid !== id),
        }));
    };

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

    const handleSubmit = async () => {
        try {
            // Validate dữ liệu đầu vào
            supplierSchema.parse({ ...formData });
            setLoading(true);

            // Chuyển đổi danh sách sản phẩm
            const products = formData.products.map(p => {
                const productid = Number(p.productid);
                const costprice = Number(p.costprice);

                if (isNaN(productid) || isNaN(costprice)) {
                    toast.error("Thông tin sản phẩm không hợp lệ");
                    throw new Error("Thông tin sản phẩm không hợp lệ");
                }

                return { productid, costprice };
            });

            console.log("Products: ",products);

            const payloadBase = {
                suppliername: formData.name,
                contactname: formData.contactname,
                phonenumber: formData.phone,
                email: formData.email,
                address: formData.address,
            };

            let result;

            if (editData) {
                if (!editData.supplierid) return;
                result = await patchSuppliers(editData.supplierid, {
                    ...payloadBase,
                    products_costs: products,
                });
            } else {
                result = await postSuppliers({
                    ...payloadBase,
                    products,
                });
            }

            if (result.ok) {
                onSubmit({ ...formData, supplierid: result.data?.supplierid }, !!editData);
                onClose();
            } else {
                toast.error(
                    (editData ? 'Không thể cập nhật' : 'Không thể thêm') +
                    ' nhà cung cấp: ' + (result.message || '')
                );
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error instanceof z.ZodError) {
                const newErrors: any = {};
                error.errors.forEach((err) => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
            } else {
                toast.error(error instanceof Error ? error.message : 'Đã xảy ra lỗi');
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
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 px-4 mt-8">
                <div
                    ref={modalRef}
                    className="bg-white rounded-xl w-full max-w-2xl max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden p-6 border border-gray-300 shadow-xl"
                >
                    <h2 className="text-lg font-semibold mb-6">
                        {editData ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm mb-1">Tên nhà cung cấp</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Số điện thoại</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-1">Tên người liên hệ</label>
                            <input
                                name="contactname"
                                value={formData.contactname}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.contactname && <p className="text-red-500 text-sm">{errors.contactname}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-1">Địa chỉ</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-1">Chọn sản phẩm cung cấp</label>
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                                    className="flex-1 border rounded px-3 py-2"
                                >
                                    <option value={0}>Chọn sản phẩm</option>
                                    {productsList.map((product) => (
                                        <option key={product.productid} value={product.productid}>
                                            {product.productname}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleAddProduct}
                                    className="w-full sm:w-auto px-3 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                                >
                                    Thêm
                                </button>
                            </div>

                            {/* Đặt phần nhập giá ở dưới chọn sản phẩm */}
                            {selectedProductId > 0 && (
                                <div className="mt-4 w-full sm:w-auto">
                                    <label className="block text-sm mb-1">Nhập giá cho sản phẩm</label>
                                    <input
                                        type="number"
                                        value={productCostPrice ?? ''}
                                        onChange={(e) => setProductCostPrice(Number(e.target.value))}
                                        className="w-full border rounded px-3 py-2"
                                        placeholder="Nhập giá sản phẩm"
                                    />
                                </div>
                            )}
                        </div>

                        {formData.products.length > 0 && (
                            <div className="sm:col-span-2">
                                <label className="block text-sm mb-1 mt-4">Sản phẩm đã chọn</label>
                                <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
                                    {formData.products.map((p) => (
                                        <span
                                            key={p.productid}
                                            className="inline-flex items-center gap-1 bg-gray-200 text-sm px-2 py-1 rounded max-w-full truncate"
                                        >
                                            <span className="truncate">
                                                {p.productname} - {p.costprice.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </span>

                                            <button
                                                onClick={() => handleRemoveProduct(p.productid)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded border border-gray-500 text-gray-700 hover:bg-gray-100"
                        >
                            Thoát
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="border border-primary-600 text-primary-600 px-4 py-2 rounded hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? (editData ? "Đang lưu..." : "Đang tạo...")
                                : (editData ? "Lưu thay đổi" : "Tạo")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
