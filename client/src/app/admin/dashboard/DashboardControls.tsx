'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';

interface DashboardControlsProps {
    activeTab: string;
}

export default function DashboardControls({ activeTab }: DashboardControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentYear = Number(searchParams.get('year')) || new Date().getFullYear();
    const newCustomerTabs = ['Số lượng', 'Tỉ lệ %'];

    const handleYearChange = (year: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('year', year.toString());
        router.push(`?${params.toString()}`);
    };

    const handleTabChange = (tab: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', tab);
        router.push(`?${params.toString()}`);
    };

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <>
            {/* Header with controls */}
            <div className="flex items-center gap-10 p-4">
                <span className="text-2xl font-semibold">Dashboard</span>
                <div className="flex items-center gap-4">
                    <select
                        value={currentYear}
                        onChange={(e) => handleYearChange(Number(e.target.value))}
                        className="rounded border px-3 py-2"
                    >
                        {Array.from({ length: 7 }, (_, i) => 2025 - i).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleRefresh}
                        className="bg-primary hover:bg-primary-600 rounded px-3 py-2 text-white transition-colors"
                    >
                        <Icon icon="material-symbols:refresh" className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Tab switcher for new customers card */}
            <div className="hidden">
                <div className="relative flex h-fit w-fit rounded-full border bg-gray-100 shadow-inner">
                    <div
                        className="absolute top-0 h-full rounded-full bg-white shadow-lg transition-transform duration-300 ease-out"
                        style={{
                            width: `${100 / newCustomerTabs.length}%`,
                            transform: `translateX(${newCustomerTabs.indexOf(activeTab) * 100}%)`,
                        }}
                    />
                    {newCustomerTabs.map((tab, index) => (
                        <div
                            key={index}
                            className="relative z-10 flex w-20 cursor-pointer justify-center px-2 py-0.5 transition-colors duration-200"
                            onClick={() => handleTabChange(tab)}
                        >
                            <span
                                className={`text-sm transition-colors duration-200 ${
                                    activeTab === tab ? 'text-gray-700' : 'text-gray-500'
                                }`}
                            >
                                {tab}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

// Export the tab switcher as a separate component that can be used in the server component
export function CustomerTabSwitcher({ activeTab }: { activeTab: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const newCustomerTabs = ['Số lượng', 'Tỉ lệ %'];

    const handleTabChange = (tab: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', tab);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="relative flex h-fit w-fit rounded-full border bg-gray-100 shadow-inner">
            <div
                className="absolute top-0 h-full rounded-full bg-white shadow-lg transition-transform duration-300 ease-out"
                style={{
                    width: `${100 / newCustomerTabs.length}%`,
                    transform: `translateX(${newCustomerTabs.indexOf(activeTab) * 100}%)`,
                }}
            />
            {newCustomerTabs.map((tab, index) => (
                <div
                    key={index}
                    className="relative z-10 flex w-20 cursor-pointer justify-center px-2 py-0.5 transition-colors duration-200"
                    onClick={() => handleTabChange(tab)}
                >
                    <span
                        className={`text-sm transition-colors duration-200 ${
                            activeTab === tab ? 'text-gray-700' : 'text-gray-500'
                        }`}
                    >
                        {tab}
                    </span>
                </div>
            ))}
        </div>
    );
}
