'use client';

import React, { useState, useEffect } from 'react';
import ServiceModal from './AddEditService';
import { FaRegEdit } from 'react-icons/fa';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import { getProducts2 } from '@/services/products.service';
import PaginationComponent from '@/components/atomic/PaginationComponent';
import { updateProductPrice } from '@/services/products.service';
import { toast } from 'sonner';
import PurchaseOrderForm from '@/components/warehouse/OrderForm';

export interface Service {
    productid: number;
    productname: string;
    servicetype: string;
    price: number;
    image: string;
    quantity: number;
    value?: string;
    productfiltervalueid?: number;
}

export default function RentalPriceManager() {
    const [servicesState, setServicesState] = useState<Service[]>([]);
    const [filteredData, setFilteredData] = useState<Service[]>([]);
    const [editData, setEditData] = useState<Service | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(2);
    const [editingItem, setEditingItem] = useState<Service | null>(null);
    const [editedPrice, setEditedPrice] = useState<string>('');
    const [isAddShoeRacketModalOpen, setIsAddShoeRacketModalOpen] = useState(false);
    const [openOrderForm, setOpenOrderForm] = useState(false);
    const [selectedOrderItem, setSelectedOrderItem] = useState<Service | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>({
        productname: '',
        servicetype: [3],
    });

    const fetchData = async () => {
        let selectedTypeId = 3;
        if (Array.isArray(filters.servicetype) && filters.servicetype.length > 0) {
            selectedTypeId = filters.servicetype[0];
        } else {
            setFilters((prev) => ({ ...prev, servicetype: [3] }));
            return;
        }

        const response = await getProducts2(selectedTypeId, page, pageSize);

        if (response.ok) {
            const data = response.data.data;
            const pagination = response.data.pagination;

            const mapToService = (items: any[], type: string): Service[] => {
                return items.map((item) => ({
                    productid: item.productid,
                    productname: item.productname,
                    servicetype: type,
                    price: item.rentalprice ? parseInt(item.rentalprice) : 0,
                    image: item.productimgurl || '/default.png',
                    quantity: item.quantity || 0,
                    value: item.value || '',
                    productfiltervalueid: item.productfiltervalueid || null,
                }));
            };

            const typeName = selectedTypeId === 3 ? 'Thuê vợt' : 'Thuê giày';
            const services = mapToService(data, typeName);

            setServicesState(services);
            setTotalPages(pagination.totalPages);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters.servicetype, page]);
    

    useEffect(() => {
        setPage(1);
    }, [filters.servicetype]);
    
    useEffect(() => {
        let result = servicesState;

        if (filters.productname) {
            const keyword = filters.productname.toLowerCase();
            result = result.filter((item) => item.productname.toLowerCase().includes(keyword));
        }

        if (Array.isArray(filters.servicetype) && filters.servicetype.length > 0) {
            const selectedTypeId = filters.servicetype[0];
            const typeMap: Record<number, string> = {
                3: 'Thuê vợt',
                4: 'Thuê giày',
            };
            const typeName = typeMap[selectedTypeId];
            result = result.filter((item) => item.servicetype === typeName);
        }

        setFilteredData(result);
    }, [filters, servicesState]);
    
    

    const getUniqueOptions = (data: Service[], key: keyof Service) => {
        return Array.from(new Set(data.map((item) => item[key]))).filter(Boolean) as string[];
    };

    const servicetypeOptions: FilterOption[] = [
        { optionlabel: 'Thuê vợt', optionvalue: 3 },
        { optionlabel: 'Thuê giày', optionvalue: 4 },
    ];

    const filtersConfig: FilterConfig[] = [
        { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
        {
            filterid: 'productname',
            filterlabel: 'Tên sản phẩm',
            filtertype: 'search',
        },
        {
            filterid: 'servicetype',
            filterlabel: 'Loại dịch vụ',
            filtertype: 'radio',
            filteroptions: servicetypeOptions,
        },
    ];

    const handleFilterChange = (filterid: string, value: any) => {
        const type = filtersConfig.find((f) => f.filterid === filterid)?.filtertype;

        setFilters((prev) => {
            const updated = { ...prev };

            if (type === 'search') {
                updated[filterid] = value;
            } else if (type === 'radio') {
                let resolvedValue = value;
                if (isNaN(value)) {
                    const firstOption = servicetypeOptions[0]?.optionvalue || '';
                    resolvedValue = firstOption;
                }

                updated[filterid] = Array.isArray(resolvedValue) ? resolvedValue : [resolvedValue];
            }

            return updated;
        });
    };
    
    

    const columns: Column<Service>[] = [
        {
            header: 'Tên sản phẩm',
            accessor: (item) => (
                <div className="flex items-center gap-2">
                    <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />
                    {item.productname}
                </div>
            ), align: 'left',
        },
        { header: 'Dịch vụ áp dụng', accessor: 'servicetype', align: 'center' },
        {
            header: 'Giá thuê',
            accessor: (item: Service) => (
                <div>{Number(item.price).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                })}</div>
            ),
            align: 'center',
        },
        { header: 'Số lượng', accessor: 'quantity', align: 'center' },
    ];

    return (
        <div className="flex h-full w-full flex-col gap-4 p-6 lg:flex-row">
            <div className="w-[280px]">
                <Filter
                    filters={filtersConfig}
                    values={filters}
                    setFilterValues={setFilters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            <div className="flex-1">
                <div className="flex flex-row gap-4 justify-end mb-2">
                    <div className="mb-2 hidden justify-end lg:flex">
                        <button
                            onClick={() => setIsAddShoeRacketModalOpen(true)}
                            className="rounded bg-primary-500 px-4 py-2 text-white text-sm hover:bg-primary-600 cursor-pointer"
                        >
                            Thêm giày, vợt
                        </button>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    renderImage={undefined}
                    filterConfig={[]}
                    filters={{}}
                    setFilters={() => { }}
                    onEdit={(index) => {
                        setSelectedIndex(index);
                        setEditData(filteredData[index]);
                        setIsAddShoeRacketModalOpen(true);
                    }}
                    onDelete={(index) => {
                        const itemToDelete = filteredData[index];
                        setServicesState((prev) => prev.filter((item) => item !== itemToDelete));
                    }}
                    showOptions={true}
                    showMoreOption={true}
                    showHeader
                    showDelete={false}
                    onOrder={(index) => {
                        setSelectedOrderItem(filteredData[index]);
                        setOpenOrderForm(true);
                    }}
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


                <ServiceModal
                    open={isAddShoeRacketModalOpen}
                    onClose={() => {
                        setEditData(null);
                        setSelectedIndex(null);
                        setIsAddShoeRacketModalOpen(false);
                    }}
                    editData={editData}
                    onSubmit={(updatedService) => {
                        if (editData && selectedIndex !== null) {
                            setServicesState((prev) =>
                                prev.map((item) => (item === editData ? updatedService : item))
                            );
                        } else {
                            setServicesState((prev) => [...prev, updatedService]);
                        }

                        setIsAddShoeRacketModalOpen(false);
                        setEditData(null);
                        setSelectedIndex(null);
                    }}
                />
                {openOrderForm && selectedOrderItem && (
                    <PurchaseOrderForm
                        open={openOrderForm}
                        onClose={() => setOpenOrderForm(false)}
                        item={{
                            productid: selectedOrderItem.productid!,
                            productname: selectedOrderItem.productname,
                        }}
                    />
                )}

            </div>
        </div>
    );
}
