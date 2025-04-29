'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import BookingStep from '../(court-booking)/BookingStep';
import BookingStepOne from '../(steps)/BookingStepOne';
import { getAvailableCourts } from '@/services/booking.service';
import { Courts, Products } from '@/types/types';
import BookingBottomSheet from '../(court-booking)/BookingBottomSheet';
import BookingNavigationButton from '../(court-booking)/BookingNavigationButton';
import { useRouter } from 'next/navigation';

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

export default function BookingCourtPage() {
    const [filters, setFilters] = useState<Filters>({
        fixedCourt: false,
    });
    const [courts, setCourts] = useState<CourtsWithPrice[]>([]); // Initialize with empty array
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourts[]>([]); // Danh sách sân muốn thuê
    const [resetTimer, setResetTimer] = useState<(() => void) | null>(null); // Hàm reset timer
    const resetTimerRef = useRef<(() => void) | null>(null); // Hàm reset timer
    const handleResetTimer = useCallback((resetFn: () => void) => {
        resetTimerRef.current = resetFn;
    }, []);
    const [isBookingBottomSheetVisible, setIsBookingBottomSheetVisible] = useState(true); // Điều khiển việc hiển thị BookingBottomSheet
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const router = useRouter();

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

    const handleConfirm = () => {
        router.push('/booking/payment');
    };

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

    // Tính tổng giá tiền
    const totalPrice =
        selectedCourts?.reduce((sum, scCourt) => sum + parseInt(scCourt.price.replace(/\D/g, '')), 0);


    return (
        <div className="p-4">
            <BookingStep
                currentStep={1}
                disableNavigation={false} // Set to true if you want to disable navigation in certain conditions
            />

            <BookingStepOne
                courts={courts}
                selectedCourts={selectedCourts}
                filters={filters}
                onFilterChange={handleFilterChange}
                onToggleChange={handleToggleChange}
                onAddCourt={handleAddCourt}
                onRemoveCourt={handleRemoveCourt}
            />

            <BookingNavigationButton currentStep={1} />

            {isBookingBottomSheetVisible && selectedCourts.length > 0 && (
                <BookingBottomSheet
                    onRemoveCourt={handleRemoveCourt}
                    onCancel={() => {
                        setIsBookingBottomSheetVisible(false);
                        setSelectedCourts([]);
                    }}
                    selectedCourts={selectedCourts}
                    totalPrice={totalPrice}
                    onResetTimer={handleResetTimer}
                    isTimerRunning={isTimerRunning}
                    currentStep={1}
                />
            )}
        </div>
    );
}
