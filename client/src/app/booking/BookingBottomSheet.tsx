import { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Courts, Products } from '@/types/types';
import { useRouter } from "next/navigation";


interface CourtsWithPrice extends Courts {
    courtprice: string;
}

interface SelectedCourt extends CourtsWithPrice {
    filters: Filters;
}

interface SelectedProducts extends Products {
    quantity: number;
}

interface Filters {
    zone?: string;
    date?: string;
    duration?: number;
    startTime?: string;
    fixedCourt?: boolean;
}

interface BookingBottomSheetProps {
    totalPrice: number;
    selectedCourts: SelectedCourt[];
    selectedProducts: SelectedProducts[];
    onRemoveCourt: (scCourt: SelectedCourt) => void;
    onConfirm: () => void;
    onCancel: () => void;
    onResetTimer(resetTimerFn: () => void): void;
}

const BookingBottomSheet: React.FC<BookingBottomSheetProps> = ({
    totalPrice,
    selectedCourts,
    selectedProducts,
    onRemoveCourt,
    onConfirm,
    onCancel,
    onResetTimer,
}) => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 phút => 300 giây
    const endTimeRef = useRef<number>(Date.now() + 300 * 1000); // 5 phút => milli giây
    const router = useRouter();

    useEffect(() => {
        const tick = () => {
            const remainingTime = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
            setTimeLeft(remainingTime);

            if (remainingTime > 0) {
                requestAnimationFrame(tick); // Non-blocking timer
            } else {
                onCancel();
            }
        };

        const animationFrame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationFrame);
    }, []);

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
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleConfirm = () => {
        router.push("/payment");
    }

    return (
        <div className="fixed bottom-0 inset-x-0 bg-black text-white py-2 sm:p-4 shadow-lg z-50">
            <div className="flex flex-col gap-2 items-center sm:flex-row sm:max-h-20">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-0 max-h-[calc(100vh-150px)] sm:max-h-20">
                    <div className="flex flex-col gap-1">
                        {/* Danh sách sân */}
                        {selectedCourts.map((scCourt) => (
                            <div
                                key={`
                                    ${scCourt.courtid}-${scCourt.filters.zone}-${scCourt.filters.date}-
                                    ${scCourt.filters.startTime}-${scCourt.filters.duration}-
                                    ${scCourt.filters.fixedCourt}
                                `}
                                className="flex items-center gap-2"
                            >
                                <span className="font-bold">{scCourt.courtname}</span>
                                <Icon icon="mdi:calendar" className="w-5 h-5" />
                                <span>{scCourt.filters.date}</span>
                                <Icon icon="mdi:clock-outline" className="w-5 h-5" />
                                <span>{scCourt.filters.startTime}</span>
                                <Icon icon="mdi:timer" className="w-5 h-5" />
                                <span>{scCourt.filters.duration}h</span>
                                <Icon
                                    onClick={() => onRemoveCourt(scCourt)}
                                    icon="mdi:close-circle"
                                    className="w-5 h-5 text-red-500 cursor-pointer"
                                />
                            </div>
                        ))}

                        {/* Danh sách sản phẩm */}
                        <div className="flex flex-wrap gap-4">
                            {selectedProducts.map((scProduct) => (
                                <div key={scProduct.productid} className="flex items-center gap-2">
                                    <Icon icon="mdi:racket" className="w-5 h-5" />
                                    <span>
                                        {scProduct.quantity} {scProduct.productname}
                                    </span>
                                    <Icon
                                        icon="mdi:close-circle"
                                        className="w-5 h-5 text-red-500 cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="flex flex-col sm:flex-row gap-2 items-center justify-between sm:h-20 sm:min-w-90 sm:max-w-180">
                    <div className="hidden sm:block h-full w-1 bg-white"></div>
                    {/* Countdown Timer */}
                    <div className="flex flex-col items-center bg-white text-primary border-2 border-solid border-primary p-2 rounded-lg">
                        <span className="text-sm">Thời gian giữ sân:</span>
                        <span className="text-3xl w-full">{formatTime(timeLeft)}</span>
                    </div>

                    {/* Tổng tiền & Đặt sân */}
                    <div className="flex flex-col items-center max-w-full sm:max-w-65">
                        <div className="flex mb-2 gap-2 items-center">
                            <span className="text-white">Tạm tính:</span>
                            <span className="text-lg font-bold">
                                {totalPrice.toLocaleString("vi-VN")} VND
                            </span>
                        </div>
                        <Button
                            className="w-full bg-primary"
                            onClick={handleConfirm}
                        >
                            ĐẶT SÂN
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingBottomSheet;
