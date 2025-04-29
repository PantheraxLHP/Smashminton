import PaymentInfo from '../(payment-components)/PaymentInfo';
import { SelectedCourts } from '../page';

interface BookingStepThreeProps {
    selectedCourts: SelectedCourts[];
    totalPrice: number;
}

export default function BookingStepThree({ selectedCourts, totalPrice }: BookingStepThreeProps) {
    return (
        <PaymentInfo
            paymentData={{
                selectedMethod: null,
                finalTotal: totalPrice,
                items: selectedCourts.map((court) => ({
                    icon: court.courtimgurl || "",
                    description: court.courtname ?? "Tên sân không xác định",
                    quantity: "1",
                    duration: `${court.filters.duration ?? 1} giờ`,
                    time: court.filters.startTime ?? '',
                    unitPrice: parseInt(court.price.replace(/\D/g, '')),
                    total: parseInt(court.price.replace(/\D/g, '')),
                })),
                discount: 0.1,
                invoiceCode: "None",
                employeeCode: "None",
                createdAt: new Date().toLocaleDateString(),
                //Cần lấy thêm thông tin khách hàng nếu đã đăng nhập nhóe
                customerInfo: {
                    fullName: "Nguyễn Văn A",
                    phone: "0123456789",
                    email: "a@gmail.com",
                },
            }}
        />
    );
}