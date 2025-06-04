'use client';

import { useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";

const BookingDetailEventsPage = () => {
    const searchParams = useSearchParams();
    const courtId = searchParams.get("courtid");
    const date = searchParams.get("date");

    return (
        <div className="flex flex-col gap-4 p-4">
            <span className="text-2xl font-bold">
                Chi tiết sự kiện sân {courtId} - Ngày {formatDate(date || "")}
            </span>
        </div>
    );
}

export default BookingDetailEventsPage;