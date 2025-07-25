'use client';

import React, { useState, useEffect } from 'react';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import AddZoneModal from './AddZone';
import AddCourtModal from './AddCourt';
import { Switch } from '@/components/ui/switch';
import { FaRegEdit } from 'react-icons/fa';
import { getZoneCourt } from '@/services/zones.service';
import { patchCourts } from '@/services/courts.service';
import PaginationComponent from '@/components/atomic/PaginationComponent';
import { ratingSchema } from "../warehouse.schema";
import { z } from "zod";
import { toast } from 'sonner';

export interface Zone {
    zoneid?: number;
    zonename: string;
    type: string;
    image: string;
    description: string;
}

export interface Court {
    courtid?: number;
    courtname: string;
    image: string;
    status: string;
    avgrating: number;
    timecalavg: string;
    zoneid: number;
    zonename?: string;
}

function normalizeTimeString(time: string) {
    if (!time.includes(':')) return time;
    const [hour, minute] = time.split(':').map(Number);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

export default function ZoneCourtManager() {
    const [zoneState, setZoneState] = useState<Zone[]>([]);
    const [courtState, setCourtState] = useState<Court[]>([]);
    const [allCourts, setAllCourts] = useState<Court[]>([]);
    const [editingItem, setEditingItem] = useState<Court | null>(null);
    const [editedRatingGrade, setEditedRatingGrade] = useState<string>('');
    const [isAddZoneModalOpen, setIsAddZoneModalOpen] = useState(false);
    const [isAddCourtModalOpen, setIsAddCourtModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(2);
    const [filters, setFilters] = useState<Record<string, any>>({
        zonename: [],
    });

    async function fetchZoneCourtData() {
        try {
            const res = await getZoneCourt(page, pageSize);

            if (!res.ok || !res.data) {
                console.error('API trả về lỗi:', res.message);
                return;
            }

            const { data, pagination } = res.data as {
                data: any[];
                pagination: { page: number; totalPages: number };
            };

            if (!Array.isArray(data)) {
                console.error('Dữ liệu không hợp lệ: data không phải là mảng');
                return;
            }

            const transformedZones: Zone[] = data.map((z: any) => ({
                zonename: z.zonename,
                type: z.zonetype,
                image: z.zoneimgurl || '/default.png',
                description: z.zonedescription,
            }));

            const transformedCourts: Court[] = data.flatMap((z: any) =>
                (z.courts || []).map((c: any) => ({
                    courtid: c.courtid,
                    courtname: c.courtname,
                    image: c.courtimgurl || '/default.png',
                    status: c.courtstatus === 'Active' ? 'Đang hoạt động' : 'Bảo trì',
                    avgrating: parseFloat(c.courtavgrating),
                    timecalavg: c.courttimecalculateavg?.split('T')[0] ?? '',
                    zonename: z.zonename,
                    zoneid: z.zoneid,
                }))
            );

            setZoneState(transformedZones);
            setCourtState(transformedCourts);
            setAllCourts(transformedCourts);
            setFilters({
                zonename: transformedZones.map(z => z.zonename),
            });

            setTotalPages(pagination.totalPages);
        } catch (error) {
            console.error('Lỗi khi gọi API getZoneCourt:', error);
        }
    }

    useEffect(() => {
        fetchZoneCourtData();
    }, [page]);


    useEffect(() => {
        if (!filters.zonename || filters.zonename.length === 0 || zoneState.length === 0) {
            setCourtState(allCourts);
        } else if (filters.zonename.length === zoneState.length) {
            setCourtState(allCourts);
        } else {
            const filteredCourts = allCourts.filter((c) =>
                filters.zonename.includes(c.zonename)
            );
            setCourtState(filteredCourts);
        }
    }, [filters.zonename, allCourts, zoneState]);



    const zoneOptions: FilterOption[] = zoneState.map((zone) => ({
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
        const updatedZones = [...zoneState, {
            ...newZone,
            image: newZone.image || '/default.png',
        }];
        setZoneState(updatedZones);
        setFilters(prev => ({
            ...prev,
            zonename: updatedZones.map(z => z.zonename),
        }));
    }

    function handleSubmitCourt(newCourt: Court) {
        const courtWithImage = {
            ...newCourt,
            image: newCourt.image?.trim() ? newCourt.image : '/default.png',
        };

        const updatedCourts = [...allCourts, courtWithImage];
        setAllCourts(updatedCourts);

        if (!filters.zonename || filters.zonename.length === 0) {
            setCourtState(updatedCourts);
        } else {
            const filtered = updatedCourts.filter(c =>
                filters.zonename.includes(c.zonename ?? '')
            );
            setCourtState(filtered);
        }

        setIsAddCourtModalOpen(false);
    }

    const CourtColumns: Column<Court>[] = [
        {
            header: 'Sân',
            accessor: (item) => (
                <div className="flex items-center gap-2">
                    <img
                        src={item.image?.trim() ? item.image : "/default.png"}
                        alt=""
                        className="w-6 h-6 rounded object-cover"
                    />
                    {item.courtname}
                </div>
            ),
        },
        {
            header: 'Tình trạng',
            accessor: (item) => {
                const isActive = item.status === 'Đang hoạt động';

                async function handleSwitchChange(checked: boolean) {
                    const newStatus = checked ? 'Active' : 'Inactive';

                    try {
                        await patchCourts(item.courtid!, {
                            courtname: item.courtname,
                            statuscourt: newStatus,
                            avgrating: item.avgrating,
                            timecalculateavg: new Date(item.timecalavg).toISOString(),
                            zoneid: item.zoneid,
                            courtimgurl: item.image,
                        });

                        // Nếu không bị throw thì mới cập nhật UI
                        const updatedCourts = courtState.map((c) =>
                            c.courtid === item.courtid ? { ...c, status: checked ? 'Đang hoạt động' : 'Bảo trì' } : c
                        );
                        setCourtState(updatedCourts);
                        setAllCourts(prev =>
                            prev.map((c) =>
                                c.courtid === item.courtid ? { ...c, status: checked ? 'Đang hoạt động' : 'Bảo trì' } : c
                            )
                        );

                        toast.success('Cập nhật tình trạng thành công!');
                    } catch (error: any) {
                        //console.error('Lỗi cập nhật tình trạng:', error);
                        toast.error(error?.message || 'Cập nhật thất bại!');
                    }
                }

                const colorClass = isActive ? 'text-primary-600' : 'text-orange-500';

                return (
                    <div className="flex items-center gap-2">
                        <span className={`${colorClass} font-semibold min-w-[110px]`}>{item.status}</span>
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
                    {editingItem === item ? (
                        <>
                            <input
                                type="number"
                                value={editedRatingGrade}
                                onChange={(e) => setEditedRatingGrade(e.target.value)}
                                className="border border-gray-300 px-2 py-1 w-28"
                                autoFocus
                            />
                            <button
                                onClick={async () => {
                                    const now = new Date().toISOString();
                                    const newRating = Number(editedRatingGrade);
                                    try {
                                        ratingSchema.parse(newRating);
                                    } catch (error) {
                                        if (error instanceof z.ZodError) {
                                            toast.error(error.errors[0].message);
                                        }
                                        return;
                                    }

                                    await patchCourts(item.courtid!, {
                                        courtname: item.courtname,
                                        statuscourt: item.status === 'Đang hoạt động' ? 'Active' : 'Inactive',
                                        avgrating: newRating,
                                        timecalculateavg: now,
                                        zoneid: item.zoneid,
                                        courtimgurl: item.image,
                                    });

                                    const updated = courtState.map((z) =>
                                        z.courtname === item.courtname
                                            ? {
                                                ...z,
                                                avgrating: newRating,
                                                timecalavg: now.split('T')[0],
                                            }
                                            : z
                                    );
                                    setCourtState(updated);
                                    setAllCourts((prev) =>
                                        prev.map((z) =>
                                            z.courtname === item.courtname
                                                ? {
                                                    ...z,
                                                    avgrating: newRating,
                                                    timecalavg: now.split('T')[0],
                                                }
                                                : z
                                        )
                                    );

                                    setEditingItem(null);

                                    toast.success('Cập nhật điểm số thành công!');
                                }}
                                className="p-1 bg-primary-500 text-white rounded hover:bg-primary-600 w-14"
                            >
                                Xong
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-1">
                                <span className="inline-block text-sm text-right w-12">
                                    {item.avgrating?.toFixed(1)}
                                </span>
                                <button
                                    onClick={() => {
                                        setEditingItem(item);
                                        setEditedRatingGrade(item.avgrating?.toString() ?? '');
                                    }}
                                    className="p-1 text-primary-500 hover:text-primary-600 cursor-pointer"
                                >
                                    <FaRegEdit size={14} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ),
        },
        {
            header: 'Thời điểm thống kê',
            accessor: (item) => normalizeTimeString(item.timecalavg),
        },
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
                    <div className="mb-2 flex justify-end">
                        <button
                            onClick={() => setIsAddZoneModalOpen(true)}
                            className="rounded bg-primary-500 px-4 py-2 text-white text-sm hover:bg-primary-600 cursor-pointer mr-2"
                        >
                            Thêm khu vực
                        </button>
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

            <AddZoneModal
                onClose={() => setIsAddZoneModalOpen(false)}
                open={isAddZoneModalOpen}
                onSubmit={handleSubmit}
                onSuccess={() => {
                    fetchZoneCourtData();
                    setIsAddZoneModalOpen(false);
                }}
            />
            <AddCourtModal
                onClose={() => setIsAddCourtModalOpen(false)}
                open={isAddCourtModalOpen}
                onSubmit={handleSubmitCourt}
                onSuccess={fetchZoneCourtData}
            />
        </div>
    );
}
