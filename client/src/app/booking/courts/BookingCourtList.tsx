import { useDebounce } from '@/app/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { Filters, SelectedCourts } from './page';

interface BookingCourtListProps {
    courts: SelectedCourts[];
    fixedCourt: boolean;
}

const BookingCourtList: React.FC<BookingCourtListProps> = ({ courts = [], fixedCourt }) => {
    const { selectedCourts, addCourt, removeCourtByIndex } = useBooking();
    const [pendingCourt, setPendingCourt] = useState<SelectedCourts | null>(null);
    const [pendingIsSelected, setPendingIsSelected] = useState(false);
    const [pendingScCourtIndex, setPendingScCourtIndex] = useState(-1);

    // Check if dialog has been shown in this session
    const hasShownDialog = typeof window !== 'undefined' && sessionStorage.getItem('fixedCourtDialogShown') === 'true';

    const handleAddCourt = (scCourt: SelectedCourts) => {
        addCourt(scCourt, fixedCourt);
    };

    const handleRemoveCourtByIndex = (index: number) => {
        removeCourtByIndex(index);
    };

    // Debounced click handler
    const debouncedHandleClick = useDebounce((court: SelectedCourts, isSelected: boolean, scCourtIndex: number) => {
        if (isSelected) {
            handleRemoveCourtByIndex(scCourtIndex);
        } else {
            handleAddCourt(court);
        }
    }, 300); // 300ms delay

    return (
        <div className="px-4">
            {/* Tiêu đề */}
            <h2 className="text-center text-lg font-semibold">
                Tổng cộng có <span className="text-primary-600 font-bold">{courts?.length || 0} sân</span> có sẵn tại
                khung giờ này. Đặt bất kỳ sân nào bạn thích nhất.
            </h2>

            {/* Danh sách sân */}
            <div className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courts?.map((court) => {
                    const scCourtIndex =
                        selectedCourts?.findIndex(
                            (selected) =>
                                selected.courtid === court.courtid &&
                                selected.date === court.date &&
                                selected.starttime === court.starttime,
                        ) ?? -1;
                    const isSelected = scCourtIndex !== -1;

                    return (
                        <div key={court.courtid} className="flex h-full w-full flex-col rounded-lg border shadow-lg">
                            <Image
                                src={court.courtimgurl || 'default-court.png'}
                                alt={court.courtname || 'Hình ảnh sân'}
                                width={200}
                                height={400}
                                className="!h-[350px] w-full rounded-t-lg object-cover"
                            />
                            <div className="p-4 text-left">
                                <h3 className="text-lg font-semibold">{court.courtname}</h3>
                                <p className="text-primary-500 py-1 text-lg font-semibold">
                                    {formatPrice(court.price)}
                                </p>
                                <Button
                                    className="w-full"
                                    variant={isSelected ? 'destructive' : 'default'}
                                    onClick={() => debouncedHandleClick(court, isSelected, scCourtIndex)}
                                >
                                    {isSelected ? 'HỦY ĐẶT SÂN' : 'ĐẶT SÂN'}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BookingCourtList;
