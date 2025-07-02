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
                        <div className="mb-4 text-center">
                            <h3 className="mb-1 text-sm font-semibold text-gray-700">
                                Chi tiết &ldquo;Các loại khác&rdquo;
                            </h3>
                            <p className="text-xs text-gray-500">{stackedBarData.length} sản phẩm</p>
                        </div>

                        {/* Chart and Labels Container */}
                        <div className="flex items-center gap-4">
                            {/* Stacked Bar */}
                            <div className="relative" style={{ width: '60px', height: '250px' }}>
                                <ChartContainer config={stackedBarConfig} className="h-full w-full">
                                    <BarChart
                                        data={[
                                            {
                                                category: 'breakdown',
                                                ...Object.fromEntries(
                                                    stackedBarData.map((item) => [item.id, item.percent]),
                                                ),
                                            },
                                        ]}
                                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                    >
                                        <YAxis hide />
                                        <XAxis hide />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    hideIndicator
                                                    hideLabel
                                                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                                                    itemStyle={{ color: '#6B7280' }}
                                                    formatter={(value, name) => {
                                                        const item = stackedBarData.find((d) => d.id === name);
                                                        return [`${Number(value).toFixed(1)}%`, item?.name || name];
                                                    }}
                                                />
                                            }
                                        />
                                        {stackedBarData.map((item, index) => {
                                            // Use distinct colors for each segment
                                            const segmentColor = COLORS[(index + 6) % COLORS.length]; // Start from index 6 to avoid main pie colors
                                            return (
                                                <Bar
                                                    key={item.id}
                                                    dataKey={item.id}
                                                    stackId="breakdown"
                                                    fill={segmentColor}
                                                    stroke="#ffffff"
                                                    strokeWidth={2}
                                                    radius={
                                                        index === 0
                                                            ? [0, 0, 6, 6]
                                                            : index === stackedBarData.length - 1
                                                              ? [6, 6, 0, 0]
                                                              : [0, 0, 0, 0]
                                                    }
                                                />
                                            );
                                        })}
                                    </BarChart>
                                </ChartContainer>
                            </div>

                            {/* Enhanced Labels */}
                            <div className="flex flex-col gap-2">
                                {stackedBarData
                                    .slice()
                                    .reverse()
                                    .map((item, index) => {
                                        // Reverse the index calculation to match the reversed array
                                        const originalIndex = stackedBarData.length - 1 - index;
                                        const segmentColor = COLORS[(originalIndex + 6) % COLORS.length]; // Same color logic as the bars
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3 rounded-md bg-gray-50 p-2 transition-colors hover:bg-gray-100"
                                            >
                                                <div
                                                    className="h-4 w-4 rounded-sm border border-white shadow-sm"
                                                    style={{
                                                        backgroundColor: segmentColor,
                                                    }}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm leading-tight font-medium text-gray-700">
                                                        {item.name}: {item.percent.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
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
