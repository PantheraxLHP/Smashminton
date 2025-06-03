'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import { FaRegEdit } from 'react-icons/fa';

interface ZonePrice {
    zonename: string;
    price: string;
    startTime: string;
    endTime: string;
    startDay: string;
    endDay: string;
    image: string;
}

const rawZonePrices: ZonePrice[] = [
    {
        zonename: 'Zone A',
        price: '200.000 VND',
        startTime: '6:00',
        endTime: '22:00',
        startDay: 'Thứ 2',
        endDay: 'Chủ nhật',
        image: '/default.png',
    },
    {
        zonename: 'Zone B',
        price: '200.000 VND',
        startTime: '6:00',
        endTime: '22:00',
        startDay: 'Thứ 2',
        endDay: 'Chủ nhật',
        image: '/default.png',
    },
    {
        zonename: 'Zone C',
        price: '150.000 VND',
        startTime: '18:00',
        endTime: '22:00',
        startDay: 'Thứ 2',
        endDay: 'Chủ nhật',
        image: '/default.png',
    },
];

function normalizeTimeString(time: string) {
    const [hour, minute] = time.split(':').map(Number);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

const zonePrices = rawZonePrices.map((z) => ({
    ...z,
    startTime: normalizeTimeString(z.startTime),
    endTime: normalizeTimeString(z.endTime),
}));

export default function CourtPriceManager() {
    const [zonePricesState, setZonePricesState] = useState<ZonePrice[]>(zonePrices);
    const [editingItem, setEditingItem] = useState<ZonePrice | null>(null);
    const [editedPrice, setEditedPrice] = useState<string>('');

    const zoneColumns: Column<ZonePrice>[] = [
        {
            header: 'Zone',
            accessor: (item) => (
                <div className="flex items-center gap-2">
                    <img src={item.image} alt="" className="w-6 h-6 rounded object-cover" />
                    {item.zonename}
                </div>
            ),
        },
        { header: 'Từ', accessor: 'startDay' },
        { header: 'Đến', accessor: 'endDay' },
        { header: 'Giờ bắt đầu', accessor: 'startTime' },
        { header: 'Giờ kết thúc', accessor: 'endTime' },
        {
            header: 'Giá / giờ',
            accessor: (item: ZonePrice) => (
                <div className="flex items-center gap-2 sm:max-w-[50px] whitespace-nowrap">
                    {editingItem === item ? (
                        <>
                            <input
                                type="text"
                                value={editedPrice}
                                onChange={(e) => setEditedPrice(e.target.value)} 
                                className="border border-gray-300 px-2 py-1 w-28"
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    const newZonePrices = zonePricesState.map((z) =>
                                        z === item ? { ...z, price: editedPrice } : z
                                    );
                                    setZonePricesState(newZonePrices);
                                    setEditingItem(null);
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
                                    setEditedPrice(item.price);
                                }}
                                className="p-1 text-primary-500 hover:text-primary-600"
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
        <div className="p-4 sm:p-6 space-y-4 mt-5">
            <DataTable
                columns={zoneColumns}
                data={zonePricesState}
                renderImage={undefined}
                filterConfig={[]}
                filters={{}}
                setFilters={() => { }}
                showOptions={false}
                showMoreOption={false}
                showHeader={true}
            />
        </div>
    );
}
