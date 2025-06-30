'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import FoodModal from './AddFood';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';
import { getProducts3, deleteProduct, getProductFilters } from '@/services/products.service';
import PaginationComponent from '@/components/atomic/PaginationComponent';
import { toast } from 'sonner';
import { ProductTypes } from '@/types/types';

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
        productFilterValues: [],
        price: [0, 500000],
    });
    const [filtersConfig, setFiltersConfig] = useState<FilterConfig[]>([]);

    async function fetchData() {
        try {
            const response = await getProducts3(1, page, pageSize, filtervalueid);
            if (response.ok) {
                const products = response.data?.data;
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
    }, [page, filtervalueid]);

    useEffect(() => {
        const fetchFilters = async () => {
            const response = await getProductFilters();
            if (response.ok) {
                const productTypes: ProductTypes[] = response.data;
                const selectedProductType = productTypes.find(type => type.producttypeid === 1);
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
                    { filterid: 'price', filterlabel: 'KHOẢNG GIÁ', filtertype: 'range', rangemin: 0, rangemax: 500000 },
                ]);
            }
        };

        fetchFilters();
    }, []);

    useEffect(() => {
        if (Array.isArray(filters.productFilterValues)) {
            setfiltervalueid(filters.productFilterValues);
        } else {
            setfiltervalueid([]);
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
            accessor: (item) => {
                switch (item.status) {
                    case 'available': return 'Còn hạn';
                    case 'expiringsoon': return 'Sắp hết hạn';
                    case 'expired': return 'Hết hạn';
                    default: return '';
                }
            },
            align: 'center',
            className: (item) => {
                switch (item.status) {
                    case 'expiringsoon': return 'text-yellow-600';
                    case 'expired': return 'text-red-600';
                    default: return 'text-primary-600';
                }
            },
        },
        {
            header: 'Giảm giá',
            accessor: (item) => item.discount ? `${item.discount.toFixed(0)}%` : '0%',
            align: 'center',
            className: (item) => item.discount && item.discount > 0 ? 'text-red-500' : '',
        },
    ];

    const handleEdit = (index: number) => {
        setEditData(filteredData[index]);
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
                    item={{
                        productid: selectedOrderItem.id,
                        productname: selectedOrderItem.name,
                    }}
                />
            )}
        </div>
    );
}
