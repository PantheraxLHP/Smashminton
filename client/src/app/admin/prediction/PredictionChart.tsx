'use client';

import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

interface PredictionChartProps {
    data: { id: string; name: string; quantity: number }[];
    sortOrder: 'asc' | 'desc';
    title?: string;
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

    // Limit to 7 pieces, merge rest into 'Other'
    let chartData = [];
    if (sortedData.length > 7) {
        const topSix = sortedData.slice(0, 6);
        const otherItems = sortedData.slice(6);
        const otherQuantity = otherItems.reduce((acc, item) => acc + item.quantity, 0);
        chartData = [
            ...topSix.map((item, index) => ({
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
                fill: COLORS[6 % COLORS.length],
            },
        ];
    } else {
        chartData = sortedData.map((item, index) => ({
            ...item,
            id: item.id && item.id !== '' ? item.id : `item-${index}`,
            name: item.name && item.name !== '' ? item.name : `Sản phẩm ${index + 1}`,
            percent: totalQuantity === 0 ? 0 : (item.quantity / totalQuantity) * 100,
            fill: COLORS[index % COLORS.length],
        }));
    }

    // Create chart config for the data
    const chartConfig: ChartConfig = {};
    chartData.forEach((item, index) => {
        chartConfig[item.id] = {
            label: item.name,
            color: COLORS[index % COLORS.length],
        };
    });

    return (
        <div className="flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>

            <div className="flex-1 overflow-hidden">
                <ChartContainer config={chartConfig} className="h-full min-w-full">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="percent"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            startAngle={90}
                            endAngle={-450}
                        >
                            {chartData.map((item) => (
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
                        <ChartLegend
                            content={() => (
                                <div className="flex items-center justify-center gap-4 pt-3">
                                    {chartData.map((item) => (
                                        <div key={item.id} className="flex items-center gap-1.5">
                                            <div
                                                className="h-4 w-4 shrink-0 rounded-lg"
                                                style={{ backgroundColor: item.fill }}
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                    </PieChart>
                </ChartContainer>
            </div>
        </div>
    );
};

export default PredictionChart;
