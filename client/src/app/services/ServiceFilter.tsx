"use client";

import { useState } from 'react';

const brands = ['Yonex', 'Lining', 'Victor'];
const weights = ['2U: 90 - 94g', '3U: 85 - 89g', '4U: 80 - 84g', '5U: 75 - 79g'];
const stiffness = ['Dẻo', 'Trung bình', 'Cứng'];
const balancePoints = ['Nhẹ đầu', 'Cân bằng', 'Nặng đầu'];

const ServiceFilter = () => {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
    const [selectedStiffness, setSelectedStiffness] = useState<string[]>([]);
    const [selectedBalance, setSelectedBalance] = useState<string[]>([]);

    const handleToggle = (item: string, list: string[], setList: (list: string[]) => void) => {
        setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
    };

    const clearAll = () => {
        setSelectedBrands([]);
        setSelectedWeights([]);
        setSelectedStiffness([]);
        setSelectedBalance([]);
    };

    return (
        <div className="space-y-4 w-full">
            {/* PHẦN 1: Danh mục sản phẩm */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold border-b pb-1">Danh mục sản phẩm</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li className="text-primary-600 font-semibold cursor-pointer">Thuê vợt</li>
                    <li className="cursor-pointer">Thuê giày</li>
                </ul>
            </div>

            {/* PHẦN 2: Bộ lọc */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
                {/* Bộ lọc đã chọn */}
                <div className="mb-4 border-b pb-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-primary-600">Bạn chọn</h3>
                        <button
                            onClick={clearAll}
                            className="text-xs text-gray-500 hover:underline"
                        >
                            Bỏ hết X
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs mt-2">
                        {selectedBrands.map((brand) => (
                            <span
                                key={brand}
                                className="bg-green-100 text-primary-600 px-2 py-1 rounded"
                            >
                                {brand}
                            </span>
                        ))}
                        {selectedStiffness.map((type) => (
                            <span
                                key={type}
                                className="bg-green-100 text-primary-600 px-2 py-1 rounded"
                            >
                                {type}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Filter sections */}
                <div className="space-y-4 text-sm">
                    {/* Thương hiệu */}
                    <div className='border-b pb-3'>
                        <h3 className="font-semibold mb-2">THƯƠNG HIỆU</h3>
                        {brands.map((brand) => (
                            <label key={brand} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => handleToggle(brand, selectedBrands, setSelectedBrands)}
                                />
                                <span>{brand}</span>
                            </label>
                        ))}
                    </div>

                    {/* Trọng lượng */}
                    <div className='border-b pb-3'>
                        <h3 className="font-semibold mb-2">TRỌNG LƯỢNG</h3>
                        {weights.map((w) => (
                            <label key={w} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedWeights.includes(w)}
                                    onChange={() => handleToggle(w, selectedWeights, setSelectedWeights)}
                                />
                                <span>{w}</span>
                            </label>
                        ))}
                    </div>

                    {/* Độ cứng */}
                    <div className='border-b pb-3'>
                        <h3 className="font-semibold mb-2">ĐỘ CỨNG ĐŨA</h3>
                        {stiffness.map((s) => (
                            <label key={s} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedStiffness.includes(s)}
                                    onChange={() => handleToggle(s, selectedStiffness, setSelectedStiffness)}
                                />
                                <span>{s}</span>
                            </label>
                        ))}
                    </div>

                    {/* Điểm cân bằng */}
                    <div>
                        <h3 className="font-semibold mb-2">ĐIỂM CÂN BẰNG</h3>
                        {balancePoints.map((b) => (
                            <label key={b} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={selectedBalance.includes(b)}
                                    onChange={() => handleToggle(b, selectedBalance, setSelectedBalance)}
                                />
                                <span>{b}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceFilter;
