'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import FoodModal from './AddFood';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';

export interface FoodItem {
    id: number;
    name: string;
    sellingprice: number;
    category: string;
    lot: string;
    expiry: string;
    stock: number;
    image: string;
    status?: string;
    discount?: number;
}

const rawData: FoodItem[] = [
    { id: 1, name: 'Set cá viên chiên', category: 'Đồ ăn', sellingprice: 50000, lot: '3', expiry: '2024-12-12', stock: 80, image: '/default.png', status: 'Hết hạn', discount: 0 },
    { id: 2, name: 'Set cá viên chiên cay', category: 'Đồ ăn', sellingprice: 70000, lot: '3', expiry: '2024-12-12', stock: 60, image: '/default.png', status: 'Hết hạn', discount: 0 },
    { id: 3, name: 'Snack O’Star', category: 'Đồ ăn', sellingprice: 25000, lot: '2', expiry: '2024-12-12', stock: 35, image: '/default.png', status: 'Hết hạn', discount: 0 },
    { id: 4, name: 'Revive', category: 'Đồ uống', sellingprice: 15000, lot: '3', expiry: '2025-12-12', stock: 25, image: '/default.png', status: 'Còn hạn', discount: 0 },
    { id: 5, name: 'Pocari', category: 'Đồ uống', sellingprice: 15000, lot: '1', expiry: '2024-05-10', stock: 22, image: '/default.png', status: 'Hết hạn', discount: 0 },
    { id: 6, name: 'Pocari', category: 'Đồ uống', sellingprice: 15000, lot: '2', expiry: '2025-06-28', stock: 30, image: '/default.png', status: 'Sắp hết hạn', discount: 0.1 },
];

const getUniqueOptions = (data: FoodItem[], key: keyof FoodItem) => {
    return Array.from(new Set(data.map((item) => item[key]))).filter(Boolean) as string[];
};

export default function FoodAndBeveragePage() {
    const [data, setData] = useState<FoodItem[]>(rawData);
    const [filteredData, setFilteredData] = useState<FoodItem[]>(rawData);
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState<FoodItem | null>(null);
    const [openOrderForm, setOpenOrderForm] = useState(false);
    const [selectedOrderItem, setSelectedOrderItem] = useState<FoodItem | null>(null);

    const [filters, setFilters] = useState<Record<string, any>>({
        name: '',
        category: [],
        price: [0, 100000],
        lot: [],
    });

    useEffect(() => {
        const result = data.filter((item) => {
            const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesCategory = filters.category.length === 0 || filters.category.includes(item.category);
            const matchesPrice =
                Array.isArray(filters.price) &&
                filters.price.length === 2 &&
                item.sellingprice >= filters.price[0] &&
                item.sellingprice <= filters.price[1];
            const matchesLot = filters.lot.length === 0 || filters.lot.includes(item.lot);

            return matchesName && matchesCategory && matchesPrice && matchesLot;
        });
        setFilteredData(result);
    }, [filters, data]);

    const categoryOptions: FilterOption[] = getUniqueOptions(data, 'category').map((option) => ({
        optionlabel: option,
        optionvalue: option,
    }));
    const lotOptions: FilterOption[] = getUniqueOptions(data, 'lot').map((option) => ({
        optionlabel: option,
        optionvalue: option,
    }));

    const filtersConfig: FilterConfig[] = [
        { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
        { filterid: 'name', filtertype: 'search', filterlabel: 'Tìm kiếm' },
        { filterid: 'category', filterlabel: 'LOẠI', filtertype: 'checkbox', filteroptions: categoryOptions },
        { filterid: 'price', filterlabel: 'KHOẢNG GIÁ', filtertype: 'range', rangemin: 0, rangemax: 100000 },
        { filterid: 'lot', filterlabel: 'Lô hàng', filtertype: 'checkbox', filteroptions: lotOptions },
    ];

    const columns: Column<FoodItem>[] = [
        { header: 'Tên sản phẩm', accessor: 'name' },
        { header: 'Loại', accessor: 'category' },
        { header: 'Giá bán / sản phẩm', accessor: (item) => `${item.sellingprice.toLocaleString('vi-VN')} VND` },
        { header: 'Lô Hàng', accessor: 'lot', align: 'center' },
        { header: 'Ngày hết hạn', accessor: (item) => new Date(item.expiry).toLocaleDateString('vi-VN'), align: 'center' },
        { header: 'Tồn kho', accessor: 'stock', align: 'center' },
        {
            header: 'Tình trạng',
            accessor: (item) => item.status || '',
            align: 'center',
            className: (item) =>
                item.status === 'Sắp hết hạn'
                    ? 'text-yellow-600'
                    : item.status === 'Hết hạn'
                        ? 'text-red-600'
                        : 'text-green-600',
        },
        {
            header: 'Giảm giá',
            accessor: (item) => item.discount ? `${(item.discount * 100).toFixed(0)}%` : 'Không có',
            align: 'center',
        },
    ];

    const handleEdit = (index: number) => {
        const item = filteredData[index];
        setEditData(item);
        setOpenModal(true);
    };

    const handleDelete = (index: number) => {
        const item = filteredData[index];
        if (window.confirm(`Xác nhận xóa sản phẩm: ${item.name}?`)) {
            const newData = data.filter((d) => d.name !== item.name);
            setData(newData);
        }
    };

    const handleOrder = (index: number) => {
        setSelectedOrderItem(filteredData[index]);
        setOpenOrderForm(true);
    };

    const handleSubmit = (formData: FoodItem) => {
        const newFood: FoodItem = {
            ...formData,
            image: formData.image || '/default.png',
        };

        if (editData) {
            const updated = data.map((item) => item.id === editData.id ? newFood : item);
            setData(updated);
        } else {
            const newId = Math.max(0, ...data.map(d => d.id ?? 0)) + 1;
            setData([...data, { ...newFood, id: newId }]);
        }

        setEditData(null);
        setOpenModal(false);
    };
    

    return (
        <div className="flex h-full w-full flex-col gap-4 p-6 lg:flex-row">
            <FoodModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditData(null);
                }}
                onSubmit={handleSubmit}
                editData={editData}
            />

            <div className="w-full shrink-0 lg:w-[280px]">
                <Filter
                    filters={filtersConfig}
                    values={filters}
                    setFilterValues={setFilters}
                />
            </div>

            <div className="flex flex-1 flex-col">
                <div className="mb-2 flex justify-end">
                    <button
                        onClick={() => {
                            setOpenModal(true);
                            setEditData(null);
                        }}
                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                        Thêm sản phẩm
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    renderImage={(item) => <Image src={item.image} alt={item.name} width={40} height={40} />}
                    showOptions
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onOrder={handleOrder}
                    showMoreOption
                    showHeader
                />
            </div>

            {openOrderForm && selectedOrderItem && (
                <PurchaseOrderForm
                    open={openOrderForm}
                    onClose={() => setOpenOrderForm(false)}
                    item={selectedOrderItem}
                />
            )}
        </div>
    );
}
