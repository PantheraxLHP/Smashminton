'use client';
import { FaSortAmountDownAlt } from 'react-icons/fa';

import { useState } from 'react';

type Props = {
    selectedCategory: 'Thuê vợt' | 'Thuê giày';
    filters: {
        brands: string[];
        weights?: string[];
        stiffness?: string[];
        balance?: string[];
        forms?: string[];
        sizes?: string[];
    };
};

type Item = {
    id: number;
    name: string;
    image: string;
    price: string;
    brand: string;
    weight?: string;
    stiffness?: string;
    balance?: string;
    form?: string;
    size?: string;
};

const racketItems: Item[] = Array.from({ length: 12 }, (_, index) => ({
    id: index,
    name: 'Vợt Yonex Nanoflare 001F 2025',
    image: '/ZoneC.png',
    price: '34,000 đ / giờ',
    brand: 'Yonex',
    weight: '4U: 80 - 84g',
    stiffness: 'Trung bình',
    balance: 'Cân bằng',
}));

const shoeItems: Item[] = Array.from({ length: 12 }, (_, index) => ({
    id: index + 100,
    name: 'Giày Lining Ranger V',
    image: '/ZoneA.png',
    price: '22,000 đ / giờ',
    brand: 'Lining',
    form: 'Unisex - Bản chân thường',
    size: '42',
}));

export default function RentalList({ selectedCategory, filters }: Props) {
    const [quantities, setQuantities] = useState<{ [id: number]: number }>({});
    const [sortOption, setSortOption] = useState<'default' | 'priceAsc' | 'priceDesc' | 'nameAsc'>('default');

    const items = selectedCategory === 'Thuê giày' ? shoeItems : racketItems;

    const filteredItems = items.filter((item) => {
        const matchBrand = filters.brands.length === 0 || filters.brands.includes(item.brand);

        if (selectedCategory === 'Thuê vợt') {
            const matchWeight = filters.weights?.length === 0 || filters.weights?.includes(item.weight!);
            const matchStiffness = filters.stiffness?.length === 0 || filters.stiffness?.includes(item.stiffness!);
            const matchBalance = filters.balance?.length === 0 || filters.balance?.includes(item.balance!);
            return matchBrand && matchWeight && matchStiffness && matchBalance;
        } else {
            const matchForm = filters.forms?.length === 0 || filters.forms?.includes(item.form!);
            const matchSize = filters.sizes?.length === 0 || filters.sizes?.includes(item.size!);
            return matchBrand && matchForm && matchSize;
        }
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        if (sortOption === 'priceAsc' || sortOption === 'priceDesc') {
            const getPrice = (priceStr: string) => parseInt(priceStr.replace(/[^\d]/g, ''));
            const priceA = getPrice(a.price);
            const priceB = getPrice(b.price);
            return sortOption === 'priceAsc' ? priceA - priceB : priceB - priceA;
        }
        if (sortOption === 'nameAsc') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    const handleQuantityChange = (id: number, delta: number) => {
        setQuantities((prev) => {
            const newQuantity = Math.max(0, (prev[id] || 0) + delta);
            return { ...prev, [id]: newQuantity };
        });
    };

    return (
        <div className="flex flex-col flex-1">
            {/* Dropdown sắp xếp */}
            <div className="flex justify-end px-4 mb-4">
                <div className="flex items-center gap-2">
                    <FaSortAmountDownAlt className="text-gray-700 text-sm" />
                    <span className="text-sm font-medium">Sắp xếp</span>
                    <select
                        className="w-28 border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring focus:ring-blue-200"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
                    >
                        <option value="default">Mặc định</option>
                        <option value="priceAsc">Giá tăng dần</option>
                        <option value="priceDesc">Giá giảm dần</option>
                        <option value="nameAsc">Sắp xếp theo tên (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 flex-1">
                {sortedItems.map((item) => (
                    <div
                        key={item.id}
                        className="p-2 text-center flex flex-col items-center border rounded-lg shadow-sm bg-white"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-40 object-contain mb-2"
                        />
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <p className="text-primary-600 font-semibold">{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="px-2 border rounded hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span>{quantities[item.id] || 0}</span>
                            <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="px-2 border rounded hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
                {sortedItems.length === 0 && (
                    <p className="col-span-full text-center text-sm text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
                )}
            </div>
        </div>
    );
}
