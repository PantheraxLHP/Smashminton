'use client';

import { useBooking } from '@/context/BookingContext';
import { getCourtsAndDisableStartTimes } from '@/services/booking.service';
import { Products } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import BookingBottomSheet from '../../../components/atomic/BottomSheet';
import BookingStepper from '../_components/BookingStepper';
import BookingCourtList from './BookingCourtList';
import BookingFilter from './BookingFilter';

export interface SelectedCourts {
    zoneid: number;
    courtid: number;
    courtname: string | null;
    courtimgurl: string | null;
    dayfrom?: string | null;
    dayto?: string | null;
    date?: string;
    starttime: string;
    endtime: string;
    duration?: number;
    price: string;
    fixedCourt?: boolean;
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
    const router = useRouter();
    const searchParams = useSearchParams();
    const { selectedCourts, selectedProducts, TTL } = useBooking();

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
    const [courts, setCourts] = useState<SelectedCourts[]>([]);
    const [disableTimes, setDisableTimes] = useState<string[]>([]);
    const resetTimerRef = useRef<(() => void) | null>(null);
    const handleResetTimer = useCallback((resetFn: () => void) => {
        resetTimerRef.current = resetFn;
    }, []);

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

    const handleConfirm = () => {
        router.push('/booking/payment');
    };

    const hasSelectedItems = (selectedCourts?.length > 0 || selectedProducts?.length > 0) ?? false;

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

                        <BookingCourtList courts={courts} filters={filters} onToggleChange={handleToggleChange} />
                    </div>
                </div>
            </div>

            {hasSelectedItems && (
                <BookingBottomSheet
                    onConfirm={handleConfirm}
                    onResetTimer={handleResetTimer}
                    selectedCourts={selectedCourts}
                    selectedProducts={selectedProducts}
                    TTL={TTL}
                />
            )}
        </div>
    );
}
