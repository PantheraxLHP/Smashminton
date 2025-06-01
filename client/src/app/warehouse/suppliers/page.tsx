'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import AddSupplierModal, { SupplierFormData } from './AddSuppliers';
import Filter, { FilterConfig, FilterOption } from '@/components/atomic/Filter';

export interface SupplierItem {
    name: string;
    phone: string;
    email: string;
    address: string;
    image: string;
    status?: string;
}

const rawData: SupplierItem[] = [
    { name: 'Nhà cung cấp A', phone: '0909999999', email: 'nccA@gmail.com', address: '123 Đường ABC', image: '/default.png' },
    { name: 'Nhà cung cấp B', phone: '0918888888', email: 'nccB@gmail.com', address: '456 Đường XYZ', image: '/default.png' },
    { name: 'Nhà cung cấp C', phone: '0937777777', email: 'nccC@gmail.com', address: '789 Đường DEF', image: '/default.png' },
];

export default function SupplierPage() {
    const [data, setData] = useState<SupplierItem[]>([]);
    const [filteredData, setFilteredData] = useState<SupplierItem[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState<SupplierFormData | null>(null);

    const [filters, setFilters] = useState<Record<string, any>>({
        name: '',
        address: '',
    });

    // Initialize data
    useEffect(() => {
        setData(rawData);
    }, []);

    // Filter data whenever filters or data change
    useEffect(() => {
        const result = data.filter((item) => {
            const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesAddress =
                !filters.address || item.address.toLowerCase().includes(filters.address.toLowerCase());
            return matchesName && matchesAddress;
        });
        setFilteredData(result);
    }, [filters, data]);

    const filtersConfig: FilterConfig[] = [
        { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
        { filterid: 'name', filtertype: 'search', filterlabel: 'Tìm kiếm' },
        { filterid: 'address', filterlabel: 'Địa chỉ', filtertype: 'search' },
    ];

    const columns: Column<SupplierItem>[] = [
        { header: 'Tên', accessor: 'name' },
        { header: 'Số điện thoại', accessor: 'phone' },
        { header: 'Email', accessor: 'email' },
        { header: 'Địa chỉ', accessor: 'address' },
    ];

    const handleEdit = (index: number) => {
        const item = filteredData[index];
        setEditData({
            name: item.name,
            phone: item.phone,
            email: item.email,
            address: item.address,
        });
        setOpenModal(true);
    };

    const handleDelete = (index: number) => {
        const item = filteredData[index];
        if (window.confirm(`Xác nhận xóa nhà cung cấp: ${item.name}?`)) {
            const newData = data.filter((d) => d.name !== item.name);
            setData(newData);
        }
    };

    const handleSubmit = (formData: SupplierFormData) => {
        const newSupplier: SupplierItem = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            image: '/default.png',
        };

        if (editData) {
            // Edit mode
            const updated = data.map((item) => (item.name === editData.name ? newSupplier : item));
            setData(updated);
        } else {
            // Add mode
            setData([...data, newSupplier]);
        }

        setEditData(null);
        setOpenModal(false);
    };

    return (
        <div className="flex h-full w-full flex-col gap-4 p-4 lg:flex-row">
            <AddSupplierModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditData(null);
                }}
                onSubmit={handleSubmit}
                editData={editData}
            />

            <div className="w-full shrink-0 lg:w-[280px]">
                <Filter
                    filters={filtersConfig}
                    values={filters}
                    setFilterValues={setFilters}
                />
            </div>

            <div className="flex flex-1 flex-col">
                <div className="mb-2 flex justify-end pr-4">
                    <button
                        onClick={() => {
                            setOpenModal(true);
                            setEditData(null);
                        }}
                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                        Thêm
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    renderImage={(item) => (
                        <Image src={item.image} alt={item.name} width={40} height={40} />
                    )}
                    showOptions={false}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
