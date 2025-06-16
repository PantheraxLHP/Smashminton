'use client';

import { useEffect, useState } from 'react';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import AddSupplierModal from './AddSuppliers';
import { getSuppliers, deleteSupplier } from '@/services/suppliers.service';
import Filter, { FilterConfig } from '@/components/atomic/Filter';
import { ProductOption } from './AddSuppliers';
import { toast } from 'sonner';
import PaginationComponent from '@/components/atomic/PaginationComponent';


export interface Supplier {
    supplierid?: number;
    name: string;
    contactname: string;
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
        productname: '',
    });
    const [openModal, setOpenModal] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editData, setEditData] = useState<Supplier | null>(null);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [productsList, setProductsList] = useState<ProductOption[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(4);
    const [totalPages, setTotalPages] = useState(2);

    const fetchSuppliers = async () => {
        console.log('[DEBUG] Fetching suppliers with page:', page, 'pageSize:', pageSize);
        const response = await getSuppliers(page, pageSize);
        if (response.ok) {
            const { data, pagination } = response.data;

            const mapped: Supplier[] = data.map((supplier: any) => ({
                supplierid: supplier.supplierid,
                name: supplier.suppliername || '',
                phone: supplier.phonenumber || '',
                email: supplier.email || '',
                contactname: supplier.contactname || '',
                address: supplier.address || '',
                products: (supplier.products || []).map((p: any) => ({
                    productid: p.productid,
                    productname: p.productname,
                })),
            }));

            setSuppliers(mapped);
            setTotalPages(pagination.totalPages);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, [page]);


    const filtersConfig: FilterConfig[] = [
        { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
        { filterid: 'name', filtertype: 'search', filterlabel: 'Tìm theo tên nhà cung cấp' },
        { filterid: 'productname', filtertype: 'search', filterlabel: 'Tìm theo tên sản phẩm' },
    ];

    const columns: Column<Supplier>[] = [
        { header: 'Nhà phân phối', accessor: 'name' },
        { header: 'Người liên hệ', accessor: 'contactname' },
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

    const handleDelete = async (index: number) => {
        const supplier = filteredData[index];
        const confirmed = window.confirm(`Xác nhận xóa nhà cung cấp: ${supplier.name}?`);
        if (!confirmed || !supplier.supplierid) return;

        const result = await deleteSupplier(supplier.supplierid);

        if (result.ok) {
            toast.success('Xoá nhà cung cấp thành công!');
            await fetchSuppliers();
        } else {
            toast.error(`Lỗi khi xoá: ${result.message}`);
        }
    };


    const handleSubmit = (formData: Supplier, isEdit: boolean) => {
        if (isEdit && formData.supplierid !== undefined) {
            const realIndex = suppliers.findIndex(s => s.supplierid === formData.supplierid);
            if (realIndex !== -1) {
                const updated = [...suppliers];
                updated[realIndex] = { ...formData };
                setSuppliers(updated);
                toast.success('Cập nhật nhà cung cấp thành công!');
            }
        } else {
            const { supplierid, ...newSupplierData } = formData;
            setSuppliers([...suppliers, newSupplierData as Supplier]);
            toast.success('Thêm nhà cung cấp thành công!');
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
                        Thêm nhà cung cấp
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
        </div>
    );
}
