import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface tmpCourt {
    courtid: number;
    courtname: string,
}

const BookingDetailCourtList = () => {
    const router = useRouter();
    const [courts, setCourts] = useState<tmpCourt[]>([
        { courtid: 1, courtname: 'Sân 1' },
        { courtid: 2, courtname: 'Sân 2' },
        { courtid: 3, courtname: 'Sân 3' },
        { courtid: 4, courtname: 'Sân 4' },
        { courtid: 5, courtname: 'Sân 5' },
        { courtid: 6, courtname: 'Sân 6' },
        { courtid: 7, courtname: 'Sân 7' },
        { courtid: 8, courtname: 'Sân 8' },
        { courtid: 9, courtname: 'Sân 9' },
        { courtid: 10, courtname: 'Sân 10' },
        { courtid: 11, courtname: 'Sân 11' },
        { courtid: 12, courtname: 'Sân 12' },
        { courtid: 13, courtname: 'Sân 13' },
        { courtid: 14, courtname: 'Sân 14' },
        { courtid: 15, courtname: 'Sân 15' },
        { courtid: 16, courtname: 'Sân 16' },
    ]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
            {courts.map((court: tmpCourt) => (
                <div
                    key={court.courtid}
                    className="group p-4 rounded-lg border shadow transition-shadow duration-200 hover:shadow-xl hover:bg-primary-50 flex flex-col items-center gap-2 cursor-pointer h-fit w-full"
                    onClick={() => {
                        router.push(`/bookingdetail/events?courtid=${court.courtid}&date=${new Date().toISOString()}`);
                    }}
                >
                    <Icon
                        icon="game-icons:tennis-court"
                        className="size-25 sm:size-30 md:size-35 lg:size-40 xl:size-45 2xl:size-50 group-hover:text-primary group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-200"
                    />
                    <span
                        className="flex items-center gap-5 text-xl group-hover:text-primary group-hover:underline-offset-2 group-hover:underline"
                    >
                        {court.courtid} - {court.courtname}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default BookingDetailCourtList;