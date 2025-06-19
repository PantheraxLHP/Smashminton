import { Suspense } from 'react';
import PredictionServer from './PredictionServer';
import PredictionControls from './PredictionControls';
import { Skeleton } from '@/components/ui/skeleton';

interface PredictionPageProps {
    searchParams: {
        year?: string;
        timeType?: string;
        selectedTime?: string;
        sortOrder?: string;
        showTable?: string;
    };
}

function PredictionLoading() {
    return (
        <div className="flex h-full min-h-screen w-full flex-col gap-4 bg-gray-200 p-4">
            {/* Header skeleton */}
            <div className="flex items-center justify-between p-4">
                <Skeleton className="h-8 w-64" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>

            {/* Charts skeleton */}
            <div className="flex h-80 w-full gap-2">
                <Skeleton className="h-full w-1/2" />
                <Skeleton className="h-full w-1/2" />
            </div>

            {/* Double bar chart skeleton */}
            <div className="h-80 w-full">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Table skeleton */}
            <div className="h-64 w-full">
                <Skeleton className="h-full w-full" />
            </div>
        </div>
    );
}

function PredictionClient({
    timeType,
    selectedTime,
    selectedYear,
    sortOrder,
    showTable,
}: {
    timeType: 'Tháng' | 'Quý';
    selectedTime: string;
    selectedYear: number;
    sortOrder: 'asc' | 'desc';
    showTable: boolean;
}) {
    return (
        <PredictionServer
            timeType={timeType}
            selectedTime={selectedTime}
            selectedYear={selectedYear}
            sortOrder={sortOrder}
            showTable={showTable}
        />
    );
}

export default function PredictionPage({ searchParams }: PredictionPageProps) {
    const selectedYear = Number(searchParams.year) || 2024;
    const timeType = (searchParams.timeType as 'Tháng' | 'Quý') || 'Tháng';
    const selectedTime = searchParams.selectedTime || 'Tháng 1';
    const sortOrder = (searchParams.sortOrder as 'asc' | 'desc') || 'desc';
    const showTable = searchParams.showTable === 'true';

    return (
        <div className="w-full">
            <PredictionControls timeType={timeType} selectedTime={selectedTime} selectedYear={selectedYear} />

            <Suspense
                key={`${selectedYear}-${timeType}-${selectedTime}-${sortOrder}-${showTable}`}
                fallback={<PredictionLoading />}
            >
                <PredictionClient
                    timeType={timeType}
                    selectedTime={selectedTime}
                    selectedYear={selectedYear}
                    sortOrder={sortOrder}
                    showTable={showTable}
                />
            </Suspense>
        </div>
    );
}
