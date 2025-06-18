'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useState } from 'react';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';

export interface ZoneRevenueChartProps {
    className?: string;
    chartData: any[];
    chartConfig: ChartConfig;
    chartWidth?: string;
    chartHeight?: string;
    year: number;
}

const ZoneRevenueChart: React.FC<ZoneRevenueChartProps> = ({
    className,
    chartData,
    chartConfig,
    chartWidth = '100%',
    chartHeight = '400px',
    year,
}) => {
    const [visibleZones, setVisibleZones] = useState<Record<string, boolean>>(
        Object.keys(chartConfig).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
    );

    // Convert CSS variables to actual colors since CSS vars don't work well with Recharts SVG
    const getActualColor = (cssVar: string): string => {
        const colorMap: { [key: string]: string } = {
            'var(--color-chart-31)': '#059669', // oklch(0.64 0.33 145) ≈ emerald-600
            'var(--color-chart-32)': '#D97706', // oklch(0.65 0.35 30) ≈ amber-600
            'var(--color-chart-33)': '#DC2626', // oklch(0.65 0.35 60) ≈ red-600
            'var(--color-chart-34)': '#CA8A04', // oklch(0.60 0.30 10) ≈ yellow-600
            'var(--color-chart-35)': '#2563EB', // oklch(0.65 0.35 210) ≈ blue-600
            'var(--color-chart-36)': '#7C3AED', // oklch(0.60 0.35 275) ≈ violet-600
            'var(--color-chart-37)': '#EC4899', // oklch(0.65 0.30 320) ≈ pink-600
        };
        return colorMap[cssVar] || cssVar; // fallback to original if not found
    };

    const handleActiveZoneClick = (data: any) => {
        const dataKey = data.dataKey;
        setVisibleZones((prev) => ({
            ...prev,
            [dataKey]: !prev[dataKey],
        }));
    };

    return (
        <div
            className={`flex flex-col rounded-xl border bg-white p-6 shadow-lg ${className || ''}`}
            style={{ width: `${chartWidth}`, height: `${chartHeight}` }}
        >
            <div className="flex h-full w-full flex-col gap-4">
                {/* Header Section */}
                <div className="flex flex-col gap-3">
                    <h2 className="w-full text-center text-lg font-semibold">
                        Doanh thu các khu vực sân (Zone) trong năm {year}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(chartConfig).map(([key, config]) => {
                            const actualColor = getActualColor(config.color || '');
                            return (
                                <Button
                                    key={key}
                                    variant={visibleZones[key] ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleActiveZoneClick({ dataKey: key })}
                                    className={`border-2 text-xs font-medium transition-all duration-200 hover:scale-105 ${visibleZones[key] ? '' : 'bg-white'}`}
                                    style={{
                                        backgroundColor: visibleZones[key] ? actualColor : 'white',
                                        borderColor: actualColor,
                                        color: visibleZones[key] ? 'white' : actualColor,
                                        boxShadow: visibleZones[key] ? `0 2px 4px ${actualColor}30` : 'none',
                                    }}
                                >
                                    {config.label}
                                </Button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ChartContainer config={chartConfig} className="h-full min-w-full">
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                right: 30,
                                left: 20,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid strokeDasharray={'3 3'} stroke="#E5E7EB" vertical={false} />
                            <XAxis
                                type="category"
                                dataKey="month"
                                tickMargin={30}
                                tickFormatter={(value) => `Tháng ${value}`}
                                angle={-45}
                            />
                            <YAxis
                                type="number"
                                tickMargin={10}
                                width={80}
                                label={{
                                    value: 'Doanh thu (triệu đồng)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle' },
                                }}
                            />
                            <ChartTooltip content={<ChartTooltipContent indicator="line" hideLabel />} />
                            <ChartLegend content={<ChartLegendContent className="mt-6" />} />
                            {Object.entries(chartConfig)
                                .filter(([key]) => visibleZones[key])
                                .map(([key, value]) => {
                                    const actualColor = getActualColor(value.color || '');
                                    return (
                                        <Area
                                            key={key}
                                            dataKey={key}
                                            type="monotone"
                                            fill={actualColor}
                                            fillOpacity={0.7}
                                            stroke={actualColor}
                                            stackId="1"
                                        />
                                    );
                                })}
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default ZoneRevenueChart;
