'use client';

import React, { useState, useEffect } from 'react';
import ServiceModal from './AddEditService';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';

export interface Service {
    productname: string;
    servicetype: string;
    price: string;
    image: string;
}

const rawServices: Service[] = [
    {
        productname: "Vợt Yonex",
        servicetype: "Thuê vợt",
        price: "200.000 VND",
        image: "/default.png",
    },
    {
        productname: "Giày Atlas",
        servicetype: "Thuê giày",
        price: "200.000 VND",
        image: "/default.png",
    },
    {
        productname: "Giày Nike",
        servicetype: "Thuê giày",
        price: "150.000 VND",
        image: "/default.png",
    },
];

export default function RentalPriceManager() {
    const [servicesState, setServicesState] = useState<Service[]>(rawServices);
    const [filteredData, setFilteredData] = useState<Service[]>(rawServices);

    const [editData, setEditData] = useState<Service | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const [filters, setFilters] = useState<Record<string, any>>({
        productname: '',
        servicetype: [],
    });

    const getUniqueOptions = (data: Service[], key: keyof Service) => {
        return Array.from(new Set(data.map((item) => item[key]))).filter(Boolean) as string[];
    };

    const servicetypeOptions: FilterOption[] = getUniqueOptions(servicesState, 'servicetype').map(
        (option) => ({
            optionlabel: option,
            optionvalue: option,
        })
    );

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
            filtertype: 'checkbox',
            filteroptions: servicetypeOptions,
        },
    ];

    useEffect(() => {
        let result = servicesState;

        if (filters.productname) {
            const keyword = filters.productname.toLowerCase();
            result = result.filter((item) => item.productname.toLowerCase().includes(keyword));
        }

        if (filters.servicetype && filters.servicetype.length > 0) {
            result = result.filter((item) => filters.servicetype.includes(item.servicetype));
        }

        setFilteredData(result);
    }, [filters, servicesState]);

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
        { header: 'Giá thuê', accessor: 'price' },
    ];

    return (
        <div className="flex h-full w-full flex-col gap-4 p-6 lg:flex-row">
            <div className="w-[280px]">
                <Filter filters={filtersConfig} values={filters} setFilterValues={setFilters} />
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
                    showMoreOption={true}
                    showHeader
                />

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
