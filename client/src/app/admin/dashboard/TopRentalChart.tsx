'use client';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export interface TopRentalChartProps {
    className?: string;
    chartData: any[];
    chartConfig: ChartConfig;
    chartWidth?: string;
    chartHeight?: string;
}

const TopRentalChart: React.FC<TopRentalChartProps> = ({
    className,
    chartData,
    chartConfig,
    chartWidth = '100%',
    chartHeight = '400px',
}) => {
    return (
        <div
            className={`flex flex-col rounded-lg border-2 bg-white p-3 ${className || ''}`}
            style={{ width: `${chartWidth}`, height: `${chartHeight}` }}
        >
            <div className="flex h-full w-full flex-col gap-2">
                <span className="w-full text-center text-lg">Top 10 sản phẩm được thuê</span>
                <div className="flex-1 overflow-hidden">
                    <ChartContainer config={chartConfig} className="h-full min-w-full">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="horizontal"
                            margin={{
                                right: 20,
                                bottom: 100,
                            }}
                        >
                            <CartesianGrid strokeDasharray={'3 3'} stroke="var(--color-gray-300)" vertical={false} />
                            <XAxis
                                type="category"
                                dataKey="rentalName"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                type="number"
                                dataKey="rentalCount"
                                tickMargin={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                            <Bar dataKey="rentalCount" radius={5} />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default TopRentalChart;
