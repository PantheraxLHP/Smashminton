'use client';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export interface TopRentalChartProps {
    className?: string;
    chartData: any[];
    chartConfig: ChartConfig;
    chartWidth?: string;
    chartHeight?: string;
    year: number;
}

const TopRentalChart: React.FC<TopRentalChartProps> = ({
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
                    Top 10 sản phẩm được thuê trong năm {year}
                </span>
                <div className="flex-1 overflow-hidden">
                    <ChartContainer config={chartConfig} className="h-full min-w-full">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            margin={{
                                right: 20,
                                bottom: 10,
                                left: 50,
                            }}
                        >
                            <CartesianGrid strokeDasharray={'3 3'} stroke="var(--color-gray-300)" horizontal={false} />
                            <XAxis
                                type="number"
                                dataKey="rentalCount"
                                tickMargin={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="rentalName"
                                tickMargin={30}
                                tickLine={false}
                                axisLine={false}
                                width={200}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        hideIndicator
                                        labelStyle={{ color: 'black', fontWeight: 'bold' }}
                                        itemStyle={{ color: '#2563eb' }}
                                    />
                                }
                            />
                            <Bar dataKey="rentalCount" radius={5} fill="#3b82f6" />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default TopRentalChart;
