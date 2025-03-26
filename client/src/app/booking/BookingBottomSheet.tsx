import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface Court {
    id: number;
    name: string;
    price: string;
    img: string;
}

interface Product {
    id: number;
    name: string;
    price: string;
    quantity: number;
}

interface Filters {
    zone?: string;
    date?: string;
    duration?: number;
    startTime?: string;
    fixedCourt?: boolean;
}

interface SelectedCourt {
    court: Court;
    filters: Filters;
}

interface BookingBottomSheetProps {
    totalPrice: number;
    selectedCourts: SelectedCourt[];
    selectedProducts: Product[];
    onRemoveCourt: (scCourt: SelectedCourt) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

const BookingBottomSheet: React.FC<BookingBottomSheetProps> = ({
    totalPrice,
    selectedCourts,
    selectedProducts,
    onRemoveCourt,
    onConfirm,
    onCancel,
}) => {
    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(() => {
        if (timeLeft <= 0) {
            onCancel();
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onCancel]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="fixed bottom-0 inset-x-0 bg-black text-white py-2 sm:p-4 shadow-lg z-50">
            <div className="flex flex-col gap-2 items-center sm:flex-row sm:max-h-20">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-0 max-h-[calc(100vh-150px)] sm:max-h-20">
                    <div className="flex flex-col gap-1">
                        {/* Danh sách sân */}
                        {selectedCourts.map(({ court, filters }) => (
                            <div
                                key={`${court.id}-${filters.zone}-${filters.date}-${filters.startTime}-${filters.duration}-${filters.fixedCourt}`}
                                className="flex items-center gap-2"
                            >
                                <span className="font-bold">{court.name}</span>
                                <Icon icon="mdi:calendar" className="w-5 h-5" />
                                <span>{filters.date}</span>
                                <Icon icon="mdi:clock-outline" className="w-5 h-5" />
                                <span>{filters.startTime}</span>
                                <Icon icon="mdi:timer" className="w-5 h-5" />
                                <span>{filters.duration}h</span>
                                <Icon
                                    onClick={() => onRemoveCourt({ court, filters })}
                                    icon="mdi:close-circle"
                                    className="w-5 h-5 text-red-500 cursor-pointer"
                                />
                            </div>
                        ))}

                        {/* Danh sách sản phẩm */}
                        <div className="flex flex-wrap gap-4">
                            {selectedProducts.map((product) => (
                                <div key={product.id} className="flex items-center gap-2">
                                    <Icon icon="mdi:racket" className="w-5 h-5" />
                                    <span>
                                        {product.quantity} {product.name}
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
                            onClick={onConfirm}
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
