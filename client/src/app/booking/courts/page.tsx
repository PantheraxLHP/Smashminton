'use client';

import { getAvailableCourts } from '@/services/booking.service';
import { Courts, Products } from '@/types/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import BookingBottomSheet from '../_components/BookingBottomSheet';
import BookingNavigationButton from '../_components/BookingNavigationButton';
import BookingStep from '../_components/BookingStep';
import BookingCourtList from './BookingCourtList';
import BookingFilter from './BookingFilter';

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

export default function BookingCourtsPage() {
    const searchParams = useSearchParams();

    // Parse params and convert to correct types
    const zone = searchParams.get('zone') || '';
    const date = searchParams.get('date') || '';
    const duration = parseFloat(searchParams.get('duration') || '0');
    const startTime = searchParams.get('startTime') || '';

    const [filters, setFilters] = useState<Filters>({
        zone,
        date,
        duration,
        startTime,
        fixedCourt: false,
    });
    const [courts, setCourts] = useState<CourtsWithPrice[]>([]); // Initialize with empty array
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourts[]>([]); // Danh sách sân muốn thuê
    const resetTimerRef = useRef<(() => void) | null>(null); // Hàm reset timer
    const handleResetTimer = useCallback((resetFn: () => void) => {
        resetTimerRef.current = resetFn;
    }, []);
    const [isBookingBottomSheetVisible, setIsBookingBottomSheetVisible] = useState(true); // Điều khiển việc hiển thị BookingBottomSheet

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
            } catch (error) {
                setCourts([]); // Reset to empty array on error
                toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách sân');
            }
        };

        fetchAvailableCourts();
    }, [filters]); // Dependencies array now includes filters

    const handleAddCourt = (scCourt: SelectedCourts) => {
        setSelectedCourts((prev) => [...prev, scCourt]);
        if (!isBookingBottomSheetVisible) {
            setIsBookingBottomSheetVisible(true);
        }
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
    const totalPrice = selectedCourts?.reduce((sum, scCourt) => sum + parseInt(scCourt.price.replace(/\D/g, '')), 0);

    return (
        <div className="p-4">
            <BookingStep currentStep={1} disableNavigation={false} />
            <BookingNavigationButton currentStep={1} />

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap justify-center gap-4">
                    <BookingFilter initialFilters={filters} onFilterChange={handleFilterChange} />
                    <div className="flex-1">
                        <BookingCourtList
                            courts={courts}
                            selectedCourts={selectedCourts}
                            filters={filters}
                            onToggleChange={handleToggleChange}
                            onAddCourt={handleAddCourt}
                            onRemoveCourt={handleRemoveCourt}
                        />
                    </div>
                </div>
            </div>

            {isBookingBottomSheetVisible && selectedCourts.length > 0 && (
                <BookingBottomSheet
                    onRemoveCourt={handleRemoveCourt}
                    onCancel={() => {
                        setSelectedCourts([]);
                    }}
                    selectedCourts={selectedCourts}
                    totalPrice={totalPrice}
                    onResetTimer={handleResetTimer}
                />
            )}
        </div>
    );
}
