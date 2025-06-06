'use client';

import React, { useState, useEffect } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { ZonePrices } from '@/types/types';
import { getZonePrices } from '@/services/zoneprice.service';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import { z } from 'zod';

interface ZonePriceProps extends ZonePrices {
    zonename: string;
    zoneimgurl: string;
}

export default function CourtPriceManager() {
    const [zonePricesState, setZonePricesState] = useState<ZonePriceProps[]>([]);
    const [editingItem, setEditingItem] = useState<ZonePriceProps | null>(null);  // Dòng đang sửa
    const [editedPrice, setEditedPrice] = useState<string>(''); // Giá trị nhập vào khi chỉnh sửa

    useEffect(() => {
        const fetchZonePrices = async () => {
            const response = await getZonePrices();
            if (response.ok) {
                const newData: ZonePriceProps[] = response.data.map((item: any) => ({
                    ...item,
                    price: Number(item.price),
                    zonename: item.zonename ?? '',
                    zoneimgurl: item.zoneimgurl ?? '',
                }));
                setZonePricesState(newData);
            }
            console.log(response);
        };
        fetchZonePrices();
    }, []);

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
                    {editingItem === item ? ( // Kiểm tra xem dòng này có đang được chỉnh sửa không
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
                                    // Tạo bản sao của mảng zonePricesState và chỉ sửa dòng đang chỉnh sửa
                                    setZonePricesState((prevState) => {
                                        const updatedPrices = prevState.map((z) =>
                                            z.zonepriceid === item.zonepriceid
                                                ? { ...z, price: Number(editedPrice) } // Chỉ sửa giá của dòng hiện tại
                                                : z
                                                
                                        );
                                        return updatedPrices;
                                    });
                                    setEditingItem(null); // Sau khi sửa xong, hủy trạng thái chỉnh sửa
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
                                    setEditingItem(item); // Chọn dòng cần sửa
                                    setEditedPrice(item.price?.toString() ?? ''); // Lưu giá hiện tại vào ô input
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
