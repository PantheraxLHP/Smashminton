'use client';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export interface TopCourtChartProps {
    className?: string;
    chartData: any[];
    chartConfig: ChartConfig;
    chartWidth?: string;
    chartHeight?: string;
    year: number;
}

const TopCourtChart: React.FC<TopCourtChartProps> = ({
    className,
    chartData,
    chartConfig,
    chartWidth = '100%',
    chartHeight = '400px',
    year,
}) => {
    return (
        <div
            className={`flex flex-col rounded-lg border-2 bg-white p-3 ${className || ''}`}
            style={{ width: `${chartWidth}`, height: `${chartHeight}` }}
        >
            <div className="flex h-full w-full flex-col gap-2">
                <span className="w-full text-center text-lg font-semibold">
                    Top 10 sân được yêu thích trong năm {year}
                </span>
                <div className="flex-1 overflow-hidden">
                    <ChartContainer config={chartConfig} className="h-full min-w-full">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{
                                right: 20,
                                left: 50,
                            }}
                        >
                            <CartesianGrid strokeDasharray={'3 3'} stroke="#E5E7EB" horizontal={false} />
                            <XAxis type="number" dataKey="bookingCount" tickLine={false} axisLine={false} />
                            <YAxis
                                type="category"
                                dataKey="courtName"
                                tickMargin={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        hideIndicator
                                        labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#6B7280' }}
                                    />
                                }
                            />
                            <Bar dataKey="bookingCount" radius={5}></Bar>
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default TopCourtChart;
