'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

interface PredictionTableControlsProps {
    timeType: string;
    selectedTime: string;
    onTimeTypeChange?: (type: string) => void;
    onTimeChange?: (time: string) => void;
    onPredict?: () => void;
}

export function PredictionTableControls({
    timeType,
    selectedTime,
    onTimeTypeChange,
    onTimeChange,
    onPredict,
}: PredictionTableControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleTimeTypeChange = (type: string) => {
        if (onTimeTypeChange) {
            onTimeTypeChange(type);
        } else {
            const params = new URLSearchParams(searchParams);
            params.set('timeType', type);
            // Reset selectedTime when changing type
            if (type === 'Tháng') {
                params.set('selectedTime', 'Tháng 1');
            } else {
                params.set('selectedTime', 'Quý 1');
            }
            router.push(`?${params.toString()}`);
        }
    };

    const handleTimeChange = (time: string) => {
        if (onTimeChange) {
            onTimeChange(time);
        } else {
            const params = new URLSearchParams(searchParams);
            params.set('selectedTime', time);
            router.push(`?${params.toString()}`);
        }
    };

    const handlePredict = () => {
        if (onPredict) {
            onPredict();
        } else {
            const params = new URLSearchParams(searchParams);
            params.set('showTable', 'true');
            router.push(`?${params.toString()}`);
        }
    };

    return (
        <div className="flex flex-col justify-end gap-4 rounded-lg bg-white p-4">
            <div className="flex items-center justify-center">
                <span className="bg-white text-2xl font-semibold">
                    Dự đoán các loại sản phẩm bán chạy theo tháng/quý
                </span>
            </div>

            <div className="mt-4 flex items-center gap-4">
                <span>Chọn thời gian dự đoán</span>
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

                <Button onClick={handlePredict}>Dự đoán</Button>
            </div>
        </div>
    );
}

interface PredictionChartControlsProps {
    timeType: string;
    selectedTime: string;
    selectedYear: number;
    onTimeTypeChange?: (type: string) => void;
    onTimeChange?: (time: string) => void;
    onYearChange?: (year: number) => void;
}

export function PredictionChartControls({
    timeType,
    selectedTime,
    selectedYear,
    onTimeTypeChange,
    onTimeChange,
    onYearChange,
}: PredictionChartControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleYearChange = (year: number) => {
        if (onYearChange) {
            onYearChange(year);
        } else {
            const params = new URLSearchParams(searchParams);
            params.set('year', year.toString());
            router.push(`?${params.toString()}`);
        }
    };

    const handleTimeTypeChange = (type: string) => {
        if (onTimeTypeChange) {
            onTimeTypeChange(type);
        } else {
            const params = new URLSearchParams(searchParams);
            params.set('timeType', type);
            // Reset selectedTime when changing type
            if (type === 'Tháng') {
                params.set('selectedTime', 'Tháng 1');
            } else {
                params.set('selectedTime', 'Quý 1');
            }
            router.push(`?${params.toString()}`);
        }
    };

    const handleTimeChange = (time: string) => {
        if (onTimeChange) {
            onTimeChange(time);
        } else {
            const params = new URLSearchParams(searchParams);
            params.set('selectedTime', time);
            router.push(`?${params.toString()}`);
        }
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-gray-200">
            <div className="flex items-center gap-4 rounded-lg bg-white p-4">
                <span>Tuỳ chỉnh thời gian của biểu đồ</span>
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
            </div>
        </div>
    );
}
