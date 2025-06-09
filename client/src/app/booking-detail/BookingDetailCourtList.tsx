import { Icon } from '@iconify/react';
import { useState, Fragment, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import BookingEvents from './BookingEvents';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { addHours } from "date-fns";
import { formatTimeFullText } from '@/lib/utils';

interface tmpCourt {
    courtid: number;
    courtname: string,
    bookingCount: number,
    totalRevenue: number,
    events?: any[];
}

const BookingDetailCourtList = () => {
    const [courtTTL, setCourtTTL] = useState<number[]>([]);
    const [courts, setCourts] = useState<tmpCourt[]>([
        {
            courtid: 1, courtname: 'Sân 1', bookingCount: 4, totalRevenue: 1000000, events: [
                { endTime: addHours(new Date(), 2), },
                { endTime: addHours(new Date(), 3), },
                { endTime: addHours(new Date(), 4), },
                { endTime: addHours(new Date(), 5), },
            ]
        },
        {
            courtid: 2, courtname: 'Sân 2', bookingCount: 2, totalRevenue: 500000, events: [
                { endTime: addHours(new Date(), 1), },
                { endTime: addHours(new Date(), 3), },
            ]
        },
        {
            courtid: 3, courtname: 'Sân 3', bookingCount: 0, totalRevenue: 0, events: []
        },
        {
            courtid: 4, courtname: 'Sân 4', bookingCount: 5, totalRevenue: 1500000, events: [
                { endTime: addHours(new Date(), 1), },
                { endTime: addHours(new Date(), 2), },
                { endTime: addHours(new Date(), 3), },
                { endTime: addHours(new Date(), 4), },
                { endTime: addHours(new Date(), 5), },
            ]
        },
        {
            courtid: 5, courtname: 'Sân 5', bookingCount: 3, totalRevenue: 800000, events: [
                { endTime: addHours(new Date(), 2), },
                { endTime: addHours(new Date(), 3), },
                { endTime: addHours(new Date(), 4), },
            ]
        },
    ]);

    useEffect(() => {
        const calculateCourtTTL = () => {
            for (const court of courts) {
                if (!court.events || court.events.length === 0) {
                    courtTTL.push(-1);
                }
                else {
                    let minTTL = Infinity;
                    const currentTime = new Date();
                    for (const event of court.events) {
                        const endTime = new Date(event.endTime);
                        const timeLeft = endTime.getTime() - currentTime.getTime();
                        if (endTime > currentTime && timeLeft < minTTL && timeLeft > 0) {
                            minTTL = timeLeft;
                        }
                    }
                    courtTTL.push(minTTL === Infinity ? -1 : minTTL);
                }
            }
        }

        calculateCourtTTL();
    }, []);

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

    return (
        <div className="flex flex-col w-full h-full">
            <div className="grid w-full grid-cols-6 items-center border-b-2 border-gray-400 pb-2">
                <div className="text-sm font-semibold">
                    Mã sân
                </div>
                <div className="text-sm font-semibold">
                    Tên sân
                </div>
                <div className="text-sm font-semibold">
                    Tổng lượt đặt sân
                </div>
                <div className="text-sm font-semibold">
                    Tổng doanh thu
                </div>
                <div className="text-sm font-semibold">
                    Thời gian còn lại của sự kiện hiện tại
                </div>
                <div className="text-sm font-semibold flex justify-center">
                    Xem chi tiết sự kiện
                </div>
            </div>
            <div className="grid w-full grid-cols-6 items-center">
                {courts.map((court: tmpCourt) => (
                    <Fragment
                        key={court.courtid}
                    >
                        <div className="flex h-12 items-center border-b-2 border-gray-200 py-2 text-sm">
                            {court.courtid}
                        </div>
                        <div className="flex h-12 items-center border-b-2 border-gray-200 py-2 text-sm">
                            {court.courtname}
                        </div>
                        <div className="flex h-12 items-center border-b-2 border-gray-200 py-2 text-sm">
                            {court.bookingCount}
                        </div>
                        <div className="flex h-12 items-center border-b-2 border-gray-200 py-2 text-sm">
                            {formatPrice(court.totalRevenue)}
                        </div>
                        <div className="flex h-12 items-center border-b-2 border-gray-200 py-2 text-lg">
                            {courtTTL[court.courtid - 1] > 0 ? (
                                <span className={`${courtTTL[court.courtid - 1] / 1000 < 900 ? 'text-red-500' : 'text-yellow-500'}`}>
                                    {formatTimeFullText(Math.ceil(courtTTL[court.courtid - 1] / 1000))}
                                </span>
                            ) : (
                                <span className="text-primary-500">
                                    Hiện tại không có sự kiện
                                </span>
                            )}
                        </div>
                        <div className="flex h-12 items-center justify-center border-b-2 border-gray-200 py-2 text-sm w-full">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="">
                                        Xem chi tiết
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="!flex flex-col gap-2 max-h-[80vh] overflow-y-auto !max-w-[50vw]">
                                    <DialogHeader className="!h-fit">
                                        <DialogTitle className="!h-fit">
                                            Chi tiết sự kiện sân {court.courtname} - {"Zone A"} - Ngày {formatDate(new Date())}
                                        </DialogTitle>
                                    </DialogHeader>
                                    <BookingEvents
                                        zone={"A"}
                                        courtId={court.courtid.toString()}
                                        date={new Date()}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

export default BookingDetailCourtList;