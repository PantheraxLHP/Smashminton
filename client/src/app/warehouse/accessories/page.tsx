'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import AccessoryModal from './AddAccessories';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';
import { getProducts3 } from '@/services/products.service';
import PaginationComponent from '@/components/atomic/PaginationComponent';

export interface Accessory {
    id: number;
    name: string;
    sellingprice: number;
    category: string;
    batchid: string;
    expiry?: string;
    stock: number;
    image: string;
    status?: string;
    discount?: number;
}

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
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [filtervalueid] = useState<number[]>([]);
    const [filters, setFilters] = useState<Record<string, any>>({
        name: '',
        category: [],
        price: [0, 1500000],
    });

    const fetchData = async () => {
        try {
            const response = await getProducts3(2, page, pageSize, filtervalueid);
            if (response.ok) {
                const products = response.data?.data;
                if (!Array.isArray(products)) {
                    console.error('API trả về không hợp lệ:', response.data);
                    setData([]);
                    return;
                }

                const apiData: Accessory[] = [];

                products.forEach((product: any) => {
                    const base = {
                        id: product.productid,
                        name: product.productname,
                        sellingprice: parseInt(product.sellingprice),
                        category: product.value,
                        image: product.productimgurl || '/default.png',
                    };

                    if (Array.isArray(product.batches) && product.batches.length > 0) {
                        product.batches.forEach((batch: any) => {
                            apiData.push({
                                ...base,
                                batchid: batch.batchid?.toString() || '',
                                expiry: batch.expirydate || '',
                                stock: batch.stockquantity || 0,
                                status: batch.status || '',
                                discount: batch.discount ? parseFloat(batch.discount) : 0,
                            });
                        });
                    } else {
                        apiData.push({
                            ...base,
                            batchid: '',
                            expiry: '1/1/2025',
                            stock: product.quantity || 0,
                            status: '',
                            discount: 0,
                        });
                    }
                });

                setData(apiData);
                setFilteredData(apiData);
                setTotalPages(response.data.pagination.totalPages);
            }
        } catch (error) {
            console.error('Lỗi fetch phụ kiện:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    useEffect(() => {
        const hasFilters = filters.name || (Array.isArray(filters.category) && filters.category.length > 0) || (Array.isArray(filters.price) && filters.price.length > 0);
        const result = hasFilters
            ? data.filter((item) => {
                const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
                const matchesCategory = (Array.isArray(filters.category) && filters.category.length === 0) || (Array.isArray(filters.category) && filters.category.includes(item.category));
                const matchesPrice =
                    Array.isArray(filters.price) &&
                    filters.price.length === 2 &&
                    item.sellingprice >= filters.price[0] &&
                    item.sellingprice <= filters.price[1];

                return matchesName && matchesCategory && matchesPrice;
            })
            : data;
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
        { filterid: 'price', filterlabel: 'KHOẢNG GIÁ', filtertype: 'range', rangemin: 0, rangemax: 1500000 },
    ];

    const columns: Column<Accessory>[] = [
        { header: 'Tên phụ kiện', accessor: 'name' },
        { header: 'Loại', accessor: 'category' },
        { header: 'Lô', accessor: 'batchid', align: 'center' },
        {
            header: 'Giá bán', accessor: (item) => `${Number(item.sellingprice).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}`, align: 'center' },
        { header: 'Tồn kho', accessor: 'stock', align: 'center' },
    ];

    const handleEdit = (index: number) => {
        const item = filteredData[index];
        setEditData(item);
        setOpenModal(true);
    };

    const handleDelete = (index: number) => {
        const item = filteredData[index];
        if (window.confirm(`Xác nhận xóa phụ kiện: ${item.name}?`)) {
            const newData = data.filter((d) => d.id !== item.id);
            setData(newData);
        }
    };

    const handleOrder = (index: number) => {
        setSelectedOrderItem(filteredData[index]);
        setOpenOrderForm(true);
    };

    const handleSubmit = () => {
        setEditData(null);
        setOpenModal(false);
        fetchData();
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

                {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
                    </div>
                )}
            </div>

            {openOrderForm && selectedOrderItem && (
                <PurchaseOrderForm
                    open={openOrderForm}
                    onClose={() => setOpenOrderForm(false)}
                    item={{
                        productid: selectedOrderItem.id,
                        productname: selectedOrderItem.name,
                    }}
                />
            )}
        </div>
    );
}
