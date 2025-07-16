'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import FoodModal from './AddFood';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';
import { getProducts2, getProducts3, deleteProduct, getProductFilters } from '@/services/products.service';
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
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(2);
    const [filtervalueid, setfiltervalueid] = useState<number[]>([]);
    const defaultFilters = {
        name: '',
        productFilterValues: [],
        type: [0],
        price: undefined,
    };
    const [filters, setFilters] = useState<Record<string, any>>(defaultFilters);
    const [filtersConfig, setFiltersConfig] = useState<FilterConfig[]>([]);
    const showDiscount = filters.type?.[0] === 0;

    async function fetchData() {
        try {
            let response;
            const apiData: FoodItem[] = [];
            if (filters.type?.[0] === 1) {
                response = await getProducts2(1, page, pageSize, filtervalueid, filters.name);

                if (response.ok) {
                    response.data.data.forEach((item: any) => {
                        apiData.push({
                            id: item.productid,
                            name: item.productname,
                            sellingprice: parseInt(item.sellingprice || '0'),
                            category: item.value || '',
                            image: item.productimgurl || '/default.png',
                            batchid: '-',
                            expiry: '',
                            stock: item.quantity || 0,
                            status: 'available',
                            discount: 0,
                        });
                    });
                }
            } else {
                response = await getProducts3(1, page, pageSize, filtervalueid, filters.name);

                if (response.ok) {
                    response.data.data.forEach((item: any) => {
                        apiData.push({
                            id: item.productid ?? '',
                            name: item.productname ?? '',
                            sellingprice: item.sellingprice ? parseInt(item.sellingprice) : 0,
                            category: item.value ?? '',
                            image: item.productimgurl ?? '/default.png',
                            batchid: item.batchid ? item.batchid.toString() : '',
                            expiry: item.expirydate ?? '',
                            stock: item.stockquantity ?? 0,
                            status: item.status ?? '',
                            discount: item.discount ? parseFloat(item.discount) : 0,
                        });
                    });
                }
            }

            setData(apiData);
            setFilteredData(apiData);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [page, filtervalueid, filters.type?.[0], filters.name]);    

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
                { filterid: 'name', filtertype: 'search', filterlabel: 'Tên sản phẩm' },
                {
                    filterid: 'type',
                    filtertype: 'radio',
                    filterlabel: 'Loại hiển thị',
                    filteroptions: [
                        { optionlabel: 'Theo lô', optionvalue: 0 },
                        { optionlabel: 'Tất cả sản phẩm', optionvalue: 1 },
                    ],
                },
                dynamicFilter,
            ]);
        }
    };

    useEffect(() => {
        fetchFilters();
    }, []);

    useEffect(() => {
        setPage(1);
        fetchData();
    }, [filters.type, filtervalueid, filters.name]);

    useEffect(() => {
        if (Array.isArray(filters.productFilterValues)) {
            setfiltervalueid(filters.productFilterValues);
        } else {
            setfiltervalueid([]);
        }
        setPage(1);
    }, [filters.productFilterValues]);

    useEffect(() => {
        const result = data.filter((item) => {
            const matchesPrice = !filters.price ||
                filters.price.length === 0 ||
                (item.sellingprice >= filters.price[0] && item.sellingprice <= filters.price[1]);
            return matchesPrice;
        });
        setFilteredData(result);
    }, [filters.price, data]);    

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
        { header: 'Tồn kho', accessor: 'stock', align: 'center' },
    ];

    if (filters.type?.[0] === 0) {
        columns.push(
            { header: 'Lô Hàng', accessor: 'batchid', align: 'center' },
            {
                header: 'Ngày hết hạn',
                accessor: (item) =>
                    item.expiry
                        ? new Date(item.expiry).toLocaleDateString('vi-VN')
                        : '',
                align: 'center',
            },
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
            }
        );
    }

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
            toast.error(`${res.message}`);
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

    const handleFilterChange = (filterid: string, value: any) => {
        const type = filtersConfig.find((f) => f.filterid === filterid)?.filtertype;

        setFilters((prev) => {
            const updated = { ...prev };

            if (type === 'search') {
                updated[filterid] = value;
            } else if (type === 'radio') {
                let resolvedValue = value;

                if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
                    resolvedValue = 0;
                }

                if (isNaN(resolvedValue)) {
                    const options = filtersConfig.find((f) => f.filterid === filterid)?.filteroptions || [];
                    resolvedValue = options[0]?.optionvalue ?? 0;
                }

                updated[filterid] = Array.isArray(resolvedValue) ? resolvedValue : [resolvedValue];

                if (filterid === 'type') {
                    setPage(1);
                }
            } else if (type === 'checkbox') {
                const current = Array.isArray(prev[filterid]) ? prev[filterid] : [];
                if (current.includes(value)) {
                    updated[filterid] = current.filter((v: any) => v !== value);
                } else {
                    updated[filterid] = [...current, value];
                }
                setPage(1);
            }

            return updated;
        });
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
                openDiscount={showDiscount}
            />

            <div className="w-full shrink-0 lg:w-[280px]">
                <Filter
                    filters={filtersConfig}
                    values={filters}
                    setFilterValues={(newFilters) => {
                        const resolvedFilters = { ...(typeof newFilters === 'function' ? newFilters(filters) : newFilters) };
                        if (!resolvedFilters.type || resolvedFilters.type.length === 0) {
                            resolvedFilters.type = [0];
                        }
                        setFilters(resolvedFilters);
                    }}                    
                    onFilterChange={handleFilterChange}
                    onRemoveAllFilters={() => {
                        setFilters(defaultFilters);
                        setPage(1);
                    }}                    
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
