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
            <div className="flex flex-col items-center gap-2 sm:max-h-20 sm:flex-row">
                {/* Scrollable Content */}
                <div className="max-h-[calc(100vh-150px)] flex-1 overflow-y-auto px-5 sm:max-h-20">
                    <div className="flex flex-col gap-1">
                        {/* Danh sách sân */}
                        {selectedCourts?.map((scCourt: SelectedCourts, index: number) => (
                            <div
                                key={`
                                    ${scCourt.courtid}-${scCourt.zoneid}-${scCourt.date}-
                                    ${scCourt.starttime}-${scCourt.duration}
                                `}
                                className="flex items-center gap-2"
                            >
                                <span className="font-bold">
                                    {'Zone ' + String.fromCharCode(64 + (scCourt.zoneid || 1))}
                                </span>

                                <Icon icon="mdi:badminton" className="h-5 w-5" />
                                <span className="font-bold">{scCourt.courtname}</span>
                                <Icon icon="mdi:calendar" className="h-5 w-5" />
                                <span>{scCourt.date || ''}</span>
                                <Icon icon="mdi:clock-outline" className="h-5 w-5" />
                                <span>{scCourt.starttime || ''}</span>
                                <Icon icon="mdi:timer" className="h-5 w-5" />
                                <span>{scCourt.duration || ''}h</span>
                                <Icon icon="mdi:cash-multiple" className="h-5 w-5" />
                                <span>{scCourt.price.toLocaleString()} VND</span>
                                <Icon
                                    onClick={() => removeCourtByIndex(index)}
                                    icon="mdi:close-circle"
                                    className="text-primary-400 h-5 w-5 cursor-pointer"
                                />
                            </div>
                        ))}

                        {/* Danh sách sản phẩm */}
                        {selectedProducts && selectedProducts.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Icon icon="mdi:racket" className="h-5 w-5" />
                                <span>
                                    <b>
                                        {selectedProducts.reduce((sum, product) => sum + product.quantity, 0)} sản phẩm
                                        đã chọn
                                    </b>
                                </span>
                                <Icon icon="mdi:cash-multiple" className="h-5 w-5" />
                                <span>{totalProductPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-end gap-5 sm:h-20 sm:max-w-180 sm:flex-row">
                    <div className="hidden h-full w-1 bg-white sm:block"></div>
                    {/* Countdown Timer */}
                    {selectedCourts && selectedCourts.length > 0 && timeLeft > 0 && (
                        <div className="text-primary border-primary flex flex-col items-center rounded-lg border-2 border-solid bg-white p-2">
                            <span className="text-sm">Thời gian giữ sân:</span>
                            <span className="w-full text-3xl">{formatTime(timeLeft)}</span>
                        </div>
                    )}

                    {/* Tổng tiền & Đặt sân */}
                    <div className="flex max-w-full flex-col items-center sm:max-w-65">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-white">Tạm tính:</span>
                            <span className="text-lg font-bold">{TotalPrice.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div className="flex w-full gap-2">
                            <Button className="bg-primary w-full" onClick={handleConfirm}>
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
