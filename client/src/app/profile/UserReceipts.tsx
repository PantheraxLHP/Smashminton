import { formatDate, formatPrice } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useState, useMemo } from 'react';

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
    createdat: string;
}

interface UserReceiptsProps {
    receipts: Receipt[];
}

const UserReceipts: React.FC<UserReceiptsProps> = ({ receipts }) => {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'completed'>('all');

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'N/A';
            }
            return date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        } catch {
            return 'N/A';
        }
    };

    const getBookingStatus = (starttime: string, endtime: string): 'upcoming' | 'ongoing' | 'completed' => {
        try {
            const now = new Date();
            const start = new Date(starttime);
            const end = new Date(endtime);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return 'completed';
            }

            if (now < start) return 'upcoming';
            if (now >= start && now <= end) return 'ongoing';
            return 'completed';
        } catch {
            return 'completed';
        }
    };

    const getStatusColor = (status: 'upcoming' | 'ongoing' | 'completed') => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-500';
            case 'ongoing':
                return 'bg-primary-500';
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
        switch (method?.toLowerCase()) {
            case 'momo':
                return 'MoMo';
            case 'cash':
                return 'Tiền mặt';
            case 'banking':
                return 'Chuyển khoản';
            default:
                return method || 'Không xác định';
        }
    };

    // Memoized calculations for better performance
    const { categorizedReceipts, allReceipts } = useMemo(() => {
        const validReceipts = Array.isArray(receipts) ? receipts : [];

        // Helper function to get earliest date for sorting
        const getEarliestDate = (receipt: Receipt) => {
            if (!receipt.courts || !Array.isArray(receipt.courts) || receipt.courts.length === 0) {
                return new Date(0);
            }
            const dates = receipt.courts
                .map((court) => new Date(court.starttime))
                .filter((date) => !isNaN(date.getTime()));

            return dates.length > 0 ? new Date(Math.min(...dates.map((d) => d.getTime()))) : new Date(0);
        };

        // Sort function
        const sortReceiptsByDate = (receipts: Receipt[]) => {
            return [...receipts].sort((a, b) => b.receiptid - a.receiptid);
        };

        // Categorize receipts with unique assignment (each receipt appears in only one category)
        const ongoing: Receipt[] = [];
        const upcoming: Receipt[] = [];
        const completed: Receipt[] = [];

        validReceipts.forEach((receipt) => {
            if (!receipt.courts || !Array.isArray(receipt.courts) || receipt.courts.length === 0) {
                completed.push(receipt);
                return;
            }

            const statuses = receipt.courts.map((court) => getBookingStatus(court.starttime, court.endtime));

            // Priority: ongoing > upcoming > completed
            if (statuses.includes('ongoing')) {
                ongoing.push(receipt);
            }
            if (statuses.includes('upcoming')) {
                upcoming.push(receipt);
            }
            if (statuses.includes('completed')) {
                completed.push(receipt);
            }
        });

        return {
            categorizedReceipts: {
                ongoing: sortReceiptsByDate(ongoing),
                upcoming: sortReceiptsByDate(upcoming),
                completed: sortReceiptsByDate(completed),
            },
            allReceipts: sortReceiptsByDate(validReceipts),
        };
    }, [receipts]);

    const renderCourt = (court: Court, receiptId: number, courtIndex: number) => {
        const status = getBookingStatus(court.starttime, court.endtime);
        const products = Array.isArray(court.products) ? court.products : [];
        const rentals = Array.isArray(court.rentals) ? court.rentals : [];

        return (
            <div key={`${receiptId}-${courtIndex}-${court.starttime}`} className="flex flex-col">
                <div className={`h-6 rounded-t-lg ${getStatusColor(status)} flex items-center justify-center`}>
                    <span className="text-xs font-semibold text-white">{getStatusText(status)}</span>
                </div>
                <div className="flex flex-col gap-3 rounded-b-lg border-r-2 border-b-2 border-l-2 bg-white p-4 shadow-md">
                    <div className="flex flex-wrap items-center gap-4 text-base">
                        <div className="flex items-center gap-1 font-medium">
                            {formatTime(court.starttime)} - {formatTime(court.endtime)}
                        </div>
                        <div className="flex items-center gap-1">
                            <Icon icon="mdi:clock-outline" className="size-5" />
                            <span>{court.duration}h</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Icon icon="material-symbols:attach-money-rounded" className="size-5" />
                            <span className="font-medium">{formatPrice(parseInt(court.totalamount || '0'))}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-base">
                        <Icon icon="mdi:calendar-outline" className="size-5" />
                        <span>{formatDate(new Date(court.starttime))}</span>
                    </div>

                    <div className="flex items-center gap-2 text-base">
                        <Icon icon="ph:court-basketball" className="size-5" />
                        <span>Sân cầu lông ({court.zone || 'N/A'})</span>
                    </div>

                    {court.guestphone && (
                        <div className="flex items-center gap-2 text-base">
                            <Icon icon="lucide:phone-call" className="size-5" />
                            <span>{court.guestphone}</span>
                        </div>
                    )}

                    {(products.length > 0 || rentals.length > 0) && (
                        <Accordion type="multiple" className="mt-2 w-full">
                            {products.length > 0 && (
                                <AccordionItem value={`products-${receiptId}-${courtIndex}`}>
                                    <AccordionTrigger className="cursor-pointer py-2 text-base hover:no-underline">
                                        <div className="flex items-center gap-2">
                                            <Icon icon="mdi:package-variant-closed-check" className="size-5" />
                                            <span>{products.length} Sản phẩm</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm">
                                        <div className="flex flex-col gap-1 pl-2">
                                            {products.map((product, index) => (
                                                <div
                                                    key={`${product.productid}-${index}`}
                                                    className="flex justify-between"
                                                >
                                                    <span>{product.productname}</span>
                                                    <span className="font-medium">x{product.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                            {rentals.length > 0 && (
                                <AccordionItem value={`rentals-${receiptId}-${courtIndex}`}>
                                    <AccordionTrigger className="cursor-pointer py-2 text-base hover:no-underline">
                                        <div className="flex items-center gap-2">
                                            <Icon icon="mdi:package-variant" className="size-5" />
                                            <span>{rentals.length} Dịch vụ</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm">
                                        <div className="flex flex-col gap-1 pl-2">
                                            {rentals.map((rental, index) => (
                                                <div
                                                    key={`${rental.productid}-${index}`}
                                                    className="flex justify-between"
                                                >
                                                    <span>{rental.productname}</span>
                                                    <span className="font-medium">x{rental.quantity}</span>
                                                </div>
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

    const renderReceipt = (receipt: Receipt, currentFilter: 'all' | 'ongoing' | 'upcoming' | 'completed') => {
        const courts = Array.isArray(receipt.courts) ? receipt.courts : [];

        // Filter courts based on current filter when not 'all'
        const filteredCourts =
            currentFilter === 'all'
                ? courts
                : courts.filter((court) => getBookingStatus(court.starttime, court.endtime) === currentFilter);

        // Don't render if no courts match the filter
        if (filteredCourts.length === 0) return null;

        return (
            <div key={`${receipt.receiptid}-${currentFilter}`} className="mb-6">
                <Accordion type="multiple" className="w-full">
                    <AccordionItem value={`receipt-${receipt.receiptid}`} className="rounded-lg border shadow-sm">
                        <AccordionTrigger className="rounded-t-lg bg-gray-50 px-4 py-3 hover:no-underline">
                            <div className="flex w-full items-center justify-between">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:receipt-text" className="size-5" />
                                        <span className="font-medium">Hóa đơn #{receipt.receiptid}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Icon icon="ph:calendar-blank" className="size-4" />
                                        <span className="text-sm text-gray-600">Ngày tạo: {formatDate(new Date(receipt.createdat))}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:credit-card" className="size-4" />
                                        <span className="text-sm text-gray-600">
                                            {getPaymentMethodText(receipt.paymentmethod)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Icon icon="ph:court-basketball" className="size-4" />
                                        <span className="text-sm text-gray-600">
                                            {filteredCourts.length}
                                            {filteredCourts.length !== courts.length && ` / ${courts.length}`} sân
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">Tổng cộng</div>
                                    <div className="text-primary-600 text-lg font-bold">
                                        {formatPrice(parseInt(receipt.totalamount || '0'))}
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-gray-25 px-4 pb-4">
                            <div className="mt-2 flex flex-col gap-4">
                                {filteredCourts.map((court, index) => renderCourt(court, receipt.receiptid, index))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    };

    if (!receipts || receipts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <Icon icon="mdi:calendar-blank-outline" className="mb-4 size-20" />
                <span className="text-xl font-medium">Chưa có lịch đặt sân nào</span>
                <span className="mt-2 text-sm">Lịch đặt sân của bạn sẽ hiển thị tại đây</span>
            </div>
        );
    }

    const filterButtons = [
        { key: 'all', label: 'Tất cả', icon: 'mdi:calendar-multiple', count: allReceipts.length },
        { key: 'ongoing', label: 'Đang diễn ra', icon: 'mdi:clock-outline', count: categorizedReceipts.ongoing.length },
        {
            key: 'upcoming',
            label: 'Sắp diễn ra',
            icon: 'mdi:calendar-clock',
            count: categorizedReceipts.upcoming.length,
        },
        {
            key: 'completed',
            label: 'Đã hoàn thành',
            icon: 'mdi:calendar-check',
            count: categorizedReceipts.completed.length,
        },
    ] as const;

    const renderFilteredContent = () => {
        const currentReceipts = selectedFilter === 'all' ? allReceipts : categorizedReceipts[selectedFilter];

        if (currentReceipts.length === 0) {
            const emptyStateConfig = {
                ongoing: { icon: 'mdi:clock-outline', text: 'Không có booking đang diễn ra' },
                upcoming: { icon: 'mdi:calendar-clock', text: 'Không có booking sắp diễn ra' },
                completed: { icon: 'mdi:calendar-check', text: 'Không có booking đã hoàn thành' },
                all: { icon: 'mdi:calendar-blank-outline', text: 'Không có booking nào' },
            };

            const config = emptyStateConfig[selectedFilter];

            return (
                <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                    <Icon icon={config.icon} className="mb-4 size-16" />
                    <span className="text-lg">{config.text}</span>
                </div>
            );
        }

        return (
            <div className="space-y-2">{currentReceipts.map((receipt) => renderReceipt(receipt, selectedFilter))}</div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Filter Buttons */}
            <div className="sticky top-0 z-10 border-b bg-white pb-4 backdrop-blur-sm">
                <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
                    {filterButtons.map((button) => (
                        <button
                            key={button.key}
                            onClick={() => setSelectedFilter(button.key)}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                                selectedFilter === button.key
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                            }`}
                        >
                            <Icon icon={button.icon} className="size-4" />
                            <span>{button.label}</span>
                            {button.count > 0 && (
                                <span
                                    className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                                        selectedFilter === button.key
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-300 text-gray-700'
                                    }`}
                                >
                                    {button.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filtered Content */}
            {renderFilteredContent()}
        </div>
    );
};

export default UserReceipts;
