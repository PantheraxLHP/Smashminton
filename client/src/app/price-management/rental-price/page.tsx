'use client';

import React, { useState, useEffect } from 'react';
import ServiceModal from './AddEditService';
import { FaRegEdit } from 'react-icons/fa';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import { getProducts } from '@/services/products.service';
import PaginationComponent from '@/components/atomic/PaginationComponent';
import { updateProductPrice } from '@/services/products.service';
import { toast } from 'sonner';

export interface Service {
    productid?: number;
    productname: string;
    servicetype: string;
    price: string;
    image: string;
}

export default function RentalPriceManager() {
    const [servicesState, setServicesState] = useState<Service[]>([]);
    const [filteredData, setFilteredData] = useState<Service[]>([]);
    const [editData, setEditData] = useState<Service | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(2);
    const [editingItem, setEditingItem] = useState<Service | null>(null);
    const [editedPrice, setEditedPrice] = useState<string>('');


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

        const response = await getProducts(selectedTypeId, page, pageSize);

        if (response.ok) {
            const data = response.data.data;
            const pagination = response.data.pagination;

            const mapToService = (items: any[], type: string): Service[] => {
                return items.map((item) => ({
                    productid: item.productid,
                    productname: item.productname,
                    servicetype: type,
                    price: item.rentalprice ? `${parseInt(item.rentalprice).toLocaleString()} VND` : '0 VND',
                    image: item.productimgurl || '/default.png',
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

        console.log('[Filter Change]', { filterid, value, type });

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
            ),
        },
        { header: 'Dịch vụ áp dụng', accessor: 'servicetype' },
        {
            header: 'Giá thuê',
            accessor: (item: Service) => (
                <div className="flex flex-wrap items-center gap-2">
                    {editingItem === item ? (
                        <>
                            <input
                                type="text"
                                value={editedPrice}
                                onChange={(e) => setEditedPrice(e.target.value)}
                                className="border border-gray-300 px-2 py-1 w-[70px] sm:w-[70px] md:w-[70px]"
                                autoFocus
                            />
                            <button
                                onClick={async () => {
                                    const parsedPrice = Number(editedPrice);
                                    if (isNaN(parsedPrice) || parsedPrice < 0) {
                                        alert('Vui lòng nhập giá hợp lệ!');
                                        return;
                                    }

                                    if (item.productid === undefined) {
                                        alert('Thiếu productid, không thể cập nhật.');
                                        return;
                                    }
                                    const response = await updateProductPrice(item.productid, { price: parsedPrice });

                                    if (response.ok) {
                                        await fetchData();
                                        setEditingItem(null);
                                        toast.success('Cập nhật giá thành công!');
                                    } else {
                                        toast.error(`Cập nhật giá thất bại: ${response.message}`);
                                    }
                                }}
                                className="p-1 bg-primary-500 text-white rounded hover:bg-primary-600 w-14"
                            >
                                Xong
                            </button>
                        </>
                    ) : (
                        <>
                            <span>{item.price}</span>
                            <button
                                onClick={() => {
                                    setEditingItem(item);
                                    const numericValue = item.price.replace(/[^\d]/g, '');
                                    setEditedPrice(numericValue);
                                }}
                                className="p-1 text-primary-500 hover:text-primary-600 cursor-pointer"
                            >
                                <FaRegEdit size={14} />
                            </button>
                        </>
                    )}
                </div>
            ),
        },     
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
                        setShowModal(true);
                    }}
                    onDelete={(index) => {
                        const itemToDelete = filteredData[index];
                        setServicesState((prev) => prev.filter((item) => item !== itemToDelete));
                    }}
                    showOptions={false}
                    showMoreOption={false}
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


                <ServiceModal
                    open={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setEditData(null);
                        setSelectedIndex(null);
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

                        setShowModal(false);
                        setEditData(null);
                        setSelectedIndex(null);
                    }}
                />
            </div>
        </div>
    );
}
