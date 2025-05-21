'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import SidebarFilter from '../SidebarFilter';
import DataTable, { Column, FilterConfig } from '../DataTable';

interface FoodItem {
    name: string;
    category: string;
    price: number;
    lot: string;
    expiry: string;
    stock: number;
    image: string;
    status?: string; // sẽ được tính toán sau
}

// ✅ Dữ liệu "thô" như từ backend (chưa có status)
const rawData: FoodItem[] = [
    {
        name: 'Set cá viên chiên',
        category: 'Đồ ăn',
        price: 50000,
        lot: '3',
        expiry: '2024-12-12',
        stock: 80,
        image: '/setcavienchien.png',
    },
    {
        name: 'Set cá viên chiên cay',
        category: 'Đồ ăn',
        price: 70000,
        lot: '3',
        expiry: '2024-12-12',
        stock: 60,
        image: '/setcavienchienchuacay.png',
    },
    {
        name: 'Snack O’Star',
        category: 'Snack',
        price: 25000,
        lot: '2',
        expiry: '2024-12-12',
        stock: 35,
        image: '/ostar.png',
    },
    {
        name: 'Revive',
        category: 'Nước uống',
        price: 15000,
        lot: '3',
        expiry: '2025-12-12',
        stock: 25,
        image: '/revive.png',
    },
    {
        name: 'Pocari (Hết hạn)',
        category: 'Nước uống',
        price: 15000,
        lot: '1',
        expiry: '2024-05-10',
        stock: 22,
        image: '/pocarisweat.png',
    },
    {
        name: 'Pocari (Sắp hết hạn)',
        category: 'Nước uống',
        price: 15000,
        lot: '2',
        expiry: '2025-05-28',
        stock: 30,
        image: '/pocarisweat.png',
    },
];

// ✅ Hàm xử lý dữ liệu: thêm status dựa trên expiry
const processDataWithStatus = (data: FoodItem[]): FoodItem[] => {
    const today = new Date();
    const soonThreshold = 30; // ngày sắp hết hạn trong vòng 30 ngày

    return data.map((item) => {
        const expiryDate = new Date(item.expiry);
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status = '';
        if (diffDays < 0) status = 'Hết hạn';
        else if (diffDays <= soonThreshold) status = 'Sắp hết hạn';
        else status = 'Còn hạn';

        return { ...item, status };
    });
};

const getUniqueOptions = (data: FoodItem[], key: keyof FoodItem) => {
    return Array.from(new Set(data.map((item) => item[key]))).filter(Boolean) as string[];
};

export default function FoodAndBeveragePage() {
    const [data, setData] = useState<FoodItem[]>([]);
    const [filters, setFilters] = useState<Record<string, any>>({
        name: '',
        category: [],
        price: [0, 100000],
        lot: [],
    });

    useEffect(() => {
        const fetchedData = processDataWithStatus(rawData);
        setData(fetchedData);

        // cập nhật filters nếu muốn giá trị price đúng theo data
        const minPrice = Math.min(...rawData.map(d => d.price));
        const maxPrice = Math.max(...rawData.map(d => d.price));

        setFilters(prev => ({
            ...prev,
            price: [minPrice, maxPrice],
        }));
    }, []);
    

    const categoryOptions = getUniqueOptions(data, 'category');
    const lotOptions = getUniqueOptions(data, 'lot');

    const filtersConfig: FilterConfig[] = [
        { key: 'name', type: 'search', placeholder: 'Tìm kiếm' },
        { key: 'category', title: 'LOẠI', type: 'checkbox', options: categoryOptions },
        { key: 'price', title: 'KHOẢNG GIÁ', type: 'range', min: 0, max: 100000 },
        { key: 'lot', title: 'Lô hàng', type: 'checkbox', options: lotOptions },
    ];

    const filteredData = data.filter((item) => {
        if (!filters.price || !Array.isArray(filters.price)) return true;

        const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
        const matchesCategory = !filters.category?.length || filters.category.includes(item.category);
        const matchesPrice = item.price >= filters.price[0] && item.price <= filters.price[1];
        const matchesLot = !filters.lot?.length || filters.lot.includes(item.lot);
        return matchesName && matchesCategory && matchesPrice && matchesLot;
    });
    

    const columns: Column<FoodItem>[] = [
        { header: 'Tên sản phẩm', accessor: 'name' },
        { header: 'Loại', accessor: 'category' },
        {
            header: 'Giá / đơn vị tính',
            accessor: (item) =>
                item?.price != null
                    ? `${item.price.toLocaleString('vi-VN')} VND`
                    : '—',
        }          ,
        { header: 'Lô Hàng', accessor: 'lot', align: 'center' },
        { header: 'Ngày hết hạn', accessor: (item) => new Date(item.expiry).toLocaleDateString('vi-VN'), align: 'center' },
        { header: 'Tồn kho', accessor: 'stock', align: 'center' },
        {
            header: 'Tình trạng',
            accessor: (item) => item.status || '',
            align: 'center',
            className: (item) =>
                item.status === 'Sắp hết hạn'
                    ? 'text-yellow-600 px-2 py-1 rounded'
                    : item.status === 'Hết hạn'
                        ? 'text-red-600 px-2 py-1 rounded'
                        : 'text-green-600 px-2 py-1 rounded',
        },
    ];

    return (
        <div className="flex flex-col lg:flex-row h-full w-full p-4 gap-4">
            <div className="w-full lg:w-[280px] shrink-0">
                <SidebarFilter filters={filters} setFilters={setFilters} config={filtersConfig} />
            </div>

            <div className="flex-1 flex flex-col">
                <div className="flex justify-end mb-2 pr-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Thêm</button>
                </div>

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
