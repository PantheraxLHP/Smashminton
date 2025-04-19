'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import BookingStep from '@/app/booking/BookingStep';
import BookingFilter from '@/app/booking/BookingFilter';
import BookingCourtList from '@/app/booking/BookingCourtList';
import BookingBottomSheet from '@/app/booking/BookingBottomSheet';
import { Button } from '@/components/ui/button';
import { Courts, Products } from '@/types/types';
import PaymentInfo from './PaymentInfo';

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

export default function BookingPage() {
    const [step, setStep] = useState<number>(1);
    const [filters, setFilters] = useState<Filters>({
        fixedCourt: false,
    });
    const [courts, setCourts] = useState<CourtsWithPrice[]>([]); // Danh sách sân hiển thị
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourt[]>([]); // Danh sách sân muốn thuê
    const [products, setProducts] = useState<Products[]>([]); // Danh sách sản phẩm từ DB
    const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>([]); // Danh sách sản phẩm muốn mua
    const [resetTimer, setResetTimer] = useState<(() => void) | null>(null); // Hàm reset timer
    const handleResetTimer = useCallback((resetFn: () => void) => {
        setResetTimer(() => resetFn);
    }, []);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [isBookingBottomSheetVisible, setIsBookingBottomSheetVisible] = useState(true); // Điều khiển việc hiển thị BookingBottomSheet
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    // ✅ Update filters, including fixedCourt
    const handleFilterChange = useCallback((newFilters: Filters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    }, []);

    const handleToggleChange = useCallback((isFixed: boolean) => {
        handleFilterChange({ fixedCourt: isFixed });
    }, [handleFilterChange]);

    const handleConfirm = () => {
        setStep(3);
        setIsBookingBottomSheetVisible(false);
        setIsTimerRunning(false);
    };

    // ✅ Gọi API lấy danh sách sân theo bộ lọc, có debounce
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                const response = await fetch('/api/courts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filters),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch courts');
                }

                const data: CourtsWithPrice[] = await response.json();
                setCourts(data);
            } catch (error) {
                console.error('Error fetching courts:', error);
            }
        }, 500); // Đợi 500ms trước khi gọi API
    }, [filters]);

    const courtExDataV2: CourtsWithPrice[] = [
        { courtid: 1, courtname: 'Sân 1', courtprice: '120.000 VND', courtimgurl: '/Court1.png' },
        { courtid: 2, courtname: 'Sân 2', courtprice: '120.000 VND', courtimgurl: '/Court2.png' },
        { courtid: 3, courtname: 'Sân 3', courtprice: '120.000 VND', courtimgurl: '/Court3.png' },
        { courtid: 4, courtname: 'Sân 4', courtprice: '120.000 VND', courtimgurl: '/Court4.png' },
        { courtid: 5, courtname: 'Sân 5', courtprice: '120.000 VND', courtimgurl: '/Court5.png' },
        { courtid: 6, courtname: 'Sân 6', courtprice: '120.000 VND', courtimgurl: '/Court6.png' },
    ];

    // ✅ Thêm sân vào danh sách thuê
    const handleAddCourt = (scCourt: SelectedCourt) => {
        setSelectedCourts((prev) => [...prev, scCourt]);

        if (resetTimer) {
            resetTimer();
        }
    };

    // ✅ Xóa sân khỏi danh sách thuê
    const handleRemoveCourt = (scCourt: SelectedCourt) => {
        setSelectedCourts((prev) => prev.filter((court) =>
            court.courtid !== scCourt.courtid ||
            court.filters.zone !== scCourt.filters.zone ||
            court.filters.date !== scCourt.filters.date ||
            court.filters.duration !== scCourt.filters.duration ||
            court.filters.startTime !== scCourt.filters.startTime ||
            court.filters.fixedCourt !== scCourt.filters.fixedCourt
        ));
    };

    // ✅ Thêm sản phẩm vào danh sách mua
    const handleAddProduct = (scProduct: SelectedProducts) => {
        setSelectedProducts((prev) => {
            const existingProduct = prev.find((p) => p.productid === scProduct.productid);
            if (existingProduct) {
                return prev.map((p) =>
                    p.productid === scProduct.productid ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            scProduct.quantity = 1;
            return [...prev, scProduct];
        });
    };

    // ✅ Xóa sản phẩm khỏi danh sách mua
    const handleRemoveProduct = (productId: number) => {
        setSelectedProducts((prev) => prev.filter((product) => product.productid !== productId));
    };

    // ✅ Tính tổng giá tiền
    const totalPrice =
        selectedCourts.reduce((sum, scCourt) => sum + parseInt(scCourt.courtprice.replace(/\D/g, '')), 0) +
        selectedProducts.reduce(
            (sum, product) => sum + parseInt(String(product.sellingprice ?? '0').replace(/\D/g, '')) * product.quantity, 0
        );

    return (
        <div className="p-4">
            {/* Thanh bước tiến trình đặt sân */}
            <BookingStep currentStep={step} />

            {/* Nội dung từng bước */}
            {step === 1 && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {/* Bộ lọc chọn khu vực, thời gian, số giờ chơi */}
                        <BookingFilter onFilterChange={handleFilterChange} />

                        {/* Danh sách sân hiển thị theo filter */}
                        <div className="flex-1">
                            <BookingCourtList
                                courts={/*courts*/ courtExDataV2}
                                selectedCourts={selectedCourts}
                                filters={filters}
                                onToggleChange={handleToggleChange}
                                onAddCourt={handleAddCourt} // Thêm sân vào danh sách thuê
                                onRemoveCourt={handleRemoveCourt} // Xóa sân khỏi danh sách thuê
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="p-10 text-center text-lg font-semibold text-gray-500">Đang phát triển...</div>
            )}

            {step === 3 && (
                <PaymentInfo
                    paymentData={{
                        selectedMethod: null,
                        finalTotal: totalPrice,
                        items: selectedCourts.map((court) => ({
                            icon: court.courtimgurl || "",
                            description: court.courtname ?? "Tên sân không xác định",
                            quantity: "1",
                            duration: `${court.filters.duration ?? 1} giờ`,
                            time: court.filters.startTime ?? '',
                            unitPrice: parseInt(court.courtprice.replace(/\D/g, '')),
                            total: parseInt(court.courtprice.replace(/\D/g, '')),
                        })),
                        discount: 0.1, // giả sử có giảm giá 10%
                        invoiceCode: "None",
                        employeeCode: "None",
                        createdAt: new Date().toLocaleDateString(),
                        customerInfo: {
                            fullName: "Nguyễn Văn A",
                            phone: "0123456789",
                            email: "a@gmail.com",
                        },
                    }}
                />
            )}


            {/* Nút chuyển bước */}
            <div className="mt-4 flex justify-between">
                {/* Nút Quay lại */}
                <Button
                    onClick={() => {
                        const prevStep = step - 1;
                        setStep(prevStep);

                        if (prevStep < 3) {
                            setIsTimerRunning(true); // bật lại đồng hồ
                        }
                    }}
                    variant={'secondary'}
                    className={` ${step === 1 ? 'pointer-events-none opacity-0' : ''}`}
                >
                    ← Quay lại
                </Button>


                {/* Nút Tiếp theo */}
                <Button
                    onClick={() => setStep(step + 1)}
                    className={`bg-primary-500 text-white ${step === 3 ? 'pointer-events-none opacity-0' : ''}`}
                >
                    Tiếp theo →
                </Button>
            </div>

            {/* Hiển thị Bottom Sheet nếu có ít nhất 1 sân hoặc sản phẩm */}
            {step !== 3 && (selectedCourts.length > 0 || selectedProducts.length > 0) && (
                <BookingBottomSheet
                    totalPrice={totalPrice}
                    selectedCourts={selectedCourts}
                    selectedProducts={selectedProducts}
                    onRemoveCourt={handleRemoveCourt}
                    onConfirm={handleConfirm}
                    onCancel={() => {
                        setSelectedCourts([]);
                        setSelectedProducts([]);
                    }}
                    onResetTimer={handleResetTimer}
                    currentStep={step}
                    isTimerRunning={isTimerRunning}
                />
            )}
        </div>
    );
}
