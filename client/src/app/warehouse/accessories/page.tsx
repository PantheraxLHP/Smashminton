'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import AccessoryModal from './AddAccessories';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';

export interface Accessory{
    name: string;
    sellingprice: number;
    costprice: number;
    category: string;
    stock: number;
    image: string;
}
const rawData: Accessory[] = [
    { name: 'Grip Yonex', category: 'Grip', sellingprice: 50000, costprice: 40000, stock: 100, image: '/default.png'},
    { name: 'Grip Lining', category: 'Grip', sellingprice: 40000, costprice: 30000, stock: 80, image: '/default.png'},
    { name: 'Balo Yonex', category: 'Bag', sellingprice: 800000, costprice: 650000, stock: 20, image: '/default.png'},
    { name: 'Túi đựng vợt', category: 'Bag', sellingprice: 600000, costprice: 500000, stock: 15, image: '/default.png'},
    { name: 'Bình nước', category: 'Other', sellingprice: 100000, costprice: 90000, stock: 50, image: '/default.png'},
];

const getUniqueOptions = (data: Accessory[], key: keyof Accessory) => {
    return Array.from(new Set(data.map((item) => item[key]))).filter(Boolean) as string[];
};

export default function AccessoryPage() {
    const [data, setData] = useState<Accessory[]>([]);
    const [filteredData, setFilteredData] = useState<Accessory[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState<Accessory | null>(null);
    const [openOrderForm, setOpenOrderForm] = useState(false);
    const [selectedOrderItem, setSelectedOrderItem] = useState<Accessory | null>(null);

    const [filters, setFilters] = useState<Record<string, any>>({
        name: '',
        category: [],
        brand: [],
        price: [0, 1000000],
    });

    useEffect(() => {
        setData(rawData);
        const prices = rawData.map((d) => d.sellingprice);
        setFilters((prev) => ({
            ...prev,
            price: [Math.min(...prices), Math.max(...prices)],
        }));
    }, []);

    useEffect(() => {
        const result = data.filter((item) => {
            const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesCategory = filters.category.length === 0 || filters.category.includes(item.category);
            const matchesPrice =
                Array.isArray(filters.price) &&
                filters.price.length === 2 &&
                item.sellingprice >= filters.price[0] &&
                item.sellingprice <= filters.price[1];
            return matchesName && matchesCategory && matchesPrice;
        });
        setFilteredData(result);
    }, [filters, data]);
   
    const categoryOptions: FilterOption[] = getUniqueOptions(data, 'category').map((option) => ({
        optionlabel: option,
        optionvalue: option,
    }));

    const filtersConfig: FilterConfig[] = [
        { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
        { filterid: 'name', filtertype: 'search', filterlabel: 'Tìm kiếm' },
        { filterid: 'category', filterlabel: 'LOẠI', filtertype: 'checkbox', filteroptions: categoryOptions },
        { filterid: 'price', filterlabel: 'KHOẢNG GIÁ', filtertype: 'range', rangemin: 0, rangemax: 1000000 },
    ];

    const columns: Column<Accessory>[] = [
        { header: 'Tên phụ kiện', accessor: 'name' },
        { header: 'Loại', accessor: 'category' },
        { header: 'Giá bán', accessor: (item) => `${item.sellingprice.toLocaleString('vi-VN')} VND`, align: 'center' },
        { header: 'Giá nhập', accessor: (item) => `${item.costprice.toLocaleString('vi-VN')} VND`, align: 'center' },
        { header: 'Tồn kho', accessor: 'stock', align: 'center' },
    ];

    const handleEdit = (index: number) => {
        const item = filteredData[index];
        setEditData({
            name: item.name,
            category: item.category,
            sellingprice: item.sellingprice,
            stock: item.stock,
            costprice: item.costprice,
            image: item.image,
        });
        setOpenModal(true);
    };

    const handleDelete = (index: number) => {
        const item = filteredData[index];
        if (window.confirm(`Xác nhận xóa phụ kiện: ${item.name}?`)) {
            const newData = data.filter((d) => d.name !== item.name);
            setData(newData);
        }
    };

    const handleOrder = (index: number) => {
        setSelectedOrderItem(filteredData[index]);
        setOpenOrderForm(true);
    };

    const handleSubmit = (formData: Accessory) => {
        const newAccessory: Accessory = {
            name: formData.name,
            category: formData.category,
            sellingprice: Number(formData.sellingprice),
            stock: Number(formData.stock),
            image: formData.image || '/default.png',
            costprice: formData.costprice
        };

        if (editData) {
            const updated = data.map((item) => (item.name === editData.name ? newAccessory : item));
            setData(updated);
        } else {
            setData([...data, newAccessory]);
        }

        setEditData(null);
        setOpenModal(false);
    };   

    return (
        <div className="flex h-full w-full flex-col gap-4 p-6 lg:flex-row">
            <AccessoryModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditData(null);
                }}
                onSubmit={handleSubmit}
                editData={editData}
            />

            <div className="w-full shrink-0 lg:w-[280px]">
                <Filter filters={filtersConfig} values={filters} setFilterValues={setFilters} />
            </div>

            <div className="flex flex-1 flex-col">
                <div className="mb-2 flex justify-end">
                    <button
                        onClick={() => {
                            setOpenModal(true);
                            setEditData(null);
                        }}
                        className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                    >
                        Thêm phụ kiện
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
