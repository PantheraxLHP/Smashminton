'use client';

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

export interface NumberOfProductAndRentalChartProps {
    className?: string;
    chartData: any[];
    chartConfig: ChartConfig;
    chartWidth?: string;
    chartHeight?: string;
    year: number;
}

const NumberOfProductAndRentalChart: React.FC<NumberOfProductAndRentalChartProps> = ({
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
                    Tổng số sản phẩm được bán và tổng số lượt cho thuê từng tháng trong năm {year}
                </span>
                <div className="flex-1 overflow-hidden">
                    <ChartContainer config={chartConfig} className="h-full min-w-full">
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            layout="horizontal"
                            width={undefined}
                            height={undefined}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 10,
                                bottom: 10,
                            }}
                        >
                            <XAxis
                                type="category"
                                dataKey="month"
                                tickMargin={30}
                                tickFormatter={(value) => `Tháng ${value}`}
                                angle={-45}
                            />
                            <YAxis type="number" tickMargin={10} tickLine={false} />
                            <ChartTooltip content={<ChartTooltipContent indicator="line" hideLabel />} />
                            <ChartLegend content={<ChartLegendContent className="mt-6" />} />
                            <CartesianGrid strokeDasharray={'3 3'} stroke="var(--color-gray-300)" vertical={false} />
                            {Object.entries(chartConfig).map(([key, config]) => (
                                <Line
                                    key={key}
                                    type="monotone"
                                    strokeWidth={2}
                                    stroke={config.color}
                                    dataKey={key}
                                    activeDot={{
                                        r: 6,
                                    }}
                                />
                            ))}
                        </LineChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default NumberOfProductAndRentalChart;
