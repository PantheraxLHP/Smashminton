'use client';

import React from 'react';

export type FoodFilters = {
    search: string;
    categories: string[];
    brands: string[];
    priceRange: [number, number];
};

interface FilterSidebarProps {
    filters: FoodFilters;
    setFilters: React.Dispatch<React.SetStateAction<FoodFilters>>;
}

const allCategories = ['Quả cầu lông', 'Quần cán', 'Vớ'];
const allBrands = ['Taro', 'Yonex', 'Kitawa'];

export default function AccessoryFilter({ filters, setFilters }: FilterSidebarProps) {
    const handleToggle = (key: 'categories' | 'brands', value: string) => {
        setFilters((prev) => {
            const current = prev[key];
            const newList = current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value];
            return { ...prev, [key]: newList };
        });
    };

    const clearAll = () => {
        setFilters({
            search: '',
            categories: [],
            brands: [],
            priceRange: [0, 1000000],
        });
    };

    return (
        <div className="w-full space-y-4">
            <div className="rounded-lg border bg-white p-4 shadow-sm space-y-6 text-sm">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="w-full pl-10 pr-3 py-2 border rounded text-sm bg-gray-50"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>

                <div className="border-b-2 border-gray-800 pb-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-primary-600 text-lg font-semibold">Đã chọn</h3>
                        <button onClick={clearAll} className="text-sm text-gray-500 hover:underline">
                            Bỏ hết X
                        </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs min-h-[24px]">
                        {filters.categories.map((item) => (
                            <span key={item} className="text-primary-600 rounded bg-primary-100 px-2 py-1">{item}</span>
                        ))}
                        {filters.brands.map((item) => (
                            <span key={item} className="text-primary-600 rounded bg-primary-100 px-2 py-1">{item}</span>
                        ))}
                    </div>
                </div>

                {/* Danh mục */}
                <div className="border-b-2 border-gray-800 pb-3">
                    <h3 className="mb-2 text-lg font-semibold">LOẠI</h3>
                    {allCategories.map((cat) => (
                        <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(cat)}
                                onChange={() => handleToggle('categories', cat)}
                                className="cursor-pointer"
                            />
                            <span>{cat}</span>
                        </label>
                    ))}
                </div>

                {/* Thương hiệu */}
                <div className="border-b-2 border-gray-800 pb-3">
                    <h3 className="mb-2 text-lg font-semibold">THƯƠNG HIỆU</h3>
                    {allBrands.map((brand) => (
                        <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={() => handleToggle('brands', brand)}
                                className="cursor-pointer"
                            />
                            <span>{brand}</span>
                        </label>
                    ))}
                </div>

                {/* Khoảng giá */}
                <div>
                    <h3 className="mb-2 text-lg font-semibold">KHOẢNG GIÁ</h3>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="number"
                            placeholder="Từ"
                            className="w-full border px-2 py-1 rounded"
                            value={filters.priceRange[0]}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    priceRange: [Number(e.target.value), filters.priceRange[1]],
                                })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Đến"
                            className="w-full border px-2 py-1 rounded"
                            value={filters.priceRange[1]}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    priceRange: [filters.priceRange[0], Number(e.target.value)],
                                })
                            }
                        />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1000000"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                priceRange: [filters.priceRange[0], Number(e.target.value)],
                            })
                        }
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}
