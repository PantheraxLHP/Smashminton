'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Service } from '../type';
import ServiceModal from './AddEditCourt';
import DataTable, { Column } from '../../../components/warehouse/DataTable';

const rawServices: Service[] = [
    {
        name: "Sân 1",
        type: "Thuê sân",
        product: "Zone A",
        price: "200.000 VND",
        startTime: "6:00",
        endTime: "22:00",
        image: "/default.png",
    },
    {
        name: "Sân 1",
        type: "Thuê sân",
        product: "Zone B",
        price: "200.000 VND",
        startTime: "6:00",
        endTime: "22:00",
        image: "/default.png",
    },
    {
        name: "Sân 2",
        type: "Thuê sân",
        product: "Zone C",
        price: "150.000 VND",
        startTime: "18:00",
        endTime: "22:00",
        image: "/default.png",
    },
];

function normalizeTimeString(time: string) {
    const [hour, minute] = time.split(':').map(Number);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

const services = rawServices.map((s) => ({
    ...s,
    startTime: normalizeTimeString(s.startTime),
    endTime: normalizeTimeString(s.endTime),
}));

export default function CourtPriceManager() {
    const [servicesState, setServicesState] = useState<Service[]>(services);
    const [editData, setEditData] = useState<Service | null>(null);
    const [showModal, setShowModal] = useState(false);
    // const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const columns: Column<Service>[] = [
        {
            header: 'Sân',
            accessor: (item) => (
                <div className="flex items-center gap-2">
                    <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />
                    {item.name}
                </div>
            ),
        },
        { header: 'Khu vực áp dụng', accessor: 'product' },
        { header: 'Giá / h', accessor: 'price' },
        {
            header: 'Thời gian áp dụng',
            accessor: (item) => `${item.startTime} - ${item.endTime}`,
        },
    ];

    return (
        <div className="p-4 sm:p-6">
            <div className="flex justify-end pr-6">
                <Button
                    onClick={() => {
                        setEditData(null);
                        setShowModal(true);
                    }}
                    className="bg-primary-500 hover:bg-primary-600 text-white"
                >
                    Thêm sân
                </Button>
            </div>

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
