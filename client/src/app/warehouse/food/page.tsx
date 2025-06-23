'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import FoodModal from './AddFood';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';
import { getProducts3 } from '@/services/products.service';
import PaginationComponent from '@/components/atomic/PaginationComponent';

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
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(2);
    const [filtervalueid, setfiltervalueid] = useState<number[]>([]);
    const [filters, setFilters] = useState<Record<string, any>>({
        name: '',
        category: [],
        price: [0, 500000],
        lot: [],
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getProducts3(1, page, pageSize, filtervalueid);
                if (response.ok) {
                    const products = Array.isArray(response.data.data) ? response.data.data : [];

                    const apiData = products.map((product: any) => ({
                        id: product.productid,
                        name: product.productname,
                        sellingprice: parseInt(product.sellingprice),
                        category: "",
                        lot: "",
                        expiry: "",
                        stock: 0,
                        image: product.productimgurl,
                        status: "",
                        discount: 0,
                    }));

                    setData(apiData);
                    setFilteredData(apiData);
                    setTotalPages(response.data.pagination.totalPages);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [page]);

    useEffect(() => {
        const result = data.filter((item) => {
            const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesCategory = filters.category.length === 0 || filters.category.includes(item.category);

            const matchesPrice =
                !filters.price || 
                filters.price.length === 0 ||
                (item.sellingprice >= filters.price[0] && item.sellingprice <= filters.price[1]);

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
        { filterid: 'price', filterlabel: 'KHOẢNG GIÁ', filtertype: 'range', rangemin: 0, rangemax: 500000 },
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
                        : 'text-primary-600',
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
                        className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
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

                {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <PaginationComponent
                            page={page}
                            setPage={setPage}
                            totalPages={totalPages}
                        />
                    </div>
                )}
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
