'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import FoodModal from './AddFood';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';
import { getProducts3, deleteProduct } from '@/services/products.service';
import PaginationComponent from '@/components/atomic/PaginationComponent';
import { toast } from 'sonner';

export interface FoodItem {
    id: number;
    name: string;
    sellingprice: number;
    category: string;
    batchid: string;
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
        batchid: [],
    });

    async function fetchData() {
        try {
            const response = await getProducts3(1, page, pageSize, filtervalueid);
            if (response.ok) {
                const products = response.data?.data;
                if (!Array.isArray(products)) {
                    console.error("API không trả về mảng hợp lệ:", response.data);
                    setData([]);
                    setFilteredData([]);
                    return;
                }

                const apiData: FoodItem[] = [];

                products.forEach((product: any) => {
                    const common = {
                        id: product.productid,
                        name: product.productname,
                        sellingprice: parseInt(product.sellingprice),
                        category: product.value,
                        image: product.productimgurl || '/default.png',
                    };

                    if (Array.isArray(product.batches) && product.batches.length > 0) {
                        product.batches.forEach((batch: any) => {
                            apiData.push({
                                ...common,
                                batchid: batch.batchid?.toString() || '',
                                expiry: batch.expirydate || '',
                                stock: batch.stockquantity || 0,
                                status: batch.status || '',
                                discount: batch.discount ? parseFloat(batch.discount) : 0,
                            });
                        });
                    } else {
                        // Nếu không có batch thì vẫn push sản phẩm với thông tin mặc định
                        apiData.push({
                            ...common,
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
            console.error("Error fetching data:", error);
        }
    }    

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
                    !filters.price ||
                    filters.price.length === 0 ||
                    (item.sellingprice >= filters.price[0] && item.sellingprice <= filters.price[1]);

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
        { filterid: 'price', filterlabel: 'KHOẢNG GIÁ', filtertype: 'range', rangemin: 0, rangemax: 500000 },
    ];

    const columns: Column<FoodItem>[] = [
        { header: 'Tên sản phẩm', accessor: 'name' },
        { header: 'Loại', accessor: 'category' },
        {
            header: 'Giá bán / sản phẩm',
            accessor: (item) => item.sellingprice.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
            })
        },
        { header: 'Lô Hàng', accessor: 'batchid', align: 'center' },
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
            accessor: (item) => item.discount ? `${(item.discount).toFixed(0)}%` : '0',
            align: 'center',
        },
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
                    showDelete
                />

                { totalPages > 1 && (
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
                    item={{
                        productid: selectedOrderItem.id,
                        productname: selectedOrderItem.name,
                    }}
                />
            )}
        </div>
    );
}
