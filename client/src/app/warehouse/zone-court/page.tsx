'use client';

import React, { useState, useEffect } from 'react';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import AddZoneModal from './AddZone';
import AddCourtModal from './AddCourt';
import { Switch } from '@/components/ui/switch';
import { FaRegEdit } from 'react-icons/fa';


export interface Zone {
    zoneid: number;
    zonename: string;
    type: string;
    image: string;
}

export interface Court {
    courtname: string;
    image: string;
    status: string;
    avgrating: number;
    timecalavg: string;
    zoneid: number;
}

const rawZone: Zone[] = [
    { zoneid: 1, zonename: 'Zone A', type: 'Cool', image: '/default.png' },
    { zoneid: 2, zonename: 'Zone B', type: 'Air Conditioner', image: '/default.png' },
    { zoneid: 3, zonename: 'Zone C', type: 'Private', image: '/default.png' },
];

const rawCourt: Court[] = [
    { courtname: 'Sân 1', image: '/default.png', status: 'Đang hoạt động', avgrating: 4.5, timecalavg: '2025-06-05', zoneid: 1 },
    { courtname: 'Sân 2', image: '/default.png', status: 'Bảo trì', avgrating: 4.0, timecalavg: '2025-06-05', zoneid: 2 },
    { courtname: 'Sân 3', image: '/default.png', status: 'Đang hoạt động', avgrating: 4.8, timecalavg: '2025-06-05', zoneid: 3 },
];

function normalizeTimeString(time: string) {
    if (!time.includes(':')) return time;
    const [hour, minute] = time.split(':').map(Number);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

export default function ZoneCourtManager() {
    const [courtState, setCourtState] = useState<Court[]>(rawCourt);
    const [editingItem, setEditingItem] = useState<Court | null>(null);
    const [editedRatingGrade, setEditedRatingGrade] = useState<string>('');
    const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
    const [isAddCourtModalOpen, setIsAddCourtModalOpen] = useState(false);
    const [filters, setFilters] = useState<Record<string, any>>({
        zonename: rawZone.map((z) => z.zonename),
    });

    const zoneOptions: FilterOption[] = rawZone.map((zone) => ({
        optionlabel: zone.zonename,
        optionvalue: zone.zonename,
    }));

    const filtersConfig: FilterConfig[] = [
        { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
        {
            filterid: 'zonename',
            filterlabel: 'Khu vực',
            filtertype: 'checkbox',
            filteroptions: zoneOptions,
        },

    ];


    function handleSubmit(newZone: Zone) {
        const maxId = Math.max(...rawZone.map((z) => z.zoneid), 0);
        const zoneToAdd: Zone = {
            ...newZone,
            zoneid: maxId + 1,
            image: newZone.image || '/default.png',
        };
        rawZone.push(zoneToAdd);

        setFilters((prev) => ({
            ...prev,
            zonename: rawZone.map((z) => z.zonename),
        }));
    }

    function handleSubmitCourt(newCourt: Court) {
        rawCourt.push(newCourt);
        setCourtState((prev) => [...prev, newCourt]);
        setIsAddCourtModalOpen(false);
    }


    useEffect(() => {
        if (!filters.zonename || filters.zonename.length === 0) {
            setCourtState(rawCourt);
        } else {
            const selectedZoneIds = rawZone
                .filter((z) => filters.zonename.includes(z.zonename))
                .map((z) => z.zoneid);

            const filteredCourts = rawCourt.filter((c) => selectedZoneIds.includes(c.zoneid));
            setCourtState(filteredCourts);
        }
    }, [filters.zonename]);

    const CourtColumns: Column<Court>[] = [
        {
            header: 'Sân',
            accessor: (item) => (
                <div className="flex items-center gap-2">
                    <img src={item.image} alt="" className="w-6 h-6 rounded object-cover" />
                    {item.courtname}
                </div>
            ),
        },
        {
            header: 'Tình trạng',
            accessor: (item) => {
                const isActive = item.status === 'Đang hoạt động';

                function handleSwitchChange(checked: boolean) {
                    const newStatus = checked ? 'Đang hoạt động' : 'Bảo trì';

                    const updatedCourts = courtState.map((c) =>
                        c.courtname === item.courtname ? { ...c, status: newStatus } : c
                    );
                    setCourtState(updatedCourts);
                }

                const colorClass = isActive ? 'text-primary-600' : 'text-orange-500';

                return (
                    <div className="flex items-center gap-2">
                        <span className={`${colorClass} font-semibold`}>
                            {item.status}
                        </span>
                        <Switch
                            id={`switch-${item.courtname}`}
                            checked={isActive}
                            onCheckedChange={handleSwitchChange}
                            className="ml-2"
                        />
                    </div>
                );
            },
        },
        {
            header: 'Điểm số đánh giá',
            accessor: (item: Court) => (
                <div className="flex items-center gap-2 sm:max-w-[50px] whitespace-nowrap">
                    {editingItem === item ? ( // Kiểm tra xem dòng này có đang được chỉnh sửa không
                        <>
                            <input
                                type="text"
                                value={editedRatingGrade}
                                onChange={(e) => setEditedRatingGrade(e.target.value)}
                                className="border border-gray-300 px-2 py-1 w-28"
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    const now = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

                                    setCourtState((prevState) => {
                                        const updatedRatingGrade = prevState.map((z) =>
                                            z.courtname === item.courtname
                                                ? {
                                                    ...z,
                                                    avgrating: Number(editedRatingGrade), // Cập nhật điểm đánh giá
                                                    timecalavg: now,                      // Cập nhật thời điểm thống kê
                                                }
                                                : z
                                        );
                                        return updatedRatingGrade;
                                    });
                                    setEditingItem(null);
                                }}
                                className="p-1 bg-primary-500 text-white rounded hover:bg-primary-600 w-14"
                            >
                                Xong
                            </button>
                        </>
                    ) : (
                        <>
                            <span>
                                {item.avgrating}
                            </span>

                            <button
                                onClick={() => {
                                    setEditingItem(item); // Chọn dòng cần sửa
                                    setEditedRatingGrade(item.avgrating?.toString() ?? ''); // Lưu giá hiện tại vào ô input
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
        { header: 'Thời điểm thống kê', accessor: (item) => normalizeTimeString(item.timecalavg) },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-4 flex flex-col lg:flex-row gap-4">
            <div className="w-full shrink-0 lg:w-[280px]">
                <Filter
                    filters={filtersConfig}
                    values={filters}
                    setFilterValues={setFilters}
                />
            </div>
            <div className="flex flex-1 flex-col">
                <div className="flex flex-row gap-4 justify-end mb-2">
                    <div className="mb-2 hidden justify-end lg:flex">
                        <button
                            onClick={() => setIsAddZoneModalOpen(true)}
                            className="rounded bg-primary-500 px-4 py-2 text-white text-sm hover:bg-primary-600 cursor-pointer"
                        >
                            Thêm Zone
                        </button>
                    </div>
                    <div className="mb-2 hidden justify-end lg:flex">
                        <button
                            onClick={() => setIsAddCourtModalOpen(true)}
                            className="rounded bg-primary-500 px-4 py-2 text-white text-sm hover:bg-primary-600 cursor-pointer"
                        >
                            Thêm sân
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <DataTable
                        columns={CourtColumns}
                        data={courtState}
                        renderImage={undefined}
                        filterConfig={[]}
                        filters={{}}
                        setFilters={() => { }}
                        showOptions={false}
                        showMoreOption={false}
                        showHeader={true}
                    />
                </div>
            </div>

            <AddZoneModal
                onClose={() => setIsAddZoneModalOpen(false)}
                open={isAddZoneModalOpen}
                onSubmit={handleSubmit}
            />
            <AddCourtModal
                onClose={() => setIsAddCourtModalOpen(false)}
                open={isAddCourtModalOpen}
                onSubmit={handleSubmitCourt}
            />
        </div>
    );
}
