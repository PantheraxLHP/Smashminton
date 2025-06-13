'use client';

import { useRef, useEffect, useState } from 'react';
import { Supplier } from './page';
import { getAllProducts } from '@/services/products.service';
import { postSuppliers, patchSuppliers } from '@/services/suppliers.service';
import { toast } from 'sonner';

export interface ProductOption {
    productid: number;
    productname: string;
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

    useEffect(() => {
        if (!editData && open) {
            fetchProducts().then(setProductsList).catch(console.error);
        }
    }, [editData, open]);

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
        }
    }, [open]);





    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = () => {
        const product = productsList.find(p => p.productid === selectedProductId);
        if (product && !formData.products.some(p => p.productid === selectedProductId)) {
            setFormData((prev) => ({
                ...prev,
                products: [...prev.products, product],
            }));
        }
        setSelectedProductId(0);
    };

    const handleRemoveProduct = (id: number) => {
        setFormData((prev) => ({
            ...prev,
            products: prev.products.filter(p => p.productid !== id),
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (editData && editData.supplierid !== undefined) {
            const payload = {
                suppliername: formData.name,
                contactname: formData.contactname,
                phonenumber: formData.phone,
                email: formData.email,
                address: formData.address,
            };

            const result = await patchSuppliers(editData.supplierid, payload);

            if (result.ok) {
                onSubmit({ ...formData, supplierid: editData.supplierid }, true);
                onClose();
            } else {
                toast.error('Không thể cập nhật nhà cung cấp: ' + (result.message || ''));
            }
        } else {
            const payload = {
                suppliername: formData.name,
                contactname: formData.contactname,
                phonenumber: formData.phone,
                email: formData.email,
                address: formData.address,
                productids: formData.products.map(p => p.productid),
            };

            const result = await postSuppliers(payload);

            if (result.ok) {
                onSubmit({ ...formData, supplierid: result.data?.supplierid }, false);
                onClose();
            } else {
                toast.error('Không thể thêm nhà cung cấp: ' + (result.message || ''));
            }
        }
        setLoading(false);
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                <div
                    ref={modalRef}
                    className="bg-white rounded-xl w-full max-w-xl max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden p-6 border border-gray-300 shadow-xl"
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
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Số điện thoại</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-1">Tên người liên hệ</label>
                            <input
                                name="contactname"
                                value={formData.contactname}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-1">Email</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm mb-1">Địa chỉ</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        {!editData && (
                            <>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm mb-1">Chọn sản phẩm cung cấp</label>
                                    <div className="flex flex-col sm:flex-row gap-2">
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
                                </div>

                                {formData.products.length > 0 && (
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm mb-1 mt-2">Sản phẩm đã chọn</label>
                                        <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
                                            {formData.products.map((p) => (
                                                <span
                                                    key={p.productid}
                                                    className="inline-flex items-center gap-1 bg-gray-200 text-sm px-2 py-1 rounded max-w-full truncate"
                                                >
                                                    <span className="truncate">{p.productname}</span>
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
                            </>
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
