'use client';

import { useEffect, useState } from 'react';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import AddSupplierModal from './AddSuppliers';
import { getSuppliers, deleteSupplier } from '@/services/suppliers.service';
import Filter, { FilterConfig } from '@/components/atomic/Filter';
import { ProductOption } from './AddSuppliers';
import { toast } from 'sonner';
import PaginationComponent from '@/components/atomic/PaginationComponent';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        costprice: number;
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
    const [productsList, setProductsList] = useState<ProductOption[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(2);

    const fetchSuppliers = async () => {
        const response = await getSuppliers(page, pageSize, filters.name, filters.productname);
        if (response.ok) {
            const { data, pagination } = response.data;

            const mapped: Supplier[] = data.map((supplier: any) => ({
                supplierid: supplier.supplierid,
                name: supplier.suppliername || '',
                phone: supplier.phonenumber || '',
                email: supplier.email || '',
                contactname: supplier.contactname || '',
                address: supplier.address || '',
                products: (supplier.supply_products || []).map((p: any) => ({
                    productid: p.productid,
                    productname: p.products.productname,
                    costprice: p.costprice || 0,
                })),
            }));

            setSuppliers(mapped);
            setTotalPages(pagination.totalPages);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [filters.name, filters.productname]);

    useEffect(() => {
        fetchSuppliers();
    }, [page, filters.name, filters.productname]);

    const filtersConfig: FilterConfig[] = [
        { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
        { filterid: 'name', filtertype: 'search', filterlabel: 'Tên nhà cung cấp' },
        { filterid: 'productname', filtertype: 'search', filterlabel: 'Tên sản phẩm' },
    ];

    const columns: Column<Supplier>[] = [
        { header: 'Nhà cung cấp', accessor: 'name' },
        { header: 'Người liên hệ', accessor: 'contactname' },
        { header: 'Số điện thoại', accessor: 'phone' },
        { header: 'Email', accessor: 'email' },
        { header: 'Địa chỉ', accessor: 'address' },
        {
            header: 'Sản phẩm cung cấp',
            cell: (item) => {
                const maxVisible = 5;
                const visibleProducts = item.products.slice(0, maxVisible);
                const hiddenProducts = item.products.slice(maxVisible);
                const hiddenCount = item.products.length - maxVisible;

                return (
                    <div className="flex flex-wrap gap-1 items-center">
                        {visibleProducts.map((p) => (
                            <span
                                key={p.productid}
                                className="inline-block rounded bg-gray-200 px-2 py-1 text-xs"
                            >
                                {p.productname} - {Number(p.costprice).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </span>
                        ))}

                        {hiddenCount > 0 && (
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="cursor-pointer text-sm text-primary-600 underline">
                                            và {hiddenCount} sản phẩm khác
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-white text-black border border-gray-300 shadow-sm outline-none ring-0 rounded-md text-xs max-h-40 overflow-y-auto space-y-1 p-2">
                                        {hiddenProducts.map((p) => (
                                            <div key={p.productid}>
                                                {p.productname} - {p.costprice.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </div>
                                        ))}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                );
            },
        }
    ];

    const handleEdit = (index: number) => {
        const supplier = suppliers[index];
        setEditData({ ...supplier });
        setEditIndex(index);
        setOpenModal(true);
    };

    const handleDelete = async (index: number) => {
        const supplier = suppliers[index];
        if (!supplier.supplierid) return;

        const result = await deleteSupplier(supplier.supplierid);
        // console.log(supplier.supplierid);
        if (result.ok) {
            toast.success('Xoá nhà cung cấp thành công!');
            await fetchSuppliers();
        } else {
            toast.error(`Lỗi khi xoá: ${result.message}`);
        }
        setPage(1);
    };


    const handleSubmit = async (formData: Supplier, isEdit: boolean) => {
        if (isEdit) {
            toast.success('Cập nhật nhà cung cấp thành công!');
        } else {
            toast.success('Thêm nhà cung cấp thành công!');
        }

        setOpenModal(false);
        setEditIndex(null);
        setEditData(null);
        fetchSuppliers();
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

            <div className={`w-full shrink-0 lg:w-[280px]`}>
                <Filter
                    filters={filtersConfig}
                    values={filters}
                    setFilterValues={setFilters}
                />
            </div>

            <div className="flex flex-1 flex-col">
                <div className="mb-2 flex justify-end">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                    >
                        Thêm nhà cung cấp
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={suppliers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showOptions={false}
                    showMoreOption={true}
                    showHeader
                    showDelete
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
