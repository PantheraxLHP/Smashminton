'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import SidebarFilter from '../../../components/warehouse/SidebarFilter';
import DataTable, { Column, FilterConfig } from '../../../components/warehouse/DataTable';
import AddSupplierModal, { SupplierFormData } from './AddSuppliers';

interface Supplier {
    name: string;
    phone: string;
    email: string;
    address: string;
    logo: string;
}

const initialSuppliers: Supplier[] = [
    {
        name: 'Đại Hưng Sport',
        phone: '0902506901',
        email: 'daihungsport@gmail.com',
        address: '432 Lý Thái Tổ, Phường 10, Quận 10, TP. Hồ Chí Minh, Việt Nam',
        logo: '/default.png',
    },
    {
        name: 'Tuấn Hạnh Sport',
        phone: '02437338284',
        email: 'tuanhanhsport@gmail.com',
        address: '438 Lê Hồng Phong, Ba Đình, Hà Nội',
        logo: '/default.png',
    },
    {
        name: 'Pepsico',
        phone: '0902506901',
        email: 'daihungsport@gmail.com',
        address: '432 Lý Thái Tổ, Phường 10, Quận 10, TP. Hồ Chí Minh, Việt Nam',
        logo: '/default.png',
    },
    {
        name: 'Bánh kẹo Nguyễn Phước',
        phone: '02437338284',
        email: 'tuanhanhsport@gmail.com',
        address: '438 Lê Hồng Phong, Ba Đình, Hà Nội',
        logo: '/default.png',
    },
];

function getUniqueOptions<T>(data: T[], key: keyof T): string[] {
    return Array.from(new Set(data.map((item) => item[key] as string))).sort();
}

export default function SupplierManagementPage() {
    const [data, setData] = useState<Supplier[]>(initialSuppliers);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [openModal, setOpenModal] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<SupplierFormData | null>(null);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const filtersConfig: FilterConfig[] = [
        {
            key: 'name',
            type: 'search',
            placeholder: 'Tìm theo tên',
        },
        {
            key: 'phone',
            type: 'search',
            placeholder: 'Tìm theo số điện thoại',
        },
        {
            key: 'email',
            type: 'search',
            placeholder: 'Tìm theo email',
        },
    ];

    useEffect(() => {
        const initial: Record<string, any> = {};
        filtersConfig.forEach((c) => {
            if (c.type === 'search') initial[c.key] = '';
            if (c.type === 'checkbox') initial[c.key] = [];
            if (c.type === 'range') initial[c.key] = [c.min, c.max];
        });
        setFilters(initial);
    }, []);

    const columns: Column<Supplier>[] = [
        { header: 'Nhà phân phối', accessor: 'name' },
        { header: 'Số điện thoại', accessor: 'phone' },
        { header: 'Email', accessor: 'email' },
        { header: 'Địa chỉ', accessor: 'address' },
    ];

    const filteredData = data.filter((item) => {
        const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
        const matchesPhone = !filters.phone || item.phone.includes(filters.phone);
        const matchesEmail = !filters.email || item.email.toLowerCase().includes(filters.email.toLowerCase());
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
            const realIndex = data.findIndex((d) => d.name === supplier.name);
            if (realIndex !== -1) {
                const newData = [...data];
                newData.splice(realIndex, 1);
                setData(newData);
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
            const realIndex = data.findIndex((d) => d.name === filteredData[editIndex].name);
            if (realIndex !== -1) {
                const updated = [...data];
                updated[realIndex] = newSupplier;
                setData(updated);
            }
        } else {
            setData([...data, newSupplier]);
        }

        setOpenModal(false);
        setEditIndex(null);
    };

    return (
        <div className="flex flex-col lg:flex-row h-full w-full p-4 gap-4">
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
            <div className="flex justify-between items-center mb-2 lg:hidden">
                <button
                    onClick={() => setShowMobileFilter((prev) => !prev)}
                    className="bg-gray-200 px-3 py-2 rounded"
                >
                    {showMobileFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                </button>

                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                    Thêm
                </button>
            </div>

            {/* Sidebar Filter */}
            <div className={`w-full lg:w-[280px] shrink-0 ${showMobileFilter ? 'block' : 'hidden'} lg:block`}>
                <SidebarFilter filters={filters} setFilters={setFilters} config={filtersConfig} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="hidden lg:flex justify-end mb-2 pr-4">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
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
