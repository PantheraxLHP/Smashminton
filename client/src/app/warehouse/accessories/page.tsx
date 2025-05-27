'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import SidebarFilter from '../../../components/warehouse/SidebarFilter';
import DataTable, { Column, FilterConfig } from '../../../components/warehouse/DataTable';
import AccessoryModal, { AccessoryFormData } from './AddAccessories';

interface Accessory {
    name: string;
    category: string;
    brand: string;
    distributor: string;
    price: number;
    weight: number;
    stock: number;
    image: string;
}

const initialData: Accessory[] = [
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

export default function AccessoryManagementPage() {
    const [data, setData] = useState<Accessory[]>(initialData);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [openModal, setOpenModal] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

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
            options: getUniqueOptions(data, 'category'),
        },
        {
            key: 'brand',
            title: 'Thương hiệu',
            type: 'checkbox',
            options: getUniqueOptions(data, 'brand'),
        },
        {
            key: 'price',
            title: 'Giá (VNĐ)',
            type: 'range',
            min: 10000,
            max: 1000000,
        },
    ];

    // Initialize filters once based on filterConfig
    useEffect(() => {
        const initial: Record<string, any> = {};
        filtersConfig.forEach((c) => {
            if (c.type === 'search') initial[c.key] = '';
            if (c.type === 'checkbox') initial[c.key] = [];
            if (c.type === 'range') initial[c.key] = [c.min, c.max];
        });
        setFilters(initial);
    }, []);

    const columns: Column<Accessory>[] = [
        { header: 'Tên sản phẩm', accessor: 'name' },
        { header: 'Loại', accessor: 'category' },
        { header: 'Thương hiệu', accessor: 'brand' },
        { header: 'Phân phối', accessor: 'distributor' },
        {
            header: 'Giá (VNĐ)',
            accessor: (item) => item?.price != null ? `${item.price.toLocaleString('vi-VN')} ₫` : '—',
            align: 'right',
        },
        { header: 'Lô hàng', accessor: 'weight', align: 'center' },
        { header: 'Tồn kho', accessor: 'stock', align: 'center' },
    ];

    const filteredData = data
        .filter((item): item is Accessory => item !== undefined && item !== null && typeof item.price === 'number')
        .filter((item) => {
            const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesBrand = !filters.brand || filters.brand.length === 0 || filters.brand.includes(item.brand);
            const matchesCategory = !filters.category || filters.category.length === 0 || filters.category.includes(item.category);
            const matchesPrice =
                Array.isArray(filters.price) &&
                    filters.price.length === 2 &&
                    typeof filters.price[0] === 'number' &&
                    typeof filters.price[1] === 'number'
                    ? item.price >= filters.price[0] && item.price <= filters.price[1]
                    : true;

            return matchesName && matchesBrand && matchesCategory && matchesPrice;
        });


    const handleEdit = (index: number) => {
        setEditIndex(index);
        setOpenModal(true);
    };

    const handleDelete = (index: number) => {
        const item = filteredData[index];
        const confirmed = window.confirm(`Xác nhận xóa phụ kiện: ${item.name}?`);
        if (confirmed) {
            const realIndex = data.findIndex((d) => d.name === item.name);
            if (realIndex !== -1) {
                const newData = [...data];
                newData.splice(realIndex, 1);
                setData(newData);
            }
        }
    };

    const handleSubmit = (formData: AccessoryFormData) => {
        const newAccessory: Accessory = {
            name: formData.name,
            category: formData.category,
            brand: formData.brand,
            distributor: formData.distributor,
            price: Number(formData.price),
            stock: Number(formData.stock),
            weight: 1,
            image: '/default.png',
        };

        if (editIndex !== null) {
            const realIndex = data.findIndex((d) => d.name === filteredData[editIndex].name);
            if (realIndex !== -1) {
                const updated = [...data];
                updated[realIndex] = newAccessory;
                setData(updated);
            }
        } else {
            setData([...data, newAccessory]);
        }

        setOpenModal(false);
        setEditIndex(null);
    };
    

    return (
        <div className="flex flex-col lg:flex-row h-full w-full p-4 gap-4">
            <AccessoryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleSubmit}
            />

            {/* Mobile Filter Toggle */}
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
                <div className="hidden lg:flex justify-end mb-2 pr-4">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
                    >
                        Thêm
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    renderImage={(item) => (
                        <Image src={item.image} alt={item.name} width={40} height={40} />
                    )}
                />
            </div>
        </div>
    );
}
