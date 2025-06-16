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

    // useEffect(() => {
    //     setPage(1);
    // }, [filters.zonename]);

    useEffect(() => {
        if (!filters.zonename || filters.zonename.length === 0) {
            setCourtState(allCourts);
        } else {
            const filteredCourts = allCourts.filter((c) =>
                filters.zonename.includes(c.zonename)
            );
            setCourtState(filteredCourts);
        }
    }, [filters.zonename, allCourts]);
    

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

                    // Gọi API cập nhật
                    await patchCourts(item.courtid!, {
                        courtname: item.courtname,
                        statuscourt: newStatus,
                        avgrating: item.avgrating,
                        timecalculateavg: new Date(item.timecalavg).toISOString(),
                        zoneid: item.zoneid,
                        courtimgurl: item.image,
                      });

                    // Cập nhật UI
                    const updatedCourts = courtState.map((c) =>
                        c.courtname === item.courtname ? { ...c, status: checked ? 'Đang hoạt động' : 'Bảo trì' } : c
                    );
                    setCourtState(updatedCourts);
                    setAllCourts(prev =>
                        prev.map((c) =>
                            c.courtname === item.courtname ? { ...c, status: checked ? 'Đang hoạt động' : 'Bảo trì' } : c
                        )
                    );
                }
                

                const colorClass = isActive ? 'text-primary-600' : 'text-orange-500';

                return (
                    <div className="flex items-center gap-2">
                        <span className={`${colorClass} font-semibold`}>{item.status}</span>
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
                                type="text"
                                value={editedRatingGrade}
                                onChange={(e) => setEditedRatingGrade(e.target.value)}
                                className="border border-gray-300 px-2 py-1 w-28"
                                autoFocus
                            />
                            <button
                                onClick={async () => {
                                    const now = new Date().toISOString();
                                    const newRating = Number(editedRatingGrade);

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
                                }}                                
                                className="p-1 bg-primary-500 text-white rounded hover:bg-primary-600 w-14"
                            >
                                Xong
                            </button>
                        </>
                    ) : (
                        <>
                            <span>{item.avgrating}</span>
                            <button
                                onClick={() => {
                                    setEditingItem(item);
                                    setEditedRatingGrade(item.avgrating?.toString() ?? '');
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
