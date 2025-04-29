'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import BookingStep from './(court-booking)/BookingStep';
import BookingStepOne from './(steps)/BookingStepOne';
import BookingStepTwo from './(steps)/BookingStepTwo';
import BookingStepThree from './(steps)/BookingStepThree';
import { getAvailableCourts } from '@/services/booking.service';
import { Courts, Products } from '@/types/types';
import BookingBottomSheet from './(court-booking)/BookingBottomSheet';

export interface CourtsWithPrice extends Courts {
    price: string;
}

export interface SelectedCourts extends CourtsWithPrice {
    filters: Filters;
}

export interface SelectedProducts extends Products {
    quantity: number;
}

export interface Filters {
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
    const [courts, setCourts] = useState<CourtsWithPrice[]>([]); // Initialize with empty array
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourts[]>([]); // Danh sách sân muốn thuê
    const [products, setProducts] = useState<Products[]>([]); // Danh sách sản phẩm từ DB
    const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>([]); // Danh sách sản phẩm muốn mua
    const resetTimerRef = useRef<(() => void) | null>(null); // Hàm reset timer
    const handleResetTimer = useCallback((resetFn: () => void) => {
        resetTimerRef.current = resetFn;
    }, []);
    const [isBookingBottomSheetVisible, setIsBookingBottomSheetVisible] = useState(true); // Điều khiển việc hiển thị BookingBottomSheet
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    // const handleStepClick = (newStep: number) => {
    //     // Only allow navigation to steps that are less than or equal to current step
    //     if (newStep <= step) {
    //         setStep(newStep);
    //         if (newStep < 3) {
    //             setIsTimerRunning(true);
    //         }
    //     }
    // };

    // Update filters, including fixedCourt
    const handleFilterChange = useCallback((newFilters: Filters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    }, []);

    const handleToggleChange = useCallback(
        (isFixed: boolean) => {
            handleFilterChange({ fixedCourt: isFixed });
        },
        [handleFilterChange],
    );

    // const handleConfirm = () => {
    //     setStep(3);
    //     setIsBookingBottomSheetVisible(false);
    //     setIsTimerRunning(false);
    // };

    useEffect(() => {
        const fetchAvailableCourts = async () => {
            try {
                if (filters.zone && filters.date && filters.startTime && filters.duration !== undefined) {
                    const result = await getAvailableCourts(filters);
                    if (!result.ok) {
                        setCourts([]); // Reset to empty array if no data
                        toast.error(result.message || 'Không thể tải danh sách sân');
                    }
                    setCourts(result.data);
                }
            } catch (err) {
                setCourts([]); // Reset to empty array on error
                toast.error('Không thể tải danh sách sân. Vui lòng thử lại sau.');
            }
        };

        fetchAvailableCourts();
    }, [filters]); // Dependencies array now includes filters

    const handleAddCourt = (scCourt: SelectedCourts) => {
        setSelectedCourts((prev) => [...prev, scCourt]);

        resetTimerRef.current?.();
    };

    // Xóa sân khỏi danh sách thuê
    const handleRemoveCourt = (scCourt: SelectedCourts) => {
        setSelectedCourts((prev) =>
            prev.filter(
                (court) =>
                    court.courtid !== scCourt.courtid ||
                    court.filters.zone !== scCourt.filters.zone ||
                    court.filters.date !== scCourt.filters.date ||
                    court.filters.duration !== scCourt.filters.duration ||
                    court.filters.startTime !== scCourt.filters.startTime ||
                    court.filters.fixedCourt !== scCourt.filters.fixedCourt,
            ),
        );
    };

    // Thêm sản phẩm vào danh sách mua
    const handleAddProduct = (scProduct: SelectedProducts) => {
        setSelectedProducts((prev) => {
            const existingProduct = prev.find((p) => p.productid === scProduct.productid);
            if (existingProduct) {
                return prev.map((p) => (p.productid === scProduct.productid ? { ...p, quantity: p.quantity + 1 } : p));
            }
            scProduct.quantity = 1;
            return [...prev, scProduct];
        });
    };

    // Xóa sản phẩm khỏi danh sách mua
    const handleRemoveProduct = (productId: number) => {
        setSelectedProducts((prev) => prev.filter((product) => product.productid !== productId));
    };

    // Tính tổng giá tiền
    const totalPrice =
        selectedCourts.reduce((sum, scCourt) => sum + parseInt(scCourt.price.replace(/\D/g, '')), 0) +
        selectedProducts.reduce(
            (sum, product) => sum + parseInt(String(product.sellingprice ?? '0').replace(/\D/g, '')) * product.quantity,
            0,
        );

    const renderCurrentStep = () => {
        switch (step) {
            case 1:
                return (
                    <BookingStepOne
                        courts={courts}
                        selectedCourts={selectedCourts}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onToggleChange={handleToggleChange}
                        onAddCourt={handleAddCourt}
                        onRemoveCourt={handleRemoveCourt}
                    />
                );
            case 2:
                return <BookingStepTwo />;
            case 3:
                return <BookingStepThree selectedCourts={selectedCourts} totalPrice={totalPrice} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-4">
            <BookingStep
                currentStep={step}
                // onStepClick={handleStepClick}
                disableNavigation={false} // Set to true if you want to disable navigation in certain conditions
            />

            {renderCurrentStep()}

            <div className="mt-4 flex justify-between">
                <Button
                    onClick={() => {
                        const prevStep = step - 1;
                        setStep(prevStep);
                        if (prevStep < 3) {
                            setIsTimerRunning(true);
                        }
                    }}
                    variant={'secondary'}
                    className={`${step === 1 ? 'pointer-events-none opacity-0' : ''}`}
                >
                    ← Quay lại
                </Button>

                <Button
                    onClick={() => setStep(step + 1)}
                    className={`bg-primary-500 text-white ${step === 3 ? 'pointer-events-none opacity-0' : ''}`}
                >
                    Tiếp theo →
                </Button>
            </div>

            {step !== 3 && (selectedCourts.length > 0 || selectedProducts.length > 0) && (
                <BookingBottomSheet
                    totalPrice={totalPrice}
                    selectedCourts={selectedCourts}
                    selectedProducts={selectedProducts}
                    onRemoveCourt={handleRemoveCourt}
                    // onConfirm={handleConfirm}
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
