'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';

interface PredictionControlsProps {
    timeType: string;
    selectedTime: string;
    selectedYear: number;
}

export default function PredictionControls({ timeType, selectedTime, selectedYear }: PredictionControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleYearChange = (year: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('year', year.toString());
        router.push(`?${params.toString()}`);
    };

    const handleTimeTypeChange = (type: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('timeType', type);
        // Reset selectedTime when changing type
        if (type === 'Tháng') {
            params.set('selectedTime', 'Tháng 1');
        } else {
            params.set('selectedTime', 'Quý 1');
        }
        router.push(`?${params.toString()}`);
    };

    const handleTimeChange = (time: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('selectedTime', time);
        router.push(`?${params.toString()}`);
    };

    const handleRefresh = () => {
        router.refresh();
    };

    const handlePredict = () => {
        const params = new URLSearchParams(searchParams);
        params.set('showTable', 'true');
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between p-4">
            <span className="text-2xl font-semibold">Dự đoán các loại sản phẩm bán chạy</span>
            <button
                onClick={handlePredict}
                className="bg-primary-500 hover:bg-primary-600 cursor-pointer rounded px-4 py-2 text-white transition"
            >
                Dự đoán
            </button>

            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Chọn loại thời gian:</label>
                    <select
                        className="rounded border px-2 py-1"
                        value={timeType}
                        onChange={(e) => handleTimeTypeChange(e.target.value)}
                    >
                        <option>Tháng</option>
                        <option>Quý</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Chọn {timeType.toLowerCase()}:</label>
                    <select
                        className="rounded border px-2 py-1"
                        value={selectedTime}
                        onChange={(e) => handleTimeChange(e.target.value)}
                    >
                        {timeType === 'Tháng'
                            ? Array.from({ length: 12 }, (_, i) => (
                                  <option key={i} value={`Tháng ${i + 1}`}>{`Tháng ${i + 1}`}</option>
                              ))
                            : Array.from({ length: 4 }, (_, i) => (
                                  <option key={i} value={`Quý ${i + 1}`}>{`Quý ${i + 1}`}</option>
                              ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Chọn năm:</label>
                    <select
                        className="rounded border px-2 py-1"
                        value={selectedYear}
                        onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
                    >
                        <option value={2019}>2019</option>
                        <option value={2020}>2020</option>
                        <option value={2021}>2021</option>
                        <option value={2022}>2022</option>
                        <option value={2023}>2023</option>
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                    </select>
                </div>

                <div className="flex items-end gap-2">
                    <button
                        onClick={handleRefresh}
                        className="bg-primary-500 hover:bg-primary-600 rounded px-3 py-2 text-white transition-colors"
                    >
                        <Icon icon="material-symbols:refresh" className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
