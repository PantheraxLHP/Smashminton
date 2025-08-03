import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { SelectedCourts, SelectedProducts } from '../../app/booking/courts/page';
import { formatDate, formatTime } from '@/lib/utils';

export interface BookingBottomSheetProps {
    onConfirm?: () => void;
    selectedCourts: SelectedCourts[];
    selectedProducts: SelectedProducts[];
}

const BookingBottomSheet: React.FC<BookingBottomSheetProps> = ({ onConfirm, selectedCourts, selectedProducts }) => {
    const { removeCourtByIndex, totalCourtPrice, totalProductPrice, clearRentalOrder, TTL, fetchBooking } = useBooking();

    const [timeLeft, setTimeLeft] = useState(TTL);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (selectedCourts && selectedCourts.length > 0) {
            setTimeLeft(TTL);
        }
    }, [TTL, selectedCourts]);

    useEffect(() => {
        if (timeLeft <= 0 || !selectedCourts || selectedCourts.length === 0) {
            return;
        }

        let lastTime = Date.now();
        let animationId: number;

        const updateTimer = () => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;

            if (deltaTime >= 1000) {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        toast.warning('Thời gian đặt sân đã hết. Vui lòng chọn lại sân.');
                        clearRentalOrder();
                        window.location.reload();
                        return 0;
                    }
                    return prevTime - 1;
                });
                lastTime = currentTime;
            }

            if (timeLeft > 0) {
                animationId = requestAnimationFrame(updateTimer);
            }
        };

        animationId = requestAnimationFrame(updateTimer);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [TTL, selectedCourts, timeLeft, clearRentalOrder]);

    // onConfirm function use for booking page, if not set, it will redirect to payment page
    const handleConfirm = () => {
        if (onConfirm) {
            fetchBooking();
            onConfirm();
        } else {
            fetchBooking();
            router.push('/payment');
        }
    };

    const TotalPrice = totalCourtPrice + totalProductPrice;

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`fixed inset-x-0 bottom-0 z-50 bg-black text-white shadow-lg transition-transform duration-300 ${isCollapsed ? 'translate-y-full' : 'translate-y-0'
            }`}>
            {/* Toggle Button */}
            <div className="flex justify-center">
                <button
                    onClick={toggleCollapse}
                    className="absolute -top-5 sm:-top-7 flex h-5 w-12 sm:h-7 sm:w-14 items-center justify-center rounded-t-lg bg-primary hover:bg-primary-800 transition-colors shadow-lg border-2 border-primary-600"
                    aria-label={isCollapsed ? "Hiện bottom sheet" : "Ẩn bottom sheet"}
                >
                    <Icon
                        icon={isCollapsed ? "mdi:chevron-up" : "mdi:chevron-down"}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-white"
                    />
                </button>
            </div>

            <div className="p-2 sm:p-3 md:p-4">
                <div className="flex flex-col gap-2 max-h-[80vh] sm:max-h-30 sm:flex-row sm:items-center sm:gap-3">
                    {/* Scrollable Content */}
                    <div className="max-h-[80vh] flex-1 overflow-y-auto sm:max-h-30">
                        <div className="flex flex-col gap-1 sm:gap-2">
                            {/* Danh sách sân */}
                            {selectedCourts?.map((scCourt: SelectedCourts, index: number) => (
                                <div
                                    key={`
                                        ${scCourt.courtid}-${scCourt.zoneid}- ${scCourt.date}-
                                        ${scCourt.starttime}-${scCourt.duration}
                                    `}
                                    className="flex flex-wrap items-center gap-1 text-xs sm:flex-nowrap sm:gap-2 sm:text-sm"
                                >
                                    <span className="font-bold">
                                        {'Zone ' + String.fromCharCode(64 + (scCourt.zoneid || 1))}
                                    </span>
                                    <Icon icon="mdi:badminton" className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="font-bold">{scCourt.courtname}</span>

                                    <div className="flex items-center gap-1 sm:contents">
                                        <Icon icon="mdi:calendar" className="h-3 w-3 sm:h-5 sm:w-5" />
                                        <span className="text-xs sm:text-sm">{formatDate(scCourt.date) || ''}</span>
                                        <Icon icon="mdi:clock-outline" className="h-3 w-3 sm:h-5 sm:w-5" />
                                        <span className="text-xs sm:text-sm">{scCourt.starttime || ''}</span>
                                        <Icon icon="mdi:timer" className="h-3 w-3 sm:h-5 sm:w-5" />
                                        <span className="text-xs sm:text-sm">{scCourt.duration || ''}h</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:cash-multiple" className="h-3 w-3 sm:h-5 sm:w-5" />
                                        <span className="text-xs sm:text-sm">{scCourt.price.toLocaleString()} VND</span>
                                    </div>

                                    <Icon
                                        onClick={() => removeCourtByIndex(index)}
                                        icon="mdi:close-circle"
                                        className="text-primary-400 ml-auto h-5 w-5 cursor-pointer sm:ml-0"
                                    />
                                </div>
                            ))}

                            {/* Danh sách sản phẩm */}
                            {selectedProducts && selectedProducts.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1 text-xs sm:gap-2 sm:text-sm">
                                    <Icon icon="mdi:package-variant-closed" className="h-4 w-4 sm:size-6" />
                                    <span>
                                        <b>
                                            {selectedProducts.reduce((sum, product) => sum + product.quantity, 0)} sản
                                            phẩm đã chọn
                                        </b>
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:cash-multiple" className="h-3 w-3 sm:h-5 sm:w-5" />
                                        <span>{totalProductPrice.toLocaleString('vi-VN')} VNĐ</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:h-20 sm:max-w-120 sm:flex-row sm:items-center sm:gap-5">
                        <div className="hidden h-full w-1 bg-white sm:block"></div>

                        {/* Countdown Timer */}
                        {selectedCourts && selectedCourts.length > 0 && timeLeft > 0 && (
                            <div className="text-primary border-primary flex items-center justify-center rounded-lg border-2 border-solid bg-white p-2 sm:flex-col">
                                <span className="mr-2 text-xs sm:mr-0 sm:text-sm">Thời gian giữ sân:</span>
                                <span className="text-lg font-bold sm:w-full sm:text-3xl">{formatTime(timeLeft)}</span>
                            </div>
                        )}

                        {/* Tổng tiền & Đặt sân */}
                        <div className="flex flex-col items-center sm:max-w-65">
                            <div className="mb-2 flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
                                <span className="text-sm text-white sm:text-base">Tạm tính:</span>
                                <span className="text-lg font-bold sm:text-xl">
                                    {TotalPrice.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                            <div className="flex w-full gap-2">
                                <Button
                                    className="bg-primary w-full px-6 py-2 text-sm font-bold uppercase sm:px-8 sm:py-3"
                                    onClick={handleConfirm}
                                >
                                    THANH TOÁN
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingBottomSheet;
