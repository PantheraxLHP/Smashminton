'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import AddSupplierModal from './AddSuppliers';
import { getSuppliers } from '@/services/suppliers.service';
import Filter, { FilterConfig } from '@/components/atomic/Filter';

type ProductOption = {
    productid: number;
    productname: string;
};

export interface Supplier {
    name: string;
    phone: string;
    email: string;
    address: string;
    products: {
        productid: number;
        productname: string;
    }[];
}

export default function SupplierManagementPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [filters, setFilters] = useState<Record<string, any>>({
        name: '',
        phone: '',
        productname: '',
    });
    const [openModal, setOpenModal] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<Supplier | null>(null);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [productsList, setProductsList] = useState<ProductOption[]>([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            const response = await getSuppliers();
            if (response.ok) {
                setProductsList(response.data);
                const mapped: Supplier[] = response.data.map((supplier: any) => ({
                    name: supplier.suppliername || '',
                    phone: supplier.phonenumber || '',
                    email: supplier.email || '',
                    address: supplier.address || '',
                    products: (supplier.products || []).map((p: any) => ({
                        productid: p.productid,
                        productname: p.productname,
                    }))
                }));
                setSuppliers(mapped);
            }
        };
        fetchSuppliers();
    }, []);

    const filtersConfig: FilterConfig[] = [
        { filterid: 'name', filtertype: 'search', filterlabel: 'Tìm theo tên nhà cung cấp' },
        { filterid: 'productname', filtertype: 'search', filterlabel: 'Tìm theo tên sản phẩm' }
    ];

    const columns: Column<Supplier>[] = [
        { header: 'Nhà phân phối', accessor: 'name' },
        { header: 'Số điện thoại', accessor: 'phone' },
        { header: 'Email', accessor: 'email' },
        { header: 'Địa chỉ', accessor: 'address' },
        {
            header: 'Sản phẩm cung cấp',
            cell: (item) => (
                <div className="flex flex-wrap gap-1">
                    {item.products.map((p) => (
                        <span key={p.productid} className="inline-block rounded bg-gray-200 px-2 py-1 text-xs">
                            {p.productname}
                        </span>
                    ))}
                </div>
            ),
        },
    ];

    const filteredData = suppliers.filter((item) => {
        const matchesName = !filters.name || item.name.toLowerCase().includes(filters.name.toLowerCase());
        const matchesProductName = !filters.productname || item.products.some((p) =>
            p.productname.toLowerCase().includes(filters.productname.toLowerCase())
        );
        return matchesName && matchesProductName;
    });

    const handleEdit = (index: number) => {
        const supplier = filteredData[index];
        setEditData({ ...supplier });
        setEditIndex(index);
        setOpenModal(true);
    };

    const handleDelete = (index: number) => {
        const supplier = filteredData[index];
        const confirmed = window.confirm(`Xác nhận xóa nhà cung cấp: ${supplier.name}?`);
        if (confirmed) {
            const realIndex = suppliers.findIndex(
                (s) => s.name === supplier.name && s.phone === supplier.phone
            );
            if (realIndex !== -1) {
                const newData = [...suppliers];
                newData.splice(realIndex, 1);
                setSuppliers(newData);
            }
        }
    };

    const handleSubmit = (formData: Supplier) => {
        if (editIndex !== null) {
            const realIndex = suppliers.findIndex(
                (s) => s.name === filteredData[editIndex].name && s.phone === filteredData[editIndex].phone
            );
            if (realIndex !== -1) {
                const updated = [...suppliers];
                updated[realIndex] = { ...formData };
                setSuppliers(updated);
            }
        } else {
            setSuppliers([...suppliers, { ...formData }]);
        }

        setOpenModal(false);
        setEditIndex(null);
        setEditData(null);
    };

    return (
        <div className="flex h-full w-full flex-col gap-4 p-6 lg:flex-row">
            <AddSupplierModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                    setEditData(null);
                    setEditIndex(null);
                }}
                onSubmit={handleSubmit}
                editData={editData}
                //productsList={productsList}
            />

            <div className={`w-full shrink-0 lg:w-[280px] ${showMobileFilter ? 'block' : 'hidden'} lg:block`}>
                <Filter
                    filters={filtersConfig}
                    values={filters}
                    setFilterValues={setFilters}
                />
            </div>

            <div className="flex flex-1 flex-col">
                <div className="mb-2 hidden justify-end lg:flex">
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
                    showOptions={false}
                    showMoreOption={true}
                    showHeader
                />
            </div>
        </div>
    );
}
