// Updated AccessoryPage with dynamic product_filter_values integration
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Filter, { FilterConfig } from '@/components/atomic/Filter';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import AccessoryModal from './AddAccessories';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';
import { getProducts3, deleteProduct, getProductFilters } from '@/services/products.service';
import PaginationComponent from '@/components/atomic/PaginationComponent';
import { toast } from 'sonner';
import { ProductTypes } from '@/types/types';

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
    const [filtervalueid, setFiltervalueid] = useState<number[]>([]);
    const [filters, setFilters] = useState<Record<string, any>>({
        name: '',
        productFilterValues: [],
        price: [0, 1500000],
    });
    const [filtersConfig, setFiltersConfig] = useState<FilterConfig[]>([]);

    const fetchData = async () => {
        try {
            const response = await getProducts3(2, page, pageSize, filtervalueid);
            if (response.ok) {
                const products = response.data?.data;
                const apiData: Accessory[] = [];

                products.forEach((item: any) => {
                    apiData.push({
                        id: item.productid,
                        name: item.productname,
                        sellingprice: parseInt(item.sellingprice),
                        category: item.value,
                        image: item.productimgurl || '/default.png',
                        batchid: item.batchid?.toString() || '',
                        expiry: item.expirydate || '',
                        stock: item.stockquantity || 0,
                        status: item.status || '',
                        discount: item.discount ? parseFloat(item.discount) : 0,
                    });
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
    }, [page, filtervalueid]);

    const fetchFilters = async () => {
        const response = await getProductFilters();
        if (response.ok) {
            const productTypes: ProductTypes[] = response.data;
            const selectedProductType = productTypes.find(type => type.producttypeid === 2);
            const filterValues = selectedProductType?.product_filter?.[0]?.product_filter_values || [];

            const dynamicFilter: FilterConfig = {
                filterid: 'productFilterValues',
                filterlabel: selectedProductType?.product_filter?.[0]?.productfiltername || 'Loại',
                filtertype: 'checkbox',
                filteroptions: filterValues.map(value => ({
                    optionlabel: value.value || '',
                    optionvalue: value.productfiltervalueid,
                })),
            };

            setFiltersConfig([
                { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
                { filterid: 'name', filtertype: 'search', filterlabel: 'Tìm kiếm' },
                dynamicFilter,
                { filterid: 'price', filterlabel: 'KHOẢNG GIÁ', filtertype: 'range', rangemin: 0, rangemax: 1500000 },
            ]);
        }
    };

    useEffect(() => {
        fetchFilters();
    }, []);

    useEffect(() => {
        if (Array.isArray(filters.productFilterValues)) {
            setFiltervalueid(filters.productFilterValues);
        } else {
            setFiltervalueid([]);
        }
    }, [filters.productFilterValues]);

    useEffect(() => {
        const result = data.filter((item) => {
            const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesPrice = !filters.price ||
                filters.price.length === 0 ||
                (item.sellingprice >= filters.price[0] && item.sellingprice <= filters.price[1]);
            return matchesName && matchesPrice;
        });
        setFilteredData(result);
    }, [filters, data]);

    const columns: Column<Accessory>[] = [
        { header: 'Tên phụ kiện', accessor: 'name' },
        { header: 'Loại', accessor: 'category' },
        { header: 'Lô', accessor: 'batchid', align: 'center' },
        {
            header: 'Giá bán',
            accessor: (item) => `${Number(item.sellingprice).toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
            })}`,
            align: 'center',
        },
        { header: 'Tồn kho', accessor: 'stock', align: 'center' },
    ];

    const handleEdit = (index: number) => {
        const item = filteredData[index];
        setEditData(item);
        setOpenModal(true);
    };

    const handleDelete = async (index: number) => {
        const productid = filteredData[index].id;
        const res = await deleteProduct(productid);

        if (res.ok) {
            setData((prev) => prev.filter((item) => item.id !== productid));
            setFilteredData((prev) => prev.filter((item) => item.id !== productid));
            toast.success('Xóa sản phẩm thành công!');
        } else {
            toast.error(`Không thể xóa sản phẩm: ${res.message}`);
        }
        fetchData();
    };

    const handleOrder = (index: number) => {
        setSelectedOrderItem(filteredData[index]);
        setOpenOrderForm(true);
    };

    const handleSubmit = () => {
        setEditData(null);
        setOpenModal(false);
        fetchData();
        fetchFilters();
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
                    showDelete
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
