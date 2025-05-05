'use client';

import { getCourtsAndDisableStartTimes } from '@/services/booking.service';
import { Courts, Products } from '@/types/types';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import BookingBottomSheet from '../_components/BookingBottomSheet';
import BookingCourtList from './BookingCourtList';
import BookingFilter from './BookingFilter';
import BookingStepper from '../_components/BookingStepper';

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
    const [disableTimes, setDisableTimes] = useState<string[]>([]);
    const resetTimerRef = useRef<(() => void) | null>(null);
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

    // Use to fetch courts and disable start times when filters change
    useEffect(() => {
        const fetchCourtsAndDisableStartTimes = async () => {
            try {
                if (filters.zone && filters.date && filters.startTime && filters.duration !== undefined) {
                    const result = await getCourtsAndDisableStartTimes(filters);
                    if (!result.ok) {
                        setDisableTimes([]);
                        setCourts([]);
                        toast.error(result.message || 'Không thể tải danh sách sân');
                    } else {
                        setCourts(result.data.availableCourts);
                        setDisableTimes(result.data.unavailableStartTimes);
                    }
                }
            } catch (error) {
                setDisableTimes([]);
                setCourts([]);
                toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách sân');
            }
        };

        fetchCourtsAndDisableStartTimes();
    }, [filters]);

    const handleAddCourt = (scCourt: SelectedCourts) => {
        // save it to redis
        const existingCourt = selectedCourts.find(
            (court) =>
                court.courtid === scCourt.courtid &&
                court.filters.zone === scCourt.filters.zone &&
                court.filters.date === scCourt.filters.date &&
                court.filters.duration === scCourt.filters.duration &&
                court.filters.startTime === scCourt.filters.startTime &&
                court.filters.fixedCourt === scCourt.filters.fixedCourt,
        );
        if (existingCourt) {
            toast.error('Sân đã được chọn');
            return;
        }
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
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap justify-center gap-4">
                    <BookingFilter
                        initialFilters={filters}
                        onFilterChange={handleFilterChange}
                        disableTimes={disableTimes}
                    />
                    <div className="flex-1">
                        <BookingStepper currentStep={1} />

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
