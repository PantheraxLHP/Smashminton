import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { SelectedCourts, SelectedProducts } from '../../app/booking/courts/page';
import { formatTime } from '@/lib/utils';

export interface BookingBottomSheetProps {
    onConfirm?: () => void;
    selectedCourts: SelectedCourts[];
    selectedProducts: SelectedProducts[];
    TTL: number;
}

const BookingBottomSheet: React.FC<BookingBottomSheetProps> = ({
    onConfirm,
    selectedCourts,
    selectedProducts,
    TTL,
}) => {
    const { removeCourtByIndex, totalCourtPrice, totalProductPrice, clearRentalOrder } = useBooking();

    const [timeLeft, setTimeLeft] = useState(TTL);
    const router = useRouter();
    const prevCourtsLengthRef = useRef<number>(0);

    useEffect(() => {
        if (selectedCourts && selectedCourts.length > 0 && !prevCourtsLengthRef.current) {
            setTimeLeft(TTL);
        }
        prevCourtsLengthRef.current = selectedCourts ? selectedCourts.length : 0;
    }, [TTL, selectedCourts]);

    // Timer countdown logic
    useEffect(() => {
        if (timeLeft <= 0 || !selectedCourts || selectedCourts.length === 0) {
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerId);
                    toast.warning('Thời gian đặt sân đã hết. Vui lòng chọn lại sân.');
                    clearRentalOrder();
                    window.location.reload();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [TTL, selectedCourts, timeLeft, clearRentalOrder]);

    // onConfirm function use for booking page, if not set, it will redirect to payment page
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            router.push('/payment');
        }
    };

    const TotalPrice = totalCourtPrice + totalProductPrice;

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-black py-2 text-white shadow-lg sm:p-4">
            <div className="flex flex-col items-center gap-2 sm:max-h-20 sm:flex-row sm:gap-2">
                {/* Scrollable Content */}
                <div className="max-h-[calc(100vh-120px)] flex-1 overflow-y-auto px-3 sm:max-h-20 sm:px-5">
                    <div className="flex flex-col gap-1 sm:gap-1">
                        {/* Danh sách sân */}
                        {selectedCourts?.map((scCourt: SelectedCourts, index: number) => (
                            <div
                                key={`${scCourt.courtid}-${scCourt.zoneid}-${scCourt.date}-${scCourt.starttime}-${scCourt.duration}`}
                                className="flex items-center justify-between rounded-md bg-gray-800 p-2 sm:flex-row sm:bg-transparent sm:p-0"
                            >
                                {/* Compact court info */}
                                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold sm:text-base">
                                            {'Zone ' + String.fromCharCode(64 + (scCourt.zoneid || 1))}
                                        </span>
                                        <Icon icon="mdi:badminton" className="h-3 w-3 sm:h-5 sm:w-5" />
                                        <span className="text-xs font-bold sm:text-base">{scCourt.courtname}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs sm:gap-2 sm:text-base">
                                        <Icon icon="mdi:calendar" className="h-3 w-3 sm:h-5 sm:w-5" />
                                        <span>{scCourt.date || ''}</span>
                                        <Icon icon="mdi:clock-outline" className="h-3 w-3 sm:h-5 sm:w-5" />
                                        <span>{scCourt.starttime || ''}</span>
                                        <Icon icon="mdi:timer" className="h-3 w-3 sm:h-5 sm:w-5" />
                                        <span>{scCourt.duration || ''}h</span>
                                    </div>
                                </div>

                                {/* Price and close button */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:cash-multiple" className="h-3 w-3 sm:h-5 sm:w-5" />
                                        <span className="text-xs font-medium sm:text-base">
                                            {scCourt.price.toLocaleString()} VND
                                        </span>
                                    </div>
                                    <Icon
                                        onClick={() => removeCourtByIndex(index)}
                                        icon="mdi:close-circle"
                                        className="text-primary-400 h-5 w-5 cursor-pointer sm:h-5 sm:w-5"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Danh sách sản phẩm */}
                        {selectedProducts && selectedProducts.length > 0 && (
                            <div className="flex items-center justify-between rounded-md bg-gray-800 p-2 sm:bg-transparent sm:p-0">
                                <div className="flex items-center gap-1">
                                    <Icon icon="mdi:package-variant-closed" className="h-4 w-4 sm:size-6" />
                                    <span className="text-xs font-medium sm:text-base">
                                        <b>
                                            {selectedProducts.reduce((sum, product) => sum + product.quantity, 0)} sản
                                            phẩm
                                        </b>
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Icon icon="mdi:cash-multiple" className="h-3 w-3 sm:h-5 sm:w-5" />
                                    <span className="text-xs font-medium sm:text-base">
                                        {totalProductPrice.toLocaleString('vi-VN')} VNĐ
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex w-full flex-col items-center gap-2 px-3 sm:h-20 sm:max-w-180 sm:flex-row sm:justify-end sm:gap-5 sm:px-0">
                    <div className="hidden h-full w-1 bg-white sm:block"></div>

                    {/* Compact Timer and Payment Section */}
                    <div className="flex w-full items-center justify-between gap-2 sm:flex-col sm:items-center">
                        {/* Countdown Timer */}
                        {selectedCourts && selectedCourts.length > 0 && timeLeft > 0 && (
                            <div className="text-primary border-primary flex flex-col items-center rounded-lg border-2 border-solid bg-white p-2">
                                <span className="text-xs font-medium">Thời gian giữ sân:</span>
                                <span className="text-lg font-bold sm:text-3xl">{formatTime(timeLeft)}</span>
                            </div>
                        )}

                        {/* Tổng tiền & Đặt sân */}
                        <div className="flex flex-col items-center">
                            <div className="mb-1 flex items-center gap-1">
                                <span className="text-xs text-white sm:text-base">Tạm tính:</span>
                                <span className="text-sm font-bold sm:text-lg">
                                    {TotalPrice.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                            <Button
                                className="bg-primary h-10 px-6 text-sm font-semibold sm:h-auto sm:text-sm"
                                onClick={handleConfirm}
                            >
                                THANH TOÁN
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingBottomSheet;
