'use client'; // Đảm bảo chạy trên client

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { SelectedCourt, SelectedProducts, ZonePrices } from './types'; // Import từ file payment/types.ts
import PaymentInfo from './PaymentInfo';

interface PaymentPageProps {
    selectedCourts: SelectedCourt[];
    selectedProducts: SelectedProducts[];
    totalPrice: number;
}

export default function PaymentPage({ selectedCourts, selectedProducts, totalPrice }: PaymentPageProps) {
    const [loading, setLoading] = useState(false);
    const [zonePrices, setZonePrices] = useState<ZonePrices[]>([]);

    // Mock data cho zonePrices
    useEffect(() => {
        const fetchZonePrices = () => {
            const mockZonePrices: ZonePrices[] = [
                { zonepriceid: 1, price: 100000, zoneid: 1 },
                { zonepriceid: 2, price: 120000, zoneid: 2 },
                { zonepriceid: 3, price: 150000, zoneid: 3 },
            ];
            setZonePrices(mockZonePrices);
        };

        fetchZonePrices();
    }, []);

    // Mock data cho selectedCourts và selectedProducts
    const mockSelectedCourts: SelectedCourt[] = [
        {
            courtid: 1,
            courtname: 'Sân 1',
            courtprice: '120.000',
            filters: {
                zone: 'Zone A',
                date: '2025-04-01',
                duration: 2,
                startTime: '10:00',
                fixedCourt: true,
            },
        },
        {
            courtid: 2,
            courtname: 'Sân 2',
            courtprice: '130.000',
            filters: {
                zone: 'Zone B',
                date: '2025-04-01',
                duration: 1,
                startTime: '12:00',
                fixedCourt: false,
            },
        },
    ];

    const mockSelectedProducts: SelectedProducts[] = [
        { productid: 1, productname: 'Vợt cầu lông', sellingprice: 300000, quantity: 1 },
        { productid: 2, productname: 'Giày cầu lông', sellingprice: 500000, quantity: 2 },
        { productid: 3, productname: 'Áo cầu lông', sellingprice: undefined, quantity: 3 }, // Một sản phẩm không có giá
    ];

    // Tính tổng giá tiền từ mock data
    const calculateTotalPrice = () => {
        let calculatedPrice = 0;

        // Tính tổng giá cho các sân đã chọn (từ mock data)
        mockSelectedCourts.forEach((court) => {
            const courtPrice = parseInt(court.courtprice.replace(/\D/g, '')); // Chuyển đổi giá sân từ chuỗi có dấu phân cách thành số
            const durationPrice = court.filters.duration ?? 1; // Nếu không có thời gian, mặc định là 1 giờ
            calculatedPrice += courtPrice * durationPrice; // Nhân giá sân với số giờ thuê sân
        });

        // Tính tổng giá cho các sản phẩm đã chọn (từ mock data)
        mockSelectedProducts.forEach((product) => {
            const productPrice = product.sellingprice ?? 0; // Nếu sellingprice là undefined, gán giá trị mặc định là 0
            calculatedPrice += productPrice * product.quantity; // Tính giá sản phẩm (giá bán * số lượng)
        });

        return calculatedPrice;
    };

    return (
        <PaymentInfo/>
    );
}
