'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import FoodModal from './AddFood';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';

export interface FoodItem{
    name: string;
    sellingprice: number;
    costprice: number;
    category: string;
    lot: string;
    expiry: string;
    stock: number;
    image: string;
    status?: string;
    discount?: number;
}

const rawData: FoodItem[] = [
    { name: 'Set cá viên chiên', category: 'Đồ ăn', sellingprice: 50000, costprice: 40000, lot: '3', expiry: '2024-12-12', stock: 80, image: '/default.png', discount: 0 },
    { name: 'Set cá viên chiên cay', category: 'Đồ ăn', sellingprice: 70000, costprice: 60000, lot: '3', expiry: '2024-12-12', stock: 60, image: '/default.png', discount: 0 },
    { name: 'Snack O’Star', category: 'Đồ ăn', sellingprice: 25000, costprice: 20000, lot: '2', expiry: '2024-12-12', stock: 35, image: '/default.png', discount: 0 },
    { name: 'Revive', category: 'Đồ uống', sellingprice: 15000, costprice: 10000, lot: '3', expiry: '2025-12-12', stock: 25, image: '/default.png', discount: 0 },
    { name: 'Pocari', category: 'Đồ uống', sellingprice: 15000, costprice: 10000, lot: '1', expiry: '2024-05-10', stock: 22, image: '/default.png', discount: 0 },
    { name: 'Pocari', category: 'Đồ uống', sellingprice: 15000, costprice: 10000, lot: '2', expiry: '2025-06-28', stock: 30, image: '/default.png', discount: 0.1 },
];

const processDataWithStatus = (data: FoodItem[]) => {
    const today = new Date();
    const soonThreshold = 30;

    return data.map((item) => {
        const expiryDate = new Date(item.expiry);
        const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

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
    const [filteredData, setFilteredData] = useState<FoodItem[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState<FoodItem | null>(null);
    const [openOrderForm, setOpenOrderForm] = useState(false);
    const [selectedOrderItem, setSelectedOrderItem] = useState<FoodItem | null>(null);

    const [filters, setFilters] = useState<Record<string, any>>({
        name: '',
        category: [],
        price: [0, 1000],
        lot: [],
      });

    // Process data and initialize filters
    useEffect(() => {
        const processed = processDataWithStatus(rawData);
        setData(processed);

        const prices = processed.map((d) => d.sellingprice);
        setFilters((prev) => ({
            ...prev,
            price: [Math.min(...prices), Math.max(...prices)],
        }));
    }, []);

    // Filter data whenever filters or data change
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
        { header: 'Giá nhập / sản phẩm', accessor: (item) => `${item.costprice.toLocaleString('vi-VN')} VND` },
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
        {header: 'Giảm giá', accessor: (item) => item.discount ? `${(item.discount * 100).toFixed(0)}%` : 'Không có', align: 'center' },
    ];

    const handleEdit = (index: number) => {
        const item = filteredData[index];
        setEditData({
            name: item.name,
            category: item.category,
            sellingprice: item.sellingprice,
            costprice: item.costprice,
            lot: item.lot,
            expiry: item.expiry,
            stock: item.stock,
            image: item.image,
            discount: item.discount || 0,
        });
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
            name: formData.name,
            category: formData.category,
            lot: formData.lot,
            expiry: formData.expiry,
            sellingprice: Number(formData.sellingprice),
            costprice: Number(formData.costprice),
            stock: Number(formData.stock),
            image: '/default.png',
        };

        if (editData) {
            // Edit mode
            const updated = data.map((item) => (item.name === editData.name ? newFood : item));
            setData(updated);
        } else {
            // Add mode
            setData([...data, newFood]);
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
