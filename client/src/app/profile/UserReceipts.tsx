import { formatDate, formatPrice } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface Product {
    productid: number;
    productname: string;
    quantity: number;
}

interface Rental {
    productid: number;
    productname: string;
    quantity: number;
    rentaldate: string;
}

interface Court {
    starttime: string;
    endtime: string;
    duration: string;
    date: string;
    zone: string;
    guestphone: string;
    totalamount: string;
    products: Product[];
    rentals: Rental[];
}

interface Receipt {
    receiptid: number;
    paymentmethod: string;
    totalamount: string;
    courts: Court[];
}

interface UserReceiptsProps {
    receipts: Receipt[];
}

const UserReceipts: React.FC<UserReceiptsProps> = ({ receipts }) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const getBookingStatus = (starttime: string, endtime: string): 'upcoming' | 'ongoing' | 'completed' => {
        const now = new Date();
        const start = new Date(starttime);
        const end = new Date(endtime);

        if (now < start) return 'upcoming';
        if (now >= start && now <= end) return 'ongoing';
        return 'completed';
    };

    const getStatusColor = (status: 'upcoming' | 'ongoing' | 'completed') => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-500';
            case 'ongoing':
                return 'bg-green-500';
            case 'completed':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = (status: 'upcoming' | 'ongoing' | 'completed') => {
        switch (status) {
            case 'upcoming':
                return 'Sắp diễn ra';
            case 'ongoing':
                return 'Đang diễn ra';
            case 'completed':
                return 'Đã hoàn thành';
            default:
                return '';
        }
    };

    const getPaymentMethodText = (method: string) => {
        switch (method.toLowerCase()) {
            case 'momo':
                return 'MoMo';
            case 'cash':
                return 'Tiền mặt';
            case 'banking':
                return 'Chuyển khoản';
            default:
                return method;
        }
    };

    const renderCourt = (court: Court, receiptId: number, courtIndex: number) => {
        const status = getBookingStatus(court.starttime, court.endtime);

        // Safe array access
        const products = Array.isArray(court.products) ? court.products : [];
        const rentals = Array.isArray(court.rentals) ? court.rentals : [];

        return (
            <div key={`${receiptId}-${courtIndex}`} className="flex flex-col">
                <div className={`h-3 rounded-t-lg ${getStatusColor(status)} flex items-center justify-center`}>
                    <span className="text-xs font-semibold text-white">{getStatusText(status)}</span>
                </div>
                <div className="flex flex-col gap-2 rounded-b-lg border-r-2 border-b-2 border-l-2 p-4 shadow-md">
                    <div className="flex items-center gap-4 text-lg">
                        {formatTime(court.starttime)} - {formatTime(court.endtime)}
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:clock-outline" className="size-6" />
                            <span className="">{court.duration}h</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon icon="material-symbols:attach-money-rounded" className="size-6" />
                            <span className="">{formatPrice(parseInt(court.totalamount || '0'))}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                        <Icon icon="mdi:calendar-outline" className="size-6" />
                        <span className="">{formatDate(new Date(court.date))}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                        <Icon icon="ph:court-basketball" className="size-6" />
                        <span className="">Sân cầu lông ({court.zone || 'N/A'})</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg">
                        <Icon icon="lucide:user-round-check" className="size-6" />
                        <span className="">{court.guestphone || 'N/A'}</span>
                    </div>
                    {(products.length > 0 || rentals.length > 0) && (
                        <Accordion type="multiple" className="w-full">
                            {products.length > 0 && (
                                <AccordionItem value={`products-${receiptId}-${courtIndex}`} className="">
                                    <AccordionTrigger className="cursor-pointer !py-1 text-lg">
                                        <div className="flex items-center gap-2">
                                            <Icon icon="mdi:package-variant-closed-check" className="size-6" />
                                            <span>{products.length} Sản phẩm </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-base">
                                        <div className="flex flex-col gap-1">
                                            {products.map((product, index) => (
                                                <span key={index}>
                                                    {product.quantity} {product.productname}
                                                </span>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                            {rentals.length > 0 && (
                                <AccordionItem value={`rentals-${receiptId}-${courtIndex}`} className="">
                                    <AccordionTrigger className="cursor-pointer !py-1 text-lg">
                                        <div className="flex items-center gap-2">
                                            <Icon icon="mdi:package-variant" className="size-6" />
                                            <span>{rentals.length} Dịch vụ </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-base">
                                        <div className="flex flex-col gap-1">
                                            {rentals.map((rental, index) => (
                                                <span key={index}>
                                                    {rental.quantity} {rental.productname}
                                                </span>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                        </Accordion>
                    )}
                </div>
            </div>
        );
    };

    const renderReceipt = (receipt: Receipt) => {
        const courts = Array.isArray(receipt.courts) ? receipt.courts : [];

        return (
            <div key={receipt.receiptid} className="mb-6">
                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Icon icon="mdi:receipt-text" className="size-5" />
                                <span className="font-medium">Hóa đơn #{receipt.receiptid}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon icon="mdi:credit-card" className="size-5" />
                                <span className="text-sm text-gray-600">
                                    {getPaymentMethodText(receipt.paymentmethod || 'N/A')}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600">Tổng cộng</div>
                            <div className="text-lg font-bold">{formatPrice(parseInt(receipt.totalamount || '0'))}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {courts.map((court, index) => renderCourt(court, receipt.receiptid, index))}
                </div>
            </div>
        );
    };

    // Ensure receipts is an array and handle edge cases
    const validReceipts = Array.isArray(receipts) ? receipts : [];

    // Group receipts by status
    const upcomingReceipts = validReceipts.filter(
        (receipt) =>
            receipt.courts &&
            Array.isArray(receipt.courts) &&
            receipt.courts.some((court) => getBookingStatus(court.starttime, court.endtime) === 'upcoming'),
    );

    const ongoingReceipts = validReceipts.filter(
        (receipt) =>
            receipt.courts &&
            Array.isArray(receipt.courts) &&
            receipt.courts.some((court) => getBookingStatus(court.starttime, court.endtime) === 'ongoing'),
    );

    const completedReceipts = validReceipts.filter(
        (receipt) =>
            receipt.courts &&
            Array.isArray(receipt.courts) &&
            receipt.courts.every((court) => getBookingStatus(court.starttime, court.endtime) === 'completed'),
    );

    if (validReceipts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Icon icon="mdi:calendar-blank-outline" className="mb-4 size-16" />
                <span className="text-lg">Chưa có lịch đặt sân nào</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Ongoing Bookings */}
            {ongoingReceipts.length > 0 && (
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Đang diễn ra</h3>
                    {ongoingReceipts.map(renderReceipt)}
                </div>
            )}

            {/* Upcoming Bookings */}
            {upcomingReceipts.length > 0 && (
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Sắp diễn ra</h3>
                    {upcomingReceipts.map(renderReceipt)}
                </div>
            )}

            {/* Completed Bookings */}
            {completedReceipts.length > 0 && (
                <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Đã hoàn thành</h3>
                    {completedReceipts.map(renderReceipt)}
                </div>
            )}
        </div>
    );
};

export default UserReceipts;
