'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '../../../components/warehouse/DataTable';

interface PurchaseOrder {
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
        status: 'Đang giao hàng',
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
        status: 'Đang giao hàng',
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

    const handleMarkAsDelivered = (orderId: number) => {
        const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
        setOrdersState((prev) =>
            prev.map((order) =>
                order.orderid === orderId
                    ? { ...order, status: 'Đã giao hàng', deliverydate: today }
                    : order
            )
        );
    };

    const handleCancelOrder = (orderId: number) => {
        setOrdersState((prev) =>
            prev.map((order) =>
                order.orderid === orderId
                    ? { ...order, status: 'Đã huỷ' }
                    : order
            )
        );
    };

    // Columns cơ bản
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
                if (item.status === 'Đang giao hàng') colorClass = 'text-yellow-500';
                if (item.status === 'Đã huỷ') colorClass = 'text-red-500';

                return (
                    <span className={`${colorClass} font-semibold`}>
                        {item.status}
                        {item.status === 'Đang giao hàng' && '...'}
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
                        className='bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 mr-2 cursor-pointer'
                        onClick={() => handleMarkAsDelivered(item.orderid)}
                    >
                        Đã nhận hàng
                    </button>
                ) : null,
        });
        columns.push({
            header: '',
            accessor: (item) =>
                item.status === 'Đang giao hàng' ? (
                    <button
                        className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer'
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
                    className='flex items-center justify-center flex-1'
                >
                    Đơn hàng chưa giao
                </Button>
                <Button
                    variant={activeTab === 'completed' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('completed')}
                    className='flex items-center justify-center flex-1'
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
        </div>
    );
}
