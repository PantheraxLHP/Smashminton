import { Suspense } from 'react';
import DashboardServer from './DashboardServer';
import DashboardControls from './DashboardControls';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardPageProps {
    searchParams: { year?: string; tab?: string };
}

function DashboardLoading() {
    return (
        <div className="flex h-full min-h-screen w-full flex-col gap-4 bg-gray-200 p-4">
            {/* Header skeleton */}
            <div className="flex items-center gap-10 p-4">
                <Skeleton className="h-8 w-32" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>

            {/* Stats cards skeleton */}
            <div className="flex h-full w-full gap-2">
                <Skeleton className="h-32 w-1/4" />
                <Skeleton className="h-32 w-1/4" />
                <Skeleton className="h-32 w-2/4" />
            </div>

            {/* Charts skeleton */}
            <div className="flex h-80 w-full gap-2">
                <Skeleton className="h-full w-1/2" />
                <Skeleton className="h-full w-1/2" />
            </div>
            <div className="flex h-80 w-full gap-2">
                <Skeleton className="h-full w-1/2" />
                <Skeleton className="h-full w-1/2" />
            </div>
            <div className="flex h-80 w-full gap-2">
                <Skeleton className="h-full w-1/2" />
                <Skeleton className="h-full w-1/2" />
            </div>
        </div>
    );
}

function DashboardClient({ year, activeTab }: { year: number; activeTab: string }) {
    // This will be a client component wrapper for the server component
    // to handle the tab state properly
    return <DashboardServer year={year} activeTab={activeTab} />;
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
    const year = Number(searchParams.year) || new Date().getFullYear();
    const activeTab = searchParams.tab || 'số lượng';

    return (
        <div className="w-full">
            <DashboardControls activeTab={activeTab} />

            <Suspense key={`${year}-${activeTab}`} fallback={<DashboardLoading />}>
                <DashboardClient year={year} activeTab={activeTab} />
            </Suspense>
        </div>
    );
}
