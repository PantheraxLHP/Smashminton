'use client';

import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';

interface PredictionChartProps {
    data: { id: string; name: string; quantity: number }[];
    sortOrder: 'asc' | 'desc';
    title?: string;
}

const COLORS = [
    '#10B981', // emerald
    '#0891B2', // cyan
    '#2563EB', // blue
    '#CA8A04', // yellow
    '#EA580C', // orange
    '#DC2626', // red
    '#A16207', // amber
    '#059669', // emerald-600
];

const PredictionChart: React.FC<PredictionChartProps> = ({
    data,
    sortOrder,
    title = 'Tỉ lệ phần trăm sản phẩm bán ra',
}) => {
    const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0);

    const chartData = data.map((item, index) => ({
        ...item,
        id: item.id && item.id !== '' ? item.id : `item-${index}`,
        name: item.name && item.name !== '' ? item.name : `Sản phẩm ${index + 1}`,
        percent: totalQuantity === 0 ? 0 : (item.quantity / totalQuantity) * 100,
        fill: COLORS[index % COLORS.length],
    }));

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
                        <Pie data={chartData} dataKey="percent" nameKey="name" cx="50%" cy="50%" outerRadius={150}>
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
                                                className="h-4 w-4 shrink-0 rounded-[2px]"
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
