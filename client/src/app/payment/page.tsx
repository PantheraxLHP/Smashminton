'use client';

import PaymentInfo from './PaymentInfo';

// Tự định nghĩa lại type ngay tại đâys
interface Filters {
    duration?: number;
    startTime?: string;
    zone?: string;
    date?: string;
    fixedCourt?: boolean;
}

interface SelectedCourt {
    courtname: string;
    courtimgurl?: string;
    price: string;
    filters: Filters;
}

export default function Payment() {
    const selectedCourts: SelectedCourt[] = [
        {
            courtname: 'Sân A',
            courtimgurl: 'https://example.com/image.jpg',
            price: '100,000₫',
            filters: {
                duration: 2,
                startTime: '10:00',
            },
        },
    ];

    const totalPrice = 200000; // Giả sử tổng tiền

    return (
        <PaymentInfo
            paymentData={{
                selectedMethod: null,
                finalTotal: totalPrice,
                items: selectedCourts.map((court) => ({
                    icon: court.courtimgurl || '',
                    description: court.courtname ?? 'Tên sân không xác định',
                    quantity: '1',
                    duration: `${court.filters.duration ?? 1} giờ`,
                    time: court.filters.startTime ?? '',
                    unitPrice: parseInt(court.price.replace(/\D/g, '')),
                    total: parseInt(court.price.replace(/\D/g, '')),
                })),
                discount: 0.1,
                invoiceCode: 'None',
                employeeCode: 'None',
                createdAt: new Date().toLocaleDateString(),
                //Cần lấy thêm thông tin khách hàng nếu đã đăng nhập nhóe
                customerInfo: {
                    fullName: 'Nguyễn Văn A',
                    phone: '0123456789',
                    email: 'a@gmail.com',
                },
            }}
        />
    );
}
