'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '../../../components/warehouse/DataTable';
import VerifyOrderModal from './VerifyOrder';

export interface PurchaseOrder {
    orderid: number;
    productid: number;
    productname: string;
    suppliername: string;
    batchid: string;
    employeeid: string;
    price: number;
    quantity: number;
    deliverydate?: string;
    status?: string;
}

const rawOrderPurchase: PurchaseOrder[] = [
    {
        orderid: 1,
        productid: 1,
        productname: 'Ống cầu lông VNB',
        suppliername: 'Đại Hưng Sport',
        batchid: '1',
        employeeid: 'NV001',
        price: 220000,
        quantity: 5,
        status: 'Chờ giao hàng',
    },
    {
        orderid: 2,
        productid: 2,
        productname: 'Ống cầu lông Taro',
        suppliername: 'Tuấn Hạnh Sport',
        batchid: '2',
        employeeid: 'NV001',
        price: 240000,
        quantity: 5,
        status: 'Chờ giao hàng',
    },
    {
        orderid: 3,
        productid: 3,
        productname: 'Revive',
        suppliername: 'Pepsico',
        batchid: '1',
        employeeid: 'NV001',
        price: 15000,
        quantity: 50,
        deliverydate: '2024-06-20',
        status: 'Đã giao hàng',
    },
];

export default function PurchaseOrderPage() {
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
    const [ordersState, setOrdersState] = useState<PurchaseOrder[]>(rawOrderPurchase);

    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

    const handleOpenVerifyModal = (order: PurchaseOrder) => {
        setSelectedOrder(order);
        setVerifyModalOpen(true);
    };

    let nextOrderId = Math.max(...rawOrderPurchase.map(o => o.orderid)) + 1;

    const handleVerifySubmit = (data: PurchaseOrder) => {
        const today = new Date().toISOString().split('T')[0];

        setOrdersState((prev) => {
            const orderIndex = prev.findIndex((order) => order.orderid === data.orderid);
            if (orderIndex === -1) return prev;

            const order = prev[orderIndex];

            if (data.quantity > order.quantity) {
                alert('Số lượng giao không hợp lệ!');
                return prev;
            }

            // Nếu giao đủ
            if (data.quantity === order.quantity) {
                const updatedOrder: PurchaseOrder = {
                    ...order,
                    status: 'Đã giao hàng',
                    deliverydate: today,
                };

                return [
                    ...prev.slice(0, orderIndex),
                    updatedOrder,
                    ...prev.slice(orderIndex + 1),
                ];
            }

            if (data.quantity < order.quantity) {
                const remainingQuantity = order.quantity - data.quantity;

                // Đơn hàng đã giao
                const deliveredOrder: PurchaseOrder = {
                    ...order,
                    quantity: data.quantity,
                    status: 'Đã giao hàng',
                    deliverydate: today,
                };

                // Tạo orderid mới cho đơn pendingOrder
                const pendingOrder: PurchaseOrder = {
                    ...order,
                    orderid: nextOrderId++, // tăng id mới để phân biệt
                    quantity: remainingQuantity,
                    status: 'Chờ giao hàng',
                    deliverydate: undefined,
                };

                return [
                    ...prev.slice(0, orderIndex),
                    deliveredOrder,
                    pendingOrder,
                    ...prev.slice(orderIndex + 1),
                ];
            }
            return prev;
        });
    };


    const handleCancelOrder = (orderId: number) => {
        setOrdersState((prev) =>
            prev.map((order) => {
                if (order.orderid === orderId) {
                    if (order.status === 'Chờ giao hàng') {
                        return { ...order, status: 'Đã huỷ' };
                    } else {
                        alert('Chỉ có thể hủy đơn còn thiếu.');
                        return order;
                    }
                }
                return order;
            })
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
            accessor: (item) => (
                <span>{(item.price * item.quantity).toLocaleString()} đ</span>
            ),
        },
        {
            header: 'Trạng thái',
            accessor: (item) => {
                let colorClass = 'text-green-600';
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
                item.status !== 'Đã giao hàng' && item.status !== 'Đã huỷ' ? (
                    <button
                        className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 mr-2 cursor-pointer"
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

    const filteredOrders = ordersState.filter((order) =>
        activeTab === 'pending'
            ? order.status !== 'Đã giao hàng'
            : order.status === 'Đã giao hàng'
    );

    return (
        <div className="p-4 sm:p-6">
            {/* Tabs */}
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
            </div>

            {/* DataTable */}
            <DataTable
                columns={columns}
                data={filteredOrders}
                renderImage={undefined}
                filterConfig={[]}
                filters={{}}
                setFilters={() => { }}
                onEdit={() => { }}
                onDelete={(index) => {
                    setOrdersState((prev) => prev.filter((_, i) => i !== index));
                }}
                showOptions={false}
                showMoreOption={false}
                showHeader
            />

            {/* Verify Order Modal */}
            <VerifyOrderModal
                open={verifyModalOpen}
                onClose={() => setVerifyModalOpen(false)}
                onSubmit={handleVerifySubmit}
                orderData={selectedOrder}
            />
        </div>
    );
}
