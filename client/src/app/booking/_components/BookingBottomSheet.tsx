import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectedCourts, SelectedProducts } from '../courts/page';

interface BookingBottomSheetProps {
    totalPrice: number;
    selectedCourts?: SelectedCourts[];
    selectedProducts?: SelectedProducts[];
    onRemoveCourt?: (scCourt: SelectedCourts) => void;
    onRemoveProduct?: (productid: number) => void;
    onCancel?: () => void;
    onResetTimer?(resetTimerFn: () => void): void;
    currentStep?: number;
    isTimerRunning?: boolean;
}

const BookingBottomSheet: React.FC<BookingBottomSheetProps> = ({
    totalPrice,
    selectedCourts,
    selectedProducts,
    onRemoveCourt,
    onRemoveProduct,
    onCancel,
    onResetTimer,
    currentStep,
    isTimerRunning,
}) => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 phút => 300 giây
    const endTimeRef = useRef<number>(Date.now() + 300 * 1000); // 5 phút => milli giây
    const router = useRouter();

    useEffect(() => {
        if (currentStep === 3 || !isTimerRunning) return; // Nếu là bước 3 hoặc bộ đếm giờ không chạy, dừng bộ đếm giờ

        const tick = () => {
            const remainingTime = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
            setTimeLeft(remainingTime);

            if (remainingTime > 0) {
                requestAnimationFrame(tick);
            } else {
                onCancel?.();
            }
        };

        const animationFrame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animationFrame);
    }, [currentStep, onCancel, isTimerRunning]);

    const resetTimer = useCallback(() => {
        endTimeRef.current = Date.now() + 300 * 1000;
        setTimeLeft(300);
    }, []);

    useEffect(() => {
        if (onResetTimer) {
            onResetTimer(resetTimer);
        }
    }, [onResetTimer, resetTimer]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleConfirm = () => {
        router.push('/booking/payment');
    };

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-black py-2 text-white shadow-lg sm:p-4">
            <div className="flex flex-col items-center gap-2 sm:max-h-20 sm:flex-row">
                {/* Scrollable Content */}
                <div className="max-h-[calc(100vh-150px)] flex-1 overflow-y-auto p-0 sm:max-h-20">
                    <div className="flex flex-col gap-1">
                        {/* Danh sách sân */}
                        {selectedCourts?.map((scCourt) => (
                            <div
                                key={`
                                    ${scCourt.courtid}-${scCourt.filters.zone}-${scCourt.filters.date}-
                                    ${scCourt.filters.startTime}-${scCourt.filters.duration}-
                                    ${scCourt.filters.fixedCourt}
                                `}
                                className="flex items-center gap-2"
                            >
                                <span className="font-bold">{scCourt.courtname}</span>
                                <Icon icon="mdi:calendar" className="h-5 w-5" />
                                <span>{scCourt.filters.date}</span>
                                <Icon icon="mdi:clock-outline" className="h-5 w-5" />
                                <span>{scCourt.filters.startTime}</span>
                                <Icon icon="mdi:timer" className="h-5 w-5" />
                                <span>{scCourt.filters.duration}h</span>
                                <Icon
                                    onClick={() => onRemoveCourt?.(scCourt)}
                                    icon="mdi:close-circle"
                                    className="h-5 w-5 cursor-pointer text-red-500"
                                />
                            </div>
                        ))}

                        {/* Danh sách sản phẩm */}
                        <div className="flex flex-wrap gap-4">
                            {selectedProducts?.map((scProduct) => (
                                <div key={scProduct.productid} className="flex items-center gap-2">
                                    <Icon icon="mdi:racket" className="h-5 w-5" />
                                    <span>
                                        {scProduct.quantity} {scProduct.productname}
                                    </span>
                                    <Icon
                                        icon="mdi:close-circle"
                                        className="h-5 w-5 cursor-pointer text-red-500"
                                        onClick={() => onRemoveProduct?.(scProduct.productid)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-end gap-5 sm:h-20 sm:max-w-180 sm:min-w-90 sm:flex-row">
                    <div className="hidden h-full w-1 bg-white sm:block"></div>
                    {/* Countdown Timer */}
                    {selectedCourts && selectedCourts.length > 0 && (
                        <div className="text-primary border-primary flex flex-col items-center rounded-lg border-2 border-solid bg-white p-2">
                            <span className="text-sm">Thời gian giữ sân:</span>
                            <span className="w-full text-3xl">{formatTime(timeLeft)}</span>
                        </div>
                    )}

                    {/* Tổng tiền & Đặt sân */}
                    <div className="flex max-w-full flex-col items-center sm:max-w-65">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-white">Tạm tính:</span>
                            <span className="text-lg font-bold">{totalPrice.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <Button className="bg-primary w-full" onClick={handleConfirm}>
                            THANH TOÁN
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingBottomSheet;
