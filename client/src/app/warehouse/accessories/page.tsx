'use client';

import { useState } from 'react';
import Image from 'next/image';
import SidebarFilter from '../SidebarFilter';
import DataTable, { Column, FilterConfig } from '../DataTable';
import AccessoryModal from './AddAccessories';

interface Accessory {
    name: string;
    category: string;
    brand: string;
    distributor: string;
    price: number; // đơn vị: đồng
    weight: number;
    stock: number;
    image: string;
}

const dummyData: Accessory[] = [
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

function getUniqueOptions<T>(data: T[], key: keyof T): string[] {
    return Array.from(new Set(data.map((item) => item[key] as string))).sort();
}

const filtersConfig: FilterConfig[] = [
    {
        key: 'name',
        type: 'search',
        placeholder: 'Tìm theo tên',
    },
    {
        key: 'category',
        title: 'Loại sản phẩm',
        type: 'checkbox',
        options: getUniqueOptions(dummyData, 'category'),
    },
    {
        key: 'brand',
        title: 'Thương hiệu',
        type: 'checkbox',
        options: getUniqueOptions(dummyData, 'brand'),
    },
    {
        key: 'price',
        title: 'Giá (VNĐ)',
        type: 'range',
        min: 10000,
        max: 1000000,
    },
];

export default function AccessoryManagementPage() {
    const [openModal, setOpenModal] = useState(false);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const initialFilters: Record<string, any> = {};
    filtersConfig.forEach((c) => {
        if (c.type === 'search') initialFilters[c.key] = '';
        if (c.type === 'checkbox') initialFilters[c.key] = [];
        if (c.type === 'range') initialFilters[c.key] = [c.min, c.max];
    });

    const [filters, setFilters] = useState<Record<string, any>>(initialFilters);


    const columns: Column<Accessory>[] = [
        { header: 'Tên sản phẩm', accessor: 'name' },
        { header: 'Loại', accessor: 'category' },
        { header: 'Thương hiệu', accessor: 'brand' },
        { header: 'Phân phối', accessor: 'distributor' },
        {
            header: 'Giá (VNĐ)',
            accessor: (item) => `${item.price.toLocaleString('vi-VN')} ₫`,
            align: 'right',
        },
        { header: 'Lô hàng', accessor: 'weight', align: 'center' },
        { header: 'Tồn kho', accessor: 'stock', align: 'center' },
    ];

    const filteredData = dummyData.filter((item) => {
        const matchesName =
            !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());

        const matchesBrand =
            filters.brand.length === 0 || filters.brand.includes(item.brand);
        
        const matchesCategory =
            filters.category.length === 0 || filters.category.includes(item.category);

        const matchesPrice =
            item.price >= filters.price[0] && item.price <= filters.price[1];

        return matchesName && matchesBrand && matchesPrice && matchesCategory;
    });

    return (
        <div className="flex flex-col lg:flex-row h-full w-full p-4 gap-4">
            <AccessoryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={(data) => console.log('Phụ kiện mới:', data)}
            />

            {/* Mobile/Tablet Filter Toggle */}
            <div className="flex justify-between items-center mb-2 lg:hidden">
                <button
                    onClick={() => setShowMobileFilter((prev) => !prev)}
                    className="bg-gray-200 px-3 py-2 rounded"
                >
                    {showMobileFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                </button>

                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
                >
                    Thêm
                </button>
            </div>

            {/* Sidebar Filter */}
            <div className={`w-full lg:w-[280px] shrink-0 ${showMobileFilter ? 'block' : 'hidden'} lg:block`}>
                <SidebarFilter filters={filters} setFilters={setFilters} config={filtersConfig} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Desktop "Thêm" Button */}
                <div className="hidden lg:flex justify-end mb-2 pr-4">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
                    >
                        Thêm
                    </button>
                </div>

                {/* Data Table */}
                <DataTable
                    columns={columns}
                    data={filteredData}
                    renderImage={(item) => (
                        <Image src={item.image} alt={item.name} width={40} height={40} />
                    )}
                />
            </div>
        </div>
    );
}
