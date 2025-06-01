'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import AddSupplierModal, { SupplierFormData } from './AddSuppliers';
import { getSuppliers } from '@/services/suppliers.service';
import Filter, { FilterConfig } from '@/components/atomic/Filter';

interface Supplier {
    name: string;
    phone: string;
    email: string;
    address: string;
    logo: string;
}

export default function SupplierManagementPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [filters, setFilters] = useState<Record<string, any>>({
        name: '',
        phone: '',
        email: '',
    });
    const [openModal, setOpenModal] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<SupplierFormData | null>(null);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    useEffect(() => {
        const fetchSuppliers = async () => {
            const response = await getSuppliers();
            if (response.ok) {
                setSuppliers(response.data);
            }
            console.log(response);
        };
        fetchSuppliers();
    }, []);

    const filtersConfig: FilterConfig[] = [
        {
            filterid: 'name',
            filtertype: 'search',
            filterlabel: 'Tìm theo tên',
        },
        {
            filterid: 'phone',
            filtertype: 'search',
            filterlabel: 'Tìm theo số điện thoại',
        },
        {
            filterid: 'email',
            filtertype: 'search',
            filterlabel: 'Tìm theo email',
        },
    ];

    const columns: Column<Supplier>[] = [
        { header: 'Nhà phân phối', accessor: 'name' },
        { header: 'Số điện thoại', accessor: 'phone' },
        { header: 'Email', accessor: 'email' },
        { header: 'Địa chỉ', accessor: 'address' },
    ];

    const filteredData = suppliers.filter((item) => {
        const matchesName =
            !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
        const matchesPhone =
            !filters.phone || item.phone.includes(filters.phone);
        const matchesEmail =
            !filters.email || item.email.toLowerCase().includes(filters.email.toLowerCase());
        return matchesName && matchesPhone && matchesEmail;
    });

    const handleEdit = (index: number) => {
        const supplier = filteredData[index];
        setEditData({
            name: supplier.name,
            phone: supplier.phone,
            email: supplier.email,
            address: supplier.address,
        });
        setEditIndex(index);
        setOpenModal(true);
    };

    const handleDelete = (index: number) => {
        const supplier = filteredData[index];
        const confirmed = window.confirm(`Xác nhận xóa nhà cung cấp: ${supplier.name}?`);
        if (confirmed) {
            const realIndex = suppliers.findIndex((d) => d.name === supplier.name);
            if (realIndex !== -1) {
                const newData = [...suppliers];
                newData.splice(realIndex, 1);
                setSuppliers(newData);
            }
        }
    };

    const handleSubmit = (formData: SupplierFormData) => {
        const newSupplier: Supplier = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            logo: '/default.png',
        };

        if (editIndex !== null) {
            const realIndex = suppliers.findIndex((d) => d.name === filteredData[editIndex].name);
            if (realIndex !== -1) {
                const updated = [...suppliers];
                updated[realIndex] = newSupplier;
                setSuppliers(updated);
            }
        } else {
            setSuppliers([...suppliers, newSupplier]);
        }

        setOpenModal(false);
        setEditIndex(null);
    };

    return (
        <div className="flex h-full w-full flex-col gap-4 p-4 lg:flex-row">
            <AddSupplierModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditData(null);
                    setEditIndex(null);
                }}
                onSubmit={handleSubmit}
                editData={editData}
            />

            {/* Mobile Filter Toggle */}
            <div className="mb-2 flex items-center justify-between lg:hidden">
                <button
                    onClick={() => setShowMobileFilter((prev) => !prev)}
                    className="rounded bg-gray-200 px-3 py-2"
                >
                    {showMobileFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                </button>

                <button
                    onClick={() => setOpenModal(true)}
                    className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                >
                    Thêm
                </button>
            </div>

            {/* Filter Component */}
            <div className={`w-full shrink-0 lg:w-[280px] ${showMobileFilter ? 'block' : 'hidden'} lg:block`}>
                <Filter
                    filters={filtersConfig}
                    values={filters}
                    setFilterValues={setFilters}
                />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                <div className="mb-2 hidden justify-end pr-4 lg:flex">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    >
                        Thêm
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredData}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    renderImage={(item) => (
                        <Image src={item.logo} alt={item.name} width={40} height={40} />
                    )}
                    showOptions={false}
                />
            </div>
        </div>
    );
}
