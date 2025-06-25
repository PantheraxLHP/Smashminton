'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import VerifyOrderModal from './VerifyOrder';
import { useAuth } from '@/context/AuthContext';
import { getAllPurchaseOrder } from '@/services/purchaseorder.service';
import PaginationComponent from '@/components/atomic/PaginationComponent';

export interface PurchaseOrder {
    orderid: number;
    productid: number;
    productname: string;
    supplierid: number;
    suppliername: string;
    batchid: string;
    employeeid: number;
    price: number;
    quantity: number;
    deliverydate?: string;
    status?: string;
}

export default function PurchaseOrderPage() {
    const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'canceled'>('pending');
    const [ordersState, setOrdersState] = useState<PurchaseOrder[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useAuth();

    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

    const fetchOrders = async () => {
        const res = await getAllPurchaseOrder(page, pageSize);
        if (res.ok) {
            const { data, pagination } = res.data;
            console.log('Fetched purchase orders:', data);

            const mapped: PurchaseOrder[] = data.map((po: any) => ({
                orderid: po.poid,
                productid: po.productid,
                productname: po.products?.productname || '',
                supplierid: po.suppliers?.supplierid || 0,
                employeeid: user?.accountid || '',
                suppliername: po.suppliers?.suppliername || '',
                batchid: String(po.batchid),
                price: Number(po.products?.sellingprice || 0),
                quantity: po.quantity,
                deliverydate: po.deliverydate ? po.deliverydate.split('T')[0] : undefined,
                status:
                    po.statusorder === 'pending'
                        ? 'Chờ giao hàng'
                        : po.statusorder === 'delivered'
                            ? 'Đã nhận hàng'
                            : po.statusorder === 'canceled'
                                ? 'Đã huỷ'
                                : po.statusorder || 'Chờ giao hàng',

            }));

            setOrdersState(mapped);
            setTotalPages(pagination.totalPages);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const handleOpenVerifyModal = (order: PurchaseOrder) => {
        setSelectedOrder(order);
        setVerifyModalOpen(true);
    };

    const handleVerifySubmit = (data: PurchaseOrder) => {
        const today = new Date().toISOString().split('T')[0];

        setOrdersState((prev) =>
            prev.map((order) =>
                order.orderid === data.orderid
                    ? {
                        ...order,
                        status: 'Đã nhận hàng',
                        deliverydate: today,
                        quantity: data.quantity,
                    }
                    : order
            )
        );
    };

    const handleCancelOrder = (orderId: number) => {
        setOrdersState((prev) =>
            prev.map((order) =>
                order.orderid === orderId && order.status === 'Chờ giao hàng'
                    ? { ...order, status: 'Đã huỷ' }
                    : order
            )
        );
    };

    const columns: Column<PurchaseOrder>[] = [
        { header: 'Mã đơn hàng', accessor: 'orderid' },
        { header: 'Nhà cung cấp', accessor: 'suppliername' },
        { header: 'Sản phẩm', accessor: 'productname' },
        { header: 'Giá / Sản phẩm', accessor: 'price' },
        { header: 'Số lượng', accessor: 'quantity' },
        {
            header: 'Tổng giá',
            accessor: (item) => <span>{(item.price * item.quantity).toLocaleString()} đ</span>,
        },
        {
            header: 'Trạng thái',
            accessor: (item) => {
                let colorClass = 'text-primary-600';
                if (item.status === 'Chờ giao hàng') colorClass = 'text-yellow-500';
                if (item.status === 'Đã huỷ') colorClass = 'text-red-500';

                return (
                    <span className={`${colorClass} font-semibold`}>
                        {item.status}
                        {item.status === 'Chờ giao hàng' && '...'}
                    </span>
                );
            },
        },
    ];

    if (activeTab === 'completed') {
        columns.splice(6, 0, { header: 'Ngày giao hàng', accessor: 'deliverydate' });
    }

    if (activeTab === 'pending') {
        columns.push({
            header: '',
            accessor: (item) =>
                item.status !== 'Đã nhận hàng' && item.status !== 'Đã huỷ' ? (
                    <button
                        className="bg-primary-500 text-white px-3 py-2 rounded hover:bg-primary-600 mr-2 cursor-pointer"
                        onClick={() => handleOpenVerifyModal(item)}
                    >
                        Xác nhận đơn
                    </button>
                ) : null,
        });
        columns.push({
            header: '',
            accessor: (item) =>
                item.status === 'Chờ giao hàng' ? (
                    <button
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer"
                        onClick={() => handleCancelOrder(item.orderid)}
                    >
                        Huỷ đơn
                    </button>
                ) : null,
        });
    }

    const filteredOrders = ordersState.filter((order) => {
        if (activeTab === 'pending') {
            return order.status === 'Chờ giao hàng';
        } else if (activeTab === 'completed') {
            return order.status === 'Đã nhận hàng';
        } else if (activeTab === 'canceled') {
            return order.status === 'Đã huỷ';
        }
        return true;
    });
    

    return (
        <div className="p-4 sm:p-6">
            <div className="w-full max-w-[96%] mx-auto flex space-x-2 p-6">
                <Button
                    variant={activeTab === 'pending' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('pending')}
                    className="flex items-center justify-center flex-1"
                >
                    Đơn hàng chưa giao
                </Button>
                <Button
                    variant={activeTab === 'completed' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('completed')}
                    className="flex items-center justify-center flex-1"
                >
                    Đơn hàng đã hoàn thành
                </Button>
                <Button
                    variant={activeTab === 'canceled' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('canceled')}
                    className="flex items-center justify-center flex-1"
                >
                    Đơn hàng bị huỷ
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={filteredOrders}
                renderImage={undefined}
                filterConfig={[]}
                filters={{}}
                setFilters={() => { }}
                onEdit={() => { }}
                onDelete={() => { }}
                showOptions={false}
                showMoreOption={false}
                showHeader
            />

            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <PaginationComponent page={page} setPage={setPage} totalPages={totalPages} />
                </div>
            )}

            <VerifyOrderModal
                open={verifyModalOpen}
                onClose={() => setVerifyModalOpen(false)}
                onSubmit={handleVerifySubmit}
                orderData={selectedOrder}
            />
        </div>
    );
}
