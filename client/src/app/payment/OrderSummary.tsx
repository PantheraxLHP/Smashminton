'use client';

import { useBooking } from '@/context/BookingContext';
import { formatDate, formatPrice } from '@/lib/utils';
import { getSingleProduct } from '@/services/products.service';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

export default function OrderSummary() {
    const { addProductItem, removeProduct, totalCourtPrice, totalProductPrice, selectedCourts, selectedProducts } =
        useBooking();
    const [loadingProducts, setLoadingProducts] = useState<Set<number>>(new Set());
    const getSelectedProductQuantity = (productid: number) => {
        const product = selectedProducts.find((p) => p.productid === productid);
        return product ? product.quantity : 0;
    };

    const getProductStockQuantity = async (productId: number) => {
        const result = await getSingleProduct(productId);
        if (result.ok) {
            return result.data.quantity;
        }
        return 0;
    };

    const handleQuantityChange = async (productId: number, delta: number) => {
        // Prevent multiple clicks
        if (loadingProducts.has(productId)) {
            return;
        }

        // Add product to loading state
        setLoadingProducts((prev) => new Set(prev).add(productId));

        try {
            if (delta > 0) {
                const productStock = await getProductStockQuantity(productId);
                const currentQuantity = getSelectedProductQuantity(productId);
                if (currentQuantity + 1 > productStock) {
                    toast.warning('Số lượng sản phẩm đã đạt giới hạn');
                    return;
                }
                await addProductItem(productId);
            } else {
                if (getSelectedProductQuantity(productId) == 0) {
                    return;
                }
                await removeProduct(productId);
            }
        } finally {
            // Remove product from loading state
            setLoadingProducts((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };
    const totalPrice = totalCourtPrice + totalProductPrice;

    return (
        <table className="text-md w-full text-center">
            <thead className="border-b border-black">
                <tr className="text-xs">
                    <th className="px-2 py-3 text-left">MÔ TẢ</th>
                    <th className="px-2 py-3">SỐ LƯỢNG</th>
                    <th className="px-2 py-3">THỜI GIAN</th>
                    <th className="px-2 py-3">THỜI LƯỢNG</th>
                    <th className="px-2 py-3">ĐƠN GIÁ</th>
                    <th className="px-2 py-3">THÀNH TIỀN</th>
                </tr>
            </thead>
            <tbody>
                {/* Courts */}
                {selectedCourts.map((court, index) => (
                    <tr key={`court-${index}`} className="border-b">
                        <td className="flex items-center gap-2 px-2 py-3 text-left">
                            <Image src={court.courtimgurl || '/default.png'} alt="icon" width={24} height={24} />
                            {court.courtname}
                        </td>
                        <td className="px-2 py-3">1</td>
                        <td className="px-2 py-3">
                            {formatDate(court.date)} {court.starttime}
                        </td>
                        <td className="px-2 py-3">{court.duration} giờ</td>
                        <td className="px-2 py-3">{formatPrice(court.price / court.duration)}</td>
                        <td className="px-2 py-3">{formatPrice(court.price)}</td>
                    </tr>
                ))}

                {/* Products */}
                {selectedProducts.map((product) => (
                    <tr key={`product-${product.productid}`} className="border-b">
                        <td className="flex items-center gap-2 px-2 py-3 text-left">
                            <Image src={product.productimgurl || '/default.png'} alt="icon" width={24} height={24} />
                            {product.productname}
                        </td>
                        <td className="px-2 py-3">
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    disabled={loadingProducts.has(product.productid)}
                                    onClick={() => handleQuantityChange(product.productid, -1)}
                                    className="rounded border px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                                >
                                    –
                                </button>
                                <span className="min-w-[24px] text-center">
                                    {getSelectedProductQuantity(product.productid) || 1}
                                </span>
                                <button
                                    disabled={loadingProducts.has(product.productid)}
                                    onClick={() => handleQuantityChange(product.productid, 1)}
                                    className="rounded border px-2 py-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                                >
                                    +
                                </button>
                            </div>
                        </td>
                        <td className="px-2 py-3"></td>
                        <td className="px-2 py-3"></td>
                        <td className="px-2 py-3">{formatPrice(product.unitprice)}</td>
                        <td className="px-2 py-3">
                            {formatPrice(product.unitprice * (getSelectedProductQuantity(product.productid) || 1))}
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="border-t border-black">
                    <td colSpan={5} className="px-2 py-3 pr-14 text-right font-semibold">
                        TỔNG TIỀN
                    </td>
                    <td className="px-2 py-3">{formatPrice(totalPrice)}</td>
                </tr>
            </tfoot>
        </table>
    );
}
