'use client'; // Đảm bảo chạy trên client

import { useState, useEffect } from 'react';
import PaymentInfo from './PaymentInfo';

// Khai báo kiểu PaymentMethod
type PaymentMethod = "momo" | "payos" | null;

// Mock data interfaces
interface SelectedCourt {
    courtid: number;
    courtname: string;
    courtprice: string;
    filters: {
        zone: string;
        date: string;
        duration: number;
        startTime: string;
        fixedCourt: boolean;
    };
}

interface SelectedProducts {
    productid: number;
    productname: string;
    sellingprice?: number;
    quantity: number;
}

interface ZonePrices {
    zonepriceid: number;
    price: number;
    zoneid: number;
}

interface PaymentPageProps {
    selectedCourts: SelectedCourt[];
    selectedProducts: SelectedProducts[];
    totalPrice: number;
}

export default function PaymentPage({ selectedCourts, selectedProducts, totalPrice }: PaymentPageProps) {
    const [loading, setLoading] = useState(false);
    const [zonePrices, setZonePrices] = useState<ZonePrices[]>([]);
    const [createdAt, setCreatedAt] = useState<string>(''); // State lưu trữ thời gian hiện tại

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

    // Chỉ cập nhật ngày giờ khi client đã render
    useEffect(() => {
        if (typeof window !== 'undefined') { // Kiểm tra chỉ trên client
            setCreatedAt(new Date().toLocaleDateString()); // Cập nhật ngày giờ
        }
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
        { productid: 1, productname: 'Vợt cầu lông', sellingprice: 50000, quantity: 1 },
        { productid: 2, productname: 'Giày NIKE', sellingprice: 50000, quantity: 2 },
        { productid: 3, productname: '7UP', sellingprice: 20000, quantity: 3 }, // Một sản phẩm không có giá
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

    // Mock data cho thông tin thanh toán
    const mockPaymentData = {
        selectedMethod: "momo" as PaymentMethod,
        finalTotal: calculateTotalPrice(),
        items: [
            // Kết hợp dữ liệu về sân
            ...mockSelectedCourts.map((court) => ({
                icon: "/icons/zone-a.svg",
                description: court.courtname,
                quantity: `${court.filters.duration}`,
                duration: `${court.filters.duration}h`,
                time: court.filters.date,
                unitPrice: parseInt(court.courtprice.replace(/\D/g, '')),
                total: parseInt(court.courtprice.replace(/\D/g, '')) * court.filters.duration,
            })),
            // Kết hợp dữ liệu về sản phẩm
            ...mockSelectedProducts.map((product) => ({
                icon: "/icons/shuttlecock.svg", // Bạn có thể thay thế bằng icon của sản phẩm tương ứng
                description: product.productname,
                quantity: `${product.quantity}`,
                duration: "", // Không có thời gian cho sản phẩm
                time: "", // Không có thời gian cho sản phẩm
                unitPrice: product.sellingprice ?? 0,
                total: (product.sellingprice ?? 0) * product.quantity,
            }))
        ],
        discount: 0.1,
        invoiceCode: "#AB2324-01",
        employeeCode: "#NV-QL-0001",
        createdAt: createdAt || "", // Nếu chưa có giá trị, trả về chuỗi rỗng
        customerInfo: {
            fullName: "Phạm Văn A",
            phone: "0908123123",
            email: "phudeptrai2103@gmail.com",
        }
    };

    return (
        <PaymentInfo paymentData={mockPaymentData} />
    );
}
