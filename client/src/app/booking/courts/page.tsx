'use client';

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';
import {
    getCourts,
    getDisableStartTimes,
    getFixedCourts,
    getFixedCourtsDisableStartTimes,
} from '@/services/booking.service';
import { Products } from '@/types/types';
import { AlertDialogAction, AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import BookingBottomSheet from '../../../components/atomic/BottomSheet';
import BookingStepper from '../_components/BookingStepper';
import BookingCourtList from './BookingCourtList';
import BookingFilter from './BookingFilter';
import { Switch } from '@/components/ui/switch';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Tooltip, TooltipContent, TooltipRoot, TooltipTrigger } from '@/components/ui/tooltip';

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
    const [showFixedCourtDialog, setShowFixedCourtDialog] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
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
                        {/* AlertDialog for fixed court feature */}
                        <AlertDialog open={showFixedCourtDialog} onOpenChange={setShowFixedCourtDialog}>
                            <AlertDialogContent>
                                <AlertDialogTitle>
                                    Bạn có muốn sử dụng tính năng &quot;Đặt sân cố định&quot;?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tính năng này sẽ giúp bạn đặt sân cố định cho nhiều buổi liên tiếp. Bạn có muốn bật
                                    tính năng này không?
                                </AlertDialogDescription>
                                <div className="mt-4 flex justify-end gap-2">
                                    <AlertDialogCancel asChild>
                                        <Button variant="outline" onClick={() => setShowFixedCourtDialog(false)}>
                                            Không
                                        </Button>
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button onClick={() => setShowFixedCourtDialog(false)}>Có</Button>
                                    </AlertDialogAction>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                        {/* Toggle đặt sân cố định */}
                        <div className="mb-4 flex items-center justify-end">
                            <span className="text-gray-600">Đặt sân cố định:</span>
                            {/* Tooltip icon */}
                            <Tooltip>
                                <TooltipRoot open={tooltipOpen} onOpenChange={setTooltipOpen}>
                                    <TooltipTrigger>
                                        <button
                                            aria-label="Thông tin đặt sân cố định"
                                            className="bg-primary-500 mr-2 ml-2 flex items-center justify-center rounded-full p-1 text-white"
                                            onClick={() => setTooltipOpen(!tooltipOpen)}
                                        >
                                            <Icon icon="mdi:information-outline" className="text-lg text-white" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="z-1000 max-w-xs rounded-md bg-white p-2 text-sm shadow-md">
                                        <strong className="block">CÁCH ĐẶT SÂN CỐ ĐỊNH</strong>
                                        <ul className="list-disc pl-4">
                                            <li>
                                                Hệ thống hỗ trợ đặt sân cố định bằng cách đặt giúp bạn 4 buổi đánh...
                                            </li>
                                            <li>Sau khi kiểm tra, hệ thống sẽ hiển thị các sân phù hợp.</li>
                                            <li>Nếu không tìm thấy, hãy chọn khung giờ hoặc thời lượng chơi khác.</li>
                                            <li>
                                                Nếu không có sân nào, hệ thống sẽ tắt chức năng này và thử đặt thủ công.
                                            </li>
                                        </ul>
                                    </TooltipContent>
                                </TooltipRoot>
                            </Tooltip>
                            {/* Switch from shadcn/ui */}
                            <Switch
                                id="fixedCourt"
                                checked={fixedCourt}
                                onCheckedChange={() => setFixedCourt(!fixedCourt)}
                                className="ml-2"
                            />
                        </div>
                        <BookingCourtList courts={courts} fixedCourt={fixedCourt} />
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
