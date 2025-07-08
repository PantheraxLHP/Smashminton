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
    const { selectedCourts, selectedProducts, TTL } = useBooking();
    const { user } = useAuth();
    const [fixedCourt, setFixedCourt] = useState(false);
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
    });
    const [courts, setCourts] = useState<SelectedCourts[]>([]);
    const [disableTimes, setDisableTimes] = useState<string[]>([]);

    // Update filters, including fixedCourt
    const handleFilterChange = useCallback((newFilters: Filters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    }, []);

    // Update filters when search params change
    useEffect(() => {
        setFilters({
            zone: searchParams.get('zone') || '',
            date: searchParams.get('date') || '',
            duration: parseFloat(searchParams.get('duration') || '0'),
            startTime: searchParams.get('startTime') || '',
        });
    }, [searchParams]);

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
                        <BookingCourtList courts={courts} fixedCourt={fixedCourt} setFixedCourt={setFixedCourt} />
                    </div>
                </div>
            </div>

            {hasSelectedItems && (
                <BookingBottomSheet
                    onConfirm={handleConfirm}
                    selectedCourts={selectedCourts}
                    selectedProducts={selectedProducts}
                    TTL={TTL}
                />
            )}
        </div>
    );
}
