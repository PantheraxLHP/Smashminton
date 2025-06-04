'use client';

import React, { useState } from 'react';
//import { Button } from '@/components/ui/button';
import ServiceModal from './AddEditService';
import DataTable, { Column } from '../../../components/warehouse/DataTable';

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
    const [editData, setEditData] = useState<Service | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
        { header: 'Thời gian áp dụng', accessor: () => 'Cả ngày' },
        { header: 'Giá / h', accessor: 'price' },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-4 mt-5">
            <DataTable
                columns={columns}
                data={servicesState}
                renderImage={undefined}
                filterConfig={[]}
                filters={{}}
                setFilters={() => { }}
                onEdit={(index) => {
                    setSelectedIndex(index);
                    setEditData(servicesState[index]);
                    setShowModal(true);
                }}
                onDelete={(index) => {
                    setServicesState((prev) => prev.filter((_, i) => i !== index));
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
                            prev.map((item, i) => (i === selectedIndex ? updatedService : item))
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
    );
}
