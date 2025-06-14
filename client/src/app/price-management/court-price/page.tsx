'use client';

import React, { useState, useEffect } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { ZonePrices } from '@/types/types';
import { getZonePrices, patchZonePrices } from '@/services/zoneprice.service';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';
import { toast } from 'sonner';


interface ZonePriceProps extends ZonePrices {
    zonename: string;
    zoneimgurl: string;
}

export default function CourtPriceManager() {
    const [zonePricesState, setZonePricesState] = useState<ZonePriceProps[]>([]);
    const [editingItem, setEditingItem] = useState<ZonePriceProps | null>(null);  // Dòng đang sửa
    const [editedPrice, setEditedPrice] = useState<string>(''); // Giá trị nhập vào khi chỉnh sửa
    const [filteredData, setFilteredData] = useState<ZonePriceProps[]>([]);


    const [filters, setFilters] = useState<Record<string, any>>({
        zonename: '',
    });

    const fetchZonePrices = async () => {
        const response = await getZonePrices();
        if (response.ok) {
            const newData: ZonePriceProps[] = response.data.map((item: any) => ({
                ...item,
                price: Number(item.price),
                zonename: item.zonename ?? '',
                zoneimgurl: item.zoneimgurl ?? '',
                zonepriceid: item.zonepriceid,
            }));
            setZonePricesState(newData);
        }
        //console.log(response);
    };


    useEffect(() => {
        fetchZonePrices();
    }, []);
    

    useEffect(() => {
        const result = zonePricesState.filter((item) => {
            const matchesName =
                !filters.zonename ||
                (Array.isArray(filters.zonename)
                    ? filters.zonename.includes(item.zonename)
                    : item.zonename.toLowerCase().includes(filters.zonename.toLowerCase()));
            return matchesName;
        });
        setFilteredData(result);
    }, [filters, zonePricesState]);

    const getUniqueOptions = (data: ZonePriceProps[], key: keyof ZonePriceProps) => {
        return Array.from(new Set(data.map((item) => item[key]))).filter(Boolean) as string[];
    };

    const zoneOptions: FilterOption[] = getUniqueOptions(zonePricesState, 'zonename').map((option) => ({
        optionlabel: option,
        optionvalue: option,
    }));

    const filtersConfig: FilterConfig[] = [
        { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
        { filterid: 'zonename', filterlabel: 'Chọn khu vực', filtertype: 'checkbox', filteroptions: zoneOptions },
    ];

    const zoneColumns: Column<ZonePriceProps>[] = [
        {
            header: 'Zone',
            accessor: (item) => (
                <div className="flex items-center gap-2">
                    <img src={item.zoneimgurl} alt="" className="w-6 h-6 rounded object-cover" />
                    {item.zonename}
                </div>
            ),
        },
        { header: 'Từ', accessor: 'dayfrom' },
        { header: 'Đến', accessor: 'dayto' },
        { header: 'Giờ bắt đầu', accessor: 'starttime' },
        { header: 'Giờ kết thúc', accessor: 'endtime' },
        {
            header: 'Giá / giờ',
            accessor: (item: ZonePriceProps) => (
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
                                onClick={async () => {
                                    const parsedPrice = Number(editedPrice);
                                    if (isNaN(parsedPrice) || parsedPrice < 0) {
                                        alert('Vui lòng nhập giá hợp lệ!');
                                        return;
                                    }

                                    if (item.zonepriceid === undefined) {
                                        alert('Thiếu zonepriceid, không thể cập nhật.');
                                        return;
                                    }

                                    const response = await patchZonePrices(item.zonepriceid, { price: parsedPrice });                                                                    

                                    if (response.ok) {
                                        await fetchZonePrices();
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
                            <span>
                                {Number(item.price).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </span>

                            <button
                                onClick={() => {
                                    setEditingItem(item);
                                    setEditedPrice(item.price?.toString() ?? '');
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
            <div className="w-full shrink-0 lg:w-[280px]">
                <Filter filters={filtersConfig} values={filters} setFilterValues={setFilters} />
            </div>
            <div className="flex flex-1 flex-col">
                <DataTable
                    columns={zoneColumns}
                    data={filteredData}
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
    );
}
