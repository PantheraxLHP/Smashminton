'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import AccessoryModal, { AccessoryFormData } from './AddAccessories';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';
import { BaseItem } from '@/components/warehouse/OrderForm';

interface Accessory extends BaseItem {
    category: string;
    brand: string;
    distributor: string;
    stock: number;
    image: string;
}
const rawData: Accessory[] = [
    { name: 'Grip Yonex', category: 'Grip', price: 50000, stock: 100, brand: 'Yonex', image: '/default.png', distributor: ''},
    { name: 'Grip Lining', category: 'Grip', price: 40000, stock: 80, brand: 'Lining', image: '/default.png', distributor: ''},
    { name: 'Balo Yonex', category: 'Bag', price: 800000, stock: 20, brand: 'Yonex', image: '/default.png', distributor: ''},
    { name: 'Túi đựng vợt', category: 'Bag', price: 600000, stock: 15, brand: 'Lining', image: '/default.png', distributor: ''},
    { name: 'Bình nước', category: 'Other', price: 100000, stock: 50, brand: 'Other', image: '/default.png', distributor: ''},
];

const getUniqueOptions = (data: Accessory[], key: keyof Accessory) => {
    return Array.from(new Set(data.map((item) => item[key]))).filter(Boolean) as string[];
};

export default function AccessoryPage() {
    const [data, setData] = useState<Accessory[]>([]);
    const [filteredData, setFilteredData] = useState<Accessory[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState<AccessoryFormData | null>(null);
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
        const prices = rawData.map((d) => d.price);
        setFilters((prev) => ({
            ...prev,
            price: [Math.min(...prices), Math.max(...prices)],
        }));
    }, []);

    useEffect(() => {
        const result = data.filter((item) => {
            const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesCategory = filters.category.length === 0 || filters.category.includes(item.category);
            const matchesBrand = filters.brand.length === 0 || filters.brand.includes(item.brand);
            const matchesPrice =
                Array.isArray(filters.price) &&
                filters.price.length === 2 &&
                item.price >= filters.price[0] &&
                item.price <= filters.price[1];
            return matchesName && matchesCategory && matchesBrand && matchesPrice;
        });
        setFilteredData(result);
    }, [filters, data]);

    const categoryOptions: FilterOption[] = getUniqueOptions(data, 'category').map((option) => ({
        optionlabel: option,
        optionvalue: option,
    }));

    const brandOptions: FilterOption[] = getUniqueOptions(data, 'brand').map((option) => ({
        optionlabel: option,
        optionvalue: option,
    }));

    const filtersConfig: FilterConfig[] = [
        { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
        { filterid: 'name', filtertype: 'search', filterlabel: 'Tìm kiếm' },
        { filterid: 'category', filterlabel: 'LOẠI', filtertype: 'checkbox', filteroptions: categoryOptions },
        { filterid: 'brand', filterlabel: 'THƯƠNG HIỆU', filtertype: 'checkbox', filteroptions: brandOptions },
        { filterid: 'price', filterlabel: 'KHOẢNG GIÁ', filtertype: 'range', rangemin: 0, rangemax: 1000000 },
    ];

    const columns: Column<Accessory>[] = [
        { header: 'Tên phụ kiện', accessor: 'name' },
        { header: 'Loại', accessor: 'category' },
        { header: 'Thương hiệu', accessor: 'brand' },
        { header: 'Giá', accessor: (item) => `${item.price.toLocaleString('vi-VN')} VND`, align: 'center' },
        { header: 'Tồn kho', accessor: 'stock', align: 'center' },
    ];

    const handleEdit = (index: number) => {
        const item = filteredData[index];
        setEditData({
            name: item.name,
            category: item.category,
            brand: item.brand,
            price: String(item.price),
            stock: String(item.stock),
            distributor: item.distributor,
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

    const handleSubmit = (formData: AccessoryFormData) => {
        const newAccessory: Accessory = {
            name: formData.name,
            category: formData.category,
            brand: formData.brand,
            price: Number(formData.price),
            stock: Number(formData.stock),
            image: '/default.png',
            distributor: formData.distributor || '',
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
                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                        Thêm
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
