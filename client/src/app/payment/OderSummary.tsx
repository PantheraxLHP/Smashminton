'use client';

import { useBooking } from "@/context/BookingContext";
import Image from "next/image";

interface OrderSummaryProps {
    formatCurrency: (value: number) => string;
    productQuantities: Record<number, number>;
    setProductQuantities: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}

export default function OrderSummary({
    formatCurrency,
    productQuantities,
    setProductQuantities,
}: OrderSummaryProps) {
    const { selectedCourts, selectedProducts } = useBooking();

    const handleQuantityChange = (productId: number, delta: number) => {
        setProductQuantities((prev) => {
            const newQty = Math.max(1, (prev[productId] || 1) + delta);
            return { ...prev, [productId]: newQty };
        });
    };

    const courtTotal = selectedCourts.reduce((sum, court) => {
        const numericPrice = typeof court.price === "string"
            ? parseInt(court.price.replace(/[^\d]/g, ""), 10)
            : court.price;
        const duration = court.duration ?? 1;
        return sum + (isNaN(numericPrice) ? 0 : numericPrice * duration);
    }, 0);

    const productTotal = selectedProducts.reduce((sum, p) => {
        const quantity = productQuantities[p.productid] || 1;
        return sum + p.unitprice * quantity;
    }, 0);

    const total = courtTotal + productTotal;

    return (
        <table className="w-full text-md text-center min-w-[800px]">
            <thead className="border-b border-black bg-white">
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
                {selectedCourts.map((court, index) => (
                    <tr key={`court-${index}`} className="border-b">
                        <td className="px-2 py-3 flex items-center gap-2 text-left">
                            <Image src={court.courtimgurl || "/default.png"} alt="icon" width={24} height={24} />
                            {court.courtname}
                        </td>
                        <td className="px-2 py-3"></td>
                        <td className="px-2 py-3">{court.date} {court.starttime}</td>
                        <td className="px-2 py-3">{court.duration}</td>
                        <td className="px-2 py-3">
                            {formatCurrency(
                                typeof court.price === "string"
                                    ? parseInt(court.price.replace(/[^\d]/g, ""), 10)
                                    : court.price
                            )}
                        </td>
                        <td className="px-2 py-3">
                            {formatCurrency(
                                (typeof court.price === "string"
                                    ? parseInt(court.price.replace(/[^\d]/g, ""), 10)
                                    : court.price) * (court.duration ?? 1)
                            )}
                        </td>
                    </tr>
                ))}

                {selectedProducts.map((product) => (
                    <tr key={`product-${product.productid}`} className="border-b">
                        <td className="px-2 py-3 flex items-center gap-2 text-left">
                            <Image src={product.productimgurl || "/default.png"} alt="icon" width={24} height={24} />
                            {product.productname}
                        </td>
                        <td className="px-2 py-3">
                            <div className="flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleQuantityChange(product.productid, -1)}
                                    className="px-2 py-1 border rounded hover:bg-gray-100"
                                >–</button>
                                <span className="min-w-[24px] text-center">
                                    {productQuantities[product.productid] || 1}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange(product.productid, 1)}
                                    className="px-2 py-1 border rounded hover:bg-gray-100"
                                >+</button>
                            </div>
                        </td>
                        <td className="px-2 py-3"></td>
                        <td className="px-2 py-3"></td>
                        <td className="px-2 py-3">{formatCurrency(product.unitprice)}</td>
                        <td className="px-2 py-3">
                            {formatCurrency(product.unitprice * (productQuantities[product.productid] || 1))}
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="border-t border-black">
                    <td colSpan={5} className="px-2 py-3 text-right font-semibold pr-14">TỔNG TIỀN</td>
                    <td className="px-2 py-3">{formatCurrency(total)}</td>
                </tr>
            </tfoot>
        </table>
    );
}
