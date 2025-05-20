'use client';

import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import MoreActionsMenu from './MoreActionsMenu'; // Đảm bảo đúng đường dẫn

const dummyData = [
    {
        name: 'Ống cầu Taro',
        category: 'Quả cầu lông',
        brand: 'Taro',
        distributor: 'VNB',
        price: 245000,
        weight: 1,
        stock: 20,
        image: '/taroShuttlecock.png',
    },
    {
        name: 'Quấn cán Yonex',
        category: 'Quấn cán',
        brand: 'Yonex',
        distributor: 'Đại Hưng',
        price: 40000,
        weight: 2,
        stock: 50,
        image: '/racketgrip.png',
    },
];

export default function AccessoryList({ filters }: { filters: any }) {
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const filtered = dummyData.filter(item => {
        const matchSearch = filters.search === '' || item.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchCategory = filters.categories.length === 0 || filters.categories.includes(item.category);
        const matchBrand = filters.brands.length === 0 || filters.brands.includes(item.brand);
        const matchPrice = item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];
        return matchSearch && matchCategory && matchBrand && matchPrice;
    });

    return (
        <div className="p-4 sm:p-6">
            <div className="max-w-[calc(100vw-70px)] overflow-x-auto rounded border border-primary-200">
                <table className="w-full text-sm">
                    <thead className="bg-primary-50 text-left text-gray-700">
                        <tr>
                            <th className="px-3 py-2 font-medium">Sản phẩm</th>
                            <th className="px-3 py-2 font-medium">Loại</th>
                            <th className="px-3 py-2 font-medium">Thương hiệu</th>
                            <th className="px-3 py-2 font-medium">Phân phối</th>
                            <th className="px-3 py-2 font-medium text-right">Giá</th>
                            <th className="px-3 py-2 font-medium text-center">Lô hàng</th>
                            <th className="px-3 py-2 font-medium text-center">Tồn kho</th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item, idx) => (
                            <tr key={idx} className="border-t hover:bg-gray-50 transition">
                                <td className="px-3 py-3 flex items-center gap-2">
                                    <input type="checkbox" className="accent-primary-600" />
                                    <img
                                        src={item.image || '/placeholder-food.png'}
                                        alt={item.name}
                                        className="w-8 h-8 rounded object-cover"
                                    />
                                    {item.name}
                                </td>
                                <td className="px-3 py-3">{item.category}</td>
                                <td className="px-3 py-3">{item.brand}</td>
                                <td className="px-3 py-3">{item.distributor}</td>
                                <td className="px-3 py-3 text-right">{item.price.toLocaleString('vi-VN')} VND</td>
                                <td className="px-3 py-3 text-center">{item.weight}</td>
                                <td className="px-3 py-3 text-center">{item.stock}</td>
                                <td className="px-3 py-3 text-right relative">
                                    <button
                                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setSelectedItemIndex(idx);
                                            setMenuPosition({
                                                x: rect.left - 40,
                                                y: rect.bottom + 5,
                                            });
                                        }}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {menuPosition !== null && (
                <MoreActionsMenu
                    position={menuPosition}
                    onClose={() => {
                        setMenuPosition(null);
                        setSelectedItemIndex(null);
                    }}
                    onEdit={() => {
                        const item = filtered[selectedItemIndex!];
                        console.log('Sửa:', item);
                        // TODO: mở modal sửa nếu có
                    }}
                    onDelete={() => {
                        const item = filtered[selectedItemIndex!];
                        console.log('Xoá:', item);
                        // TODO: xoá khỏi danh sách
                    }}
                />
            )}
        </div>
    );
}
