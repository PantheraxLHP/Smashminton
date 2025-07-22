'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import VerifyOrderModal from './VerifyOrder';
import { useAuth } from '@/context/AuthContext';
import { getAllPurchaseOrder } from '@/services/purchaseorder.service';
import PaginationComponent from '@/components/atomic/PaginationComponent';
import { cancelPurchaseOrder } from '@/services/purchaseorder.service';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/warehouse/ConfirmDialog';

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
    productfilterid: number;
}

export default function PurchaseOrderPage() {
    const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'canceled'>('pending');
    const [ordersState, setOrdersState] = useState<PurchaseOrder[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useAuth();

    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

    const fetchOrders = async () => {
        const statusOrderMap = {
            pending: 'pending',
            completed: 'delivered',
            canceled: 'canceled',
        };

        const res = await getAllPurchaseOrder(page, pageSize, statusOrderMap[activeTab]);
        if (res.ok) {
            const { data, pagination } = res.data;
            const mapped: PurchaseOrder[] = data.map((po: any) => ({
                orderid: po.poid,
                productid: po.productid,
                productname: po.products?.productname || '',
                supplierid: po.suppliers?.supplierid || 0,
                employeeid: user?.accountid || '',
                suppliername: po.suppliers?.suppliername || '',
                batchid: String(po.batchid),
                price: Number(po.costprice || 0),
                quantity: po.quantity,
                deliverydate: po.deliverydate ? po.deliverydate.split('T')[0] : undefined,
                productfilterid: po.products?.product_attributes?.[0]?.product_filter_values?.productfilterid || 0,
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
    }, [page, activeTab]);

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
                        status: 'Delivered',
                        deliverydate: today,
                        quantity: data.quantity,
                    }
                    : order
            )
        );
        fetchOrders();
    };

    const handleCancelOrder = async (orderId: number) => {
        const res = await cancelPurchaseOrder(orderId);

        if (res.ok) {
            setOrdersState((prev) =>
                prev.map((order) =>
                    order.orderid === orderId
                        ? { ...order, status: 'Đã huỷ' }
                        : order
                )
            );
            toast.success('Huỷ đơn hàng thành công');
        } else {
            toast.error(`Không thể huỷ đơn hàng: ${res.message}`);
        }
        fetchOrders();
    };


    const columns: Column<PurchaseOrder>[] = [
        { header: 'Mã đơn hàng', accessor: 'orderid', align: 'center' },
        { header: 'Nhà cung cấp', accessor: 'suppliername', align: 'left' },
        { header: 'Sản phẩm', accessor: 'productname', align: 'left' },
        {
            header: 'Giá / Sản phẩm', accessor: (item) => item.price.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }), align: 'left'
        },
        { header: 'Số lượng', accessor: 'quantity', align: 'center' },
        {
            header: 'Tổng giá',
            accessor: (item) => (
                <span>
                    {(item.price * item.quantity).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </span>
            ), align: 'left'
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
                        {item.status === 'Chờ giao hàng'}
                    </span>
                );
            }, align: 'center'
        },
    ];

    if (activeTab === 'completed') {
        columns.splice(6, 0, { header: 'Ngày giao hàng', accessor: 'deliverydate', align: 'center' });
    }

    if (activeTab === 'pending') {
        columns.push({
            header: '',
            accessor: (item) => {
                if (item.status === 'Đã nhận hàng' || item.status === 'Đã huỷ') return null;

                return (
                    <div className="flex items-center justify-center gap-x-2">
                        <button
                            className="bg-primary-500 text-white px-3 py-2 rounded hover:bg-primary-600 cursor-pointer"
                            onClick={() => handleOpenVerifyModal(item)}
                        >
                            Xác nhận đơn
                        </button>

                        {item.status === 'Chờ giao hàng' && (
                            <ConfirmDialog
                                title="Huỷ đơn hàng"
                                description="Bạn có chắc muốn huỷ đơn hàng này không?"
                                onConfirm={() => handleCancelOrder(item.orderid)}
                                trigger={
                                    <button className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer">
                                        Huỷ đơn
                                    </button>
                                }
                            />
                        )}
                    </div>
                );
            },
            align: 'center',
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
        <div className="p-4 sm:p-6 min-h-[80vh]">
            <div className="w-full max-w-[96%] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 sm:p-6">
                <Button
                    variant={activeTab === 'pending' ? 'default' : 'outline'}
                    onClick={() => {
                        setActiveTab('pending');
                        setPage(1);
                    }}
                    className="flex items-center justify-center flex-1"
                >
                    Đơn hàng chưa giao
                </Button>
                <Button
                    variant={activeTab === 'completed' ? 'default' : 'outline'}
                    onClick={() => {
                        setActiveTab('completed');
                        setPage(1);
                    }}
                    className="flex items-center justify-center flex-1"
                >
                    Đơn hàng đã hoàn thành
                </Button>
                <Button
                    variant={activeTab === 'canceled' ? 'default' : 'outline'}
                    onClick={() => {
                        setActiveTab('canceled');
                        setPage(1);
                    }}
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
