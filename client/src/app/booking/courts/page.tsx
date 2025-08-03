'use client';

import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import {
    getCourts,
    getDisableStartTimes,
    getFixedCourts,
    getFixedCourtsDisableStartTimes,
} from '@/services/booking.service';
import { Products } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import BookingBottomSheet from '../../../components/atomic/BottomSheet';
import BookingStepper from '../_components/BookingStepper';
import BookingCourtList from './BookingCourtList';
import BookingFilter from './BookingFilter';
import { bookingFiltersSchema, sanitizeString, sanitizeNumber } from '@/lib/validation.schema';

export interface SelectedCourts {
    zoneid: number;
    courtid: number;
    courtname: string | null;
    courtimgurl: string | null;
    date: string;
    starttime: string;
    endtime: string;
    duration: number;
    price: number;
    avgrating?: number | null;
}

export interface SelectedProducts extends Products {
    unitprice: number;
    quantity: number;
    totalamount: number;
    totalStockQuantity: number;
}

export interface Filters {
    zone?: string;
    date?: string;
    duration?: number;
    startTime?: string;
}

export default function BookingCourtsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { selectedCourts, selectedProducts, TTL, refreshTrigger } = useBooking();
    const { user } = useAuth();
    const [fixedCourt, setFixedCourt] = useState(false);

    // Helper function to get today's date in YYYY-MM-DD format
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Parse and validate URL parameters
    const parseUrlParams = () => {
        const rawZone = searchParams.get('zone') || '1';
        const rawDate = searchParams.get('date') || getTodayDateString();
        const rawDuration = sanitizeNumber(searchParams.get('duration') || '0') || 0;
        const rawStartTime = searchParams.get('startTime') || '';

        try {
            // Validate the complete filter object
            const validatedFilters = bookingFiltersSchema.partial().parse({
                zone: sanitizeString(rawZone),
                date: rawDate,
                duration: rawDuration > 0 ? rawDuration : undefined,
                startTime: rawStartTime ? sanitizeString(rawStartTime) : undefined,
            });

            return {
                zone: validatedFilters.zone || '1',
                date: validatedFilters.date || getTodayDateString(),
                duration: validatedFilters.duration || 0,
                startTime: validatedFilters.startTime || '',
            };
        } catch (error) {
            // If validation fails, return safe defaults
            toast.warning('Một số thông số không hợp lệ, đã được thiết lập lại');
            return {
                zone: '1',
                date: getTodayDateString(),
                duration: 0,
                startTime: '',
            };
        }
    };

    const [filters, setFilters] = useState<Filters>(parseUrlParams());

    const [courts, setCourts] = useState<SelectedCourts[]>([]);
    const [disableTimes, setDisableTimes] = useState<string[]>([]);
    const startTimes = [
        '06:00',
        '06:30',
        '07:00',
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30',
        '18:00',
        '18:30',
        '19:00',
        '19:30',
        '20:00',
        '20:30',
        '21:00',
        '21:30',
    ];

    // Update filters, including fixedCourt
    const handleFilterChange = useCallback((newFilters: Filters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.zone) params.append('zone', filters.zone);
        if (filters.date) params.append('date', filters.date);
        if (filters.duration) params.append('duration', filters.duration.toString());
        if (filters.startTime) params.append('startTime', filters.startTime);

        router.push(`/booking/courts?${params.toString()}`, { scroll: false });
    }, [filters, router]);

    useEffect(() => {
        setFilters(parseUrlParams());
    }, [searchParams]);

    useEffect(() => {
        const currentZone = searchParams.get('zone');
        const currentDate = searchParams.get('date');

        if (!currentZone || !currentDate) {
            const params = new URLSearchParams(searchParams.toString());
            if (!currentZone) params.set('zone', '1');
            if (!currentDate) params.set('date', getTodayDateString());

            router.replace(`/booking/courts?${params.toString()}`);
        }
    }, []);

    // Use to fetch courts and disable start times when filters change
    const fetchDisableStartTimes = async () => {
        if (filters.zone && filters.date && filters.duration) {
            const result = await getDisableStartTimes(filters);
            if (!result.ok) {
                setDisableTimes([]);
            } else {
                setDisableTimes(result.data);
            }
        }
    };

    const fetchCourts = async () => {
        if (filters.zone && filters.date && filters.duration && filters.startTime) {
            const result = await getCourts(filters);
            if (!result.ok) {
                setCourts([]);
                toast.error(result.message || 'Không thể tải danh sách sân khả dụng');
            } else {
                setCourts(result.data);
            }
        }
    };

    const fetchFixedCourtsDisableStartTimes = async () => {
        if (filters.zone && filters.date && filters.duration) {
            const result = await getFixedCourtsDisableStartTimes(filters);
            if (!result.ok) {
                setDisableTimes([]);
            } else {
                setDisableTimes(result.data);
            }
        }
    };

    const fetchFixedCourts = async () => {
        if (filters.zone && filters.date && filters.duration && filters.startTime) {
            const result = await getFixedCourts(filters);
            if (!result.ok) {
                setCourts([]);
                toast.error(result.message || 'Không thể tải danh sách sân khả dụng');
            } else {
                setCourts(result.data);
            }
        }
    };

    useEffect(() => {
        if (!user) {
            toast.warning('Bạn cần đăng nhập để đặt sân');
            router.push('/signin');
            return;
        }
        if (fixedCourt) {
            fetchFixedCourtsDisableStartTimes();
            fetchFixedCourts();
        } else {
            fetchDisableStartTimes();
            fetchCourts();
        }
    }, [filters, fixedCourt]);

    useEffect(() => {
        if (filters.startTime && disableTimes.length > 0 && disableTimes.includes(filters.startTime)) {
            const nextAvailableTime = startTimes.find((time) => !disableTimes.includes(time));
            if (nextAvailableTime) {
                setFilters((prev) => ({ ...prev, startTime: nextAvailableTime }));
            } else {
                setFilters((prev) => ({ ...prev, startTime: '' }));
            }
        }
    }, [disableTimes, filters.startTime]);

    // Add this useEffect to handle refreshTrigger changes
    useEffect(() => {
        if (refreshTrigger > 0) {
            // Re-fetch courts when refreshTrigger changes
            if (fixedCourt) {
                fetchFixedCourts();
            } else {
                fetchCourts();
            }
        }
    }, [refreshTrigger, fixedCourt]);

    const handleConfirm = () => {
        router.push('/booking/payment');
    };

    const hasSelectedItems = (selectedCourts?.length > 0 || selectedProducts?.length > 0) ?? false;

    return (
        <div className="p-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap justify-center gap-4">
                    <BookingFilter filters={filters} onFilterChange={handleFilterChange} disableTimes={disableTimes} />
                    <div className="flex-1">
                        <BookingStepper currentStep={1} />
                        <BookingCourtList courts={courts} fixedCourt={fixedCourt} setFixedCourt={setFixedCourt} />
                    </div>
                </div>
            </div>

            {hasSelectedItems && (
                <BookingBottomSheet
                    onConfirm={handleConfirm}
                    selectedCourts={selectedCourts}
                    selectedProducts={selectedProducts}
                />
            )}
        </div>
    );
}
