import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatDate, formatPrice, formatTimeFullText } from '@/lib/utils';
import { getBookingDetail } from '@/services/booking.service';
import { Fragment, useEffect, useState } from 'react';
import BookingEvents from './BookingEvents';
import { BookingDetailFilters } from './page';

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

const BookingDetailCourtList = ({ filters }: { filters: BookingDetailFilters | undefined }) => {
    const [courtTTL, setCourtTTL] = useState<number[]>([]);
    const [courts, setCourts] = useState<Court[]>();
    useEffect(() => {
        const fetchBookingDetails = async () => {
            const defaultFilters: BookingDetailFilters = {
                date: new Date().toISOString().split('T')[0],
                zoneid: 1,
            };
            const effectiveFilters = filters || defaultFilters;
            const response = await getBookingDetail(effectiveFilters);
            if (response.ok) {
                setCourts(response.data);
            }
        };
        fetchBookingDetails();
    }, [filters]);
    useEffect(() => {
        const calculateCourtTTL = () => {
            const newCourtTTL: number[] = [];
            for (const court of courts || []) {
                // Check ongoing events first (they have priority)
                if (court.ongoing && court.ongoing.length > 0) {
                    let minTTL = Infinity;
                    const currentTime = new Date();
                    for (const event of court.ongoing) {
                        const endTime = new Date(event.endtime);
                        const timeLeft = endTime.getTime() - currentTime.getTime();
                        if (timeLeft > 0 && timeLeft < minTTL) {
                            minTTL = timeLeft;
                        }
                    }
                    newCourtTTL.push(minTTL === Infinity ? -1 : minTTL);
                }
                // Then check upcoming events
                else if (court.upcoming && court.upcoming.length > 0) {
                    let minTTL = Infinity;
                    const currentTime = new Date();
                    for (const event of court.upcoming) {
                        const startTime = new Date(event.starttime);
                        const timeUntilStart = startTime.getTime() - currentTime.getTime();
                        if (timeUntilStart > 0 && timeUntilStart < minTTL) {
                            minTTL = timeUntilStart;
                        }
                    }
                    newCourtTTL.push(minTTL === Infinity ? -1 : minTTL);
                } else {
                    newCourtTTL.push(-1);
                }
            }
            setCourtTTL(newCourtTTL);
        };

        calculateCourtTTL();
    }, [courts]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCourtTTL((prevTTL) => {
                return prevTTL.map((ttl) => {
                    if (ttl > 0) {
                        return ttl - 1000;
                    }
                    return ttl;
                });
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [courtTTL]);

    const getEventStatus = (court: Court, index: number) => {
        if (court.ongoing && court.ongoing.length > 0) {
            return {
                text: `Đang diễn ra - ${formatTimeFullText(Math.ceil(courtTTL[index] / 1000))} còn lại`,
                color: 'text-green-500',
            };
        } else if (court.upcoming && court.upcoming.length > 0) {
            return {
                text: `Sắp diễn ra - ${formatTimeFullText(Math.ceil(courtTTL[index] / 1000))} nữa`,
                color: 'text-blue-500',
            };
        } else {
            return {
                text: 'Sân hiện đang trống',
                color: 'text-primary-500',
            };
        }
    };

    return (
        <div className="flex h-full w-full flex-col">
            <div className="grid w-full grid-cols-6 items-center border-b-2 border-gray-400 pb-2">
                <div className="text-sm font-semibold">Mã sân</div>
                <div className="text-sm font-semibold">Tên sân</div>
                <div className="text-sm font-semibold">Tổng lượt đặt sân</div>
                <div className="text-sm font-semibold">Tổng doanh thu</div>
                <div className="text-sm font-semibold">Thời gian còn lại</div>
                <div className="flex justify-center text-sm font-semibold">Xem chi tiết</div>
            </div>
            <div className="grid w-full grid-cols-6 items-center">
                {courts?.map((court: Court, index: number) => {
                    const eventStatus = getEventStatus(court, index);
                    return (
                        <Fragment key={court.courtid}>
                            <div className="flex h-12 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {court.courtid}
                            </div>
                            <div className="flex h-12 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {court.courtname}
                            </div>
                            <div className="flex h-12 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {court.count_booking}
                            </div>
                            <div className="flex h-12 items-center border-b-2 border-gray-200 py-2 text-sm">
                                {formatPrice(court.revenue)}
                            </div>
                            <div className="flex h-12 items-center border-b-2 border-gray-200 py-2 text-sm">
                                <span className={eventStatus.color}>{eventStatus.text}</span>
                            </div>
                            <div className="flex h-12 w-full items-center justify-center border-b-2 border-gray-200 py-2 text-sm">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="">Xem chi tiết</Button>
                                    </DialogTrigger>
                                    <DialogContent className="!flex max-h-[80vh] !max-w-[50vw] flex-col gap-2 overflow-y-auto">
                                        <DialogHeader className="!h-fit">
                                            <DialogTitle className="!h-fit">
                                                Chi tiết sự kiện sân {court.courtname} -{' '}
                                                {court.upcoming?.[0]?.zone ||
                                                    court.ongoing?.[0]?.zone ||
                                                    court.completed?.[0]?.zone ||
                                                    'Zone A'}{' '}
                                                - Ngày {formatDate(new Date(filters?.date || ''))}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <BookingEvents court={court} date={new Date()} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default BookingDetailCourtList;
