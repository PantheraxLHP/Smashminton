import { formatDate, formatPrice } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
    
interface BookingEvent {
    starttime: string;
    endtime: string;
    duration: string;
    date: string;
    zone: string;
    guestphone: string;
    totalamount: number;
    products: any[];
    rentals: any[];
}

interface Court {
    courtid: number;
    courtname: string;
    count_booking: number;
    revenue: number;
    upcoming: BookingEvent[];
    ongoing: BookingEvent[];
    completed: BookingEvent[];
}

interface BookingEventsProps {
    court: Court;
    date: Date;
}

const BookingEvents: React.FC<BookingEventsProps> = ({ court, date }) => {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
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

    const renderEvent = (event: BookingEvent, status: 'upcoming' | 'ongoing' | 'completed') => (
        <div key={`${event.starttime}-${event.endtime}`} className="flex flex-col">
            <div className={`h-3 rounded-t-lg ${getStatusColor(status)} flex items-center justify-center`}>
                <span className="text-xs font-semibold text-white">{getStatusText(status)}</span>
            </div>
            <div className="flex flex-col gap-2 rounded-b-lg border-r-2 border-b-2 border-l-2 p-4 shadow-md">
                <div className="flex items-center gap-4 text-lg">
                    {formatTime(event.starttime)} - {formatTime(event.endtime)}
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:clock-outline" className="size-6" />
                        <span className="">{event.duration}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="material-symbols:attach-money-rounded" className="size-6" />
                        <span className="">{formatPrice(event.totalamount)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-lg">
                    <Icon icon="mdi:calendar-outline" className="size-6" />
                    <span className="">{formatDate(new Date(event.date))}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                    <Icon icon="ph:court-basketball" className="size-6" />
                    <span className="">
                        {court.courtname} ({event.zone})
                    </span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                    <Icon icon="lucide:user-round-check" className="size-6" />
                    <span className="">{event.guestphone}</span>
                </div>
                {(event.products.length > 0 || event.rentals.length > 0) && (
                    <Accordion type="multiple" className="w-full">
                        {event.products.length > 0 && (
                            <AccordionItem value={`products-${event.starttime}`} className="">
                                <AccordionTrigger className="cursor-pointer !py-1 text-lg">
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:package-variant-closed-check" className="size-6" />
                                        <span>
                                            {event.products.length} Sản phẩm -{' '}
                                            {formatPrice(
                                                event.products.reduce(
                                                    (sum, product) => sum + product.price * product.quantity,
                                                    0,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-base">
                                    <div className="flex flex-col gap-1">
                                        {event.products.map((product: any, index: number) => (
                                            <span key={index}>
                                                {product.quantity} {product.name} -{' '}
                                                {formatPrice(product.price * product.quantity)}
                                            </span>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {event.rentals.length > 0 && (
                            <AccordionItem value={`rentals-${event.starttime}`} className="">
                                <AccordionTrigger className="cursor-pointer !py-1 text-lg">
                                    <div className="flex items-center gap-2">
                                        <Icon icon="mdi:package-variant" className="size-6" />
                                        <span>
                                            {event.rentals.length} Dịch vụ -{' '}
                                            {formatPrice(
                                                event.rentals.reduce(
                                                    (sum, rental) => sum + rental.price * rental.quantity,
                                                    0,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-base">
                                    <div className="flex flex-col gap-1">
                                        {event.rentals.map((rental: any, index: number) => (
                                            <span key={index}>
                                                {rental.quantity} {rental.name} -{' '}
                                                {formatPrice(rental.price * rental.quantity)}
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

    const allEvents = [
        ...court.ongoing.map((event) => ({ event, status: 'ongoing' as const })),
        ...court.upcoming.map((event) => ({ event, status: 'upcoming' as const })),
        ...court.completed.map((event) => ({ event, status: 'completed' as const })),
    ];

    if (allEvents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Icon icon="mdi:calendar-blank-outline" className="mb-4 size-16" />
                <span className="text-lg">Không có sự kiện nào trong ngày này</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">{allEvents.map(({ event, status }) => renderEvent(event, status))}</div>
    );
};

export default BookingEvents;
