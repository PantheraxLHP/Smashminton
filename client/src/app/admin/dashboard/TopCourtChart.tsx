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
    // Convert CSS variables to actual colors since CSS vars don't work well with Recharts SVG
    const getActualColor = (cssVar: string, index: number): string => {
        // Map CSS variables to actual hex colors from your globals.css
        const colorMap: { [key: string]: string } = {
            'var(--color-chart-11)': '#10B981', // oklch(0.704 0.33 144.69) ≈ emerald
            'var(--color-chart-12)': '#0891B2', // oklch(0.682 0.32 130) ≈ cyan
            'var(--color-chart-13)': '#2563EB', // oklch(0.66 0.31 110) ≈ blue
            'var(--color-chart-14)': '#CA8A04', // oklch(0.72 0.29 90) ≈ yellow
            'var(--color-chart-15)': '#EA580C', // oklch(0.76 0.26 70) ≈ orange
            'var(--color-chart-16)': '#DC2626', // oklch(0.72 0.27 50) ≈ red
            'var(--color-chart-17)': '#A16207', // oklch(0.65 0.3 35) ≈ amber
            'var(--color-chart-31)': '#059669', // oklch(0.64 0.33 145) ≈ emerald-600
            'var(--color-chart-32)': '#D97706', // oklch(0.65 0.35 30) ≈ amber-600
            'var(--color-chart-35)': '#2563EB', // oklch(0.65 0.35 210) ≈ blue-600
        };

        return colorMap[cssVar] || '#6B7280'; // fallback to gray
    };

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
                            <Bar dataKey="bookingCount" radius={5}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getActualColor(entry.fill, index)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default TopCourtChart;
