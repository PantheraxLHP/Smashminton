'use client';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import React from 'react';
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';

interface PredictionChartProps {
    data: { id: string; name: string; quantity: number }[];
    sortOrder: 'asc' | 'desc';
    title?: string;
}

interface ChartDataItem {
    id: string;
    name: string;
    quantity: number;
    percent: number;
    fill: string;
}

const COLORS = [
    'hsl(220, 70%, 50%)', // Blue
    'hsl(142, 69%, 45%)', // Green
    'hsl(12, 76%, 61%)', // Red-orange
    'hsl(43, 74%, 66%)', // Yellow
    'hsl(262, 83%, 58%)', // Purple
    'hsl(173, 58%, 39%)', // Teal
    'hsl(27, 87%, 67%)', // Orange
];

const PredictionChart: React.FC<PredictionChartProps> = ({ data, title = 'Tỉ lệ phần trăm sản phẩm bán ra' }) => {
    const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0);

    // Sort data by quantity in descending order
    const sortedData = [...data].sort((a, b) => b.quantity - a.quantity);

    // Limit to 6 pieces for main pie, merge rest into 'Other'
    let mainPieData: ChartDataItem[] = [];
    let stackedBarData: ChartDataItem[] = [];

    if (sortedData.length > 6) {
        const topFive = sortedData.slice(0, 5);
        const otherItems = sortedData.slice(5);
        const otherQuantity = otherItems.reduce((acc, item) => acc + item.quantity, 0);

        mainPieData = [
            ...topFive.map((item, index) => ({
                ...item,
                id: item.id && item.id !== '' ? item.id : `item-${index}`,
                name: item.name && item.name !== '' ? item.name : `Sản phẩm ${index + 1}`,
                percent: totalQuantity === 0 ? 0 : (item.quantity / totalQuantity) * 100,
                fill: COLORS[index % COLORS.length],
            })),
            {
                id: 'other',
                name: 'Các loại khác',
                quantity: otherQuantity,
                percent: totalQuantity === 0 ? 0 : (otherQuantity / totalQuantity) * 100,
                fill: COLORS[5 % COLORS.length],
            },
        ];

        // Stacked bar data shows breakdown of "Other" category only
        stackedBarData = otherItems.map((item, index) => ({
            ...item,
            id: item.id && item.id !== '' ? item.id : `other-item-${index}`,
            name: item.name && item.name !== '' ? item.name : `Sản phẩm ${index + 6}`,
            percent: otherQuantity === 0 ? 0 : (item.quantity / otherQuantity) * 100,
            fill: COLORS[5 % COLORS.length], // Same color as "Other" slice
        }));
    } else {
        mainPieData = sortedData.map((item, index) => ({
            ...item,
            id: item.id && item.id !== '' ? item.id : `item-${index}`,
            name: item.name && item.name !== '' ? item.name : `Sản phẩm ${index + 1}`,
            percent: totalQuantity === 0 ? 0 : (item.quantity / totalQuantity) * 100,
            fill: COLORS[index % COLORS.length],
        }));
    }

    // Create chart config for the pie data
    const pieChartConfig: ChartConfig = {};
    mainPieData.forEach((item, index) => {
        pieChartConfig[item.id] = {
            label: item.name,
            color: COLORS[index % COLORS.length],
        };
    });

    // Create chart config for the stacked bar data
    const stackedBarConfig: ChartConfig = {};
    stackedBarData.forEach((item, index) => {
        stackedBarConfig[item.id] = {
            label: item.name,
            color: COLORS[5 % COLORS.length], // Same color as "Other" slice
        };
    });

    return (
        <div className="flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>

            <div className="relative flex flex-1 items-center justify-center gap-8 overflow-hidden">
                {/* Main Pie Chart */}
                <div className="relative flex-shrink-0" style={{ width: '400px', height: '300px' }}>
                    <ChartContainer config={pieChartConfig} className="h-full w-full">
                        <PieChart>
                            <Pie
                                data={mainPieData}
                                dataKey="percent"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                startAngle={90}
                                endAngle={480}
                            >
                                {mainPieData.map((item) => (
                                    <Cell key={`cell-${item.id}`} fill={item.fill} />
                                ))}
                            </Pie>
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        hideIndicator
                                        labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#6B7280' }}
                                    />
                                }
                            />
                        </PieChart>
                    </ChartContainer>
                </div>

                {/* Stacked Bar Chart with Better UI */}
                {stackedBarData.length > 0 && (
                    <div className="relative flex flex-col items-center">
                        {/* Title */}
                        <div className="mb-2 text-center">
                            <div className="mb-1 text-sm font-semibold text-gray-700 flex items-center gap-1">
                                <span
                                    className="w-4 h-4 rounded-lg"
                                    style={{
                                        backgroundColor: 'hsl(173, 58%, 39%)',
                                    }}
                                >
                                </span>
                                Chi tiết &ldquo;Các loại khác&rdquo;
                            </div>
                            <p className="text-xs text-gray-500">{stackedBarData.length} sản phẩm</p>
                        </div>

                        {/* Chart and Labels Container */}
                        <div className="flex flex-col gap-1 w-full">
                            {stackedBarData.map((item, index) => {
                                return (
                                    <div
                                        key={item.id}
                                        className="h-6 rounded-sm flex items-center justify-between px-3 shadow-sm bg-gray-100 w-full gap-2"
                                    >   
                                        <span className="text-xs font-medium truncate flex-1">
                                            {item.name}
                                        </span>
                                        <span className="text-xs ml-2">
                                            {item.percent.toFixed(2)}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="mt-4">
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {mainPieData.map((item) => (
                        <div key={item.id} className="flex items-center gap-1.5">
                            <div className="h-3 w-3 shrink-0 rounded-lg" style={{ backgroundColor: item.fill }} />
                            <span className="text-xs">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PredictionChart;
