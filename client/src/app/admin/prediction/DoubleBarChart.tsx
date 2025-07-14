'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';

interface DoubleBarChartProps {
    data: {
        name: string;
        sales: number;
        purchase: number;
    }[];
    selectedTime: string;
    selectedYear: number;
}

const chartConfig: ChartConfig = {
    sales: {
        label: 'Bán ra',
        color: '#4f46e5',
    },
    purchase: {
        label: 'Mua vào',
        color: '#10b981',
    },
};

const DoubleBarChart: React.FC<DoubleBarChartProps> = ({ data, selectedTime, selectedYear }) => {
    const safeData = data.map((item, index) => ({
        ...item,
        name: item.name && item.name !== '' ? item.name : `Sản phẩm ${index + 1}`,
    }));

    return (
        <div className="flex h-full flex-col">
            <h2 className="mb-4 text-lg font-semibold">
                So sánh số lượng <span className="text-[#10b981]">mua vào</span> và{' '}
                <span className="text-[#4f46e5]">bán ra </span> của từng loại sản phẩm trong{' '}
                <span className="text-primary-500">
                    {selectedTime.toLowerCase()} năm {selectedYear}
                </span>
            </h2>
            <div className="flex-1 overflow-hidden">
                <ChartContainer config={chartConfig} className="h-full min-w-full">
                    <BarChart
                        data={safeData}
                        margin={{ top: 30, right: 30, left: 30, bottom: 10 }}
                        barCategoryGap="80%"
                        barGap={0}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    hideIndicator
                                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#6B7280' }}
                                />
                            }
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="sales" name="Bán ra" fill="#4f46e5" barSize={40}>
                            <LabelList dataKey="sales" position="top" />
                        </Bar>
                        <Bar dataKey="purchase" name="Mua vào" fill="#10b981" barSize={40}>
                            <LabelList dataKey="purchase" position="top" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
    );
};

export default DoubleBarChart;
