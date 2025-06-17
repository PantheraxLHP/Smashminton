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
                    <h2 className="w-full text-center text-lg">Doanh thu các khu vực sân (Zone) trong năm {year}</h2>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(chartConfig).map(([key, config]) => (
                            <Button
                                key={key}
                                variant={visibleZones[key] ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleActiveZoneClick({ dataKey: key })}
                                className={`border-2 text-xs font-medium transition-all duration-200 hover:scale-105 ${visibleZones[key] ? '' : 'bg-white'}`}
                                style={{
                                    backgroundColor: visibleZones[key] ? config.color : 'white',
                                    borderColor: config.color,
                                    color: visibleZones[key] ? 'white' : config.color,
                                    boxShadow: visibleZones[key] ? `0 2px 4px ${config.color}30` : 'none',
                                }}
                            >
                                {config.label}
                            </Button>
                        ))}
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
                            <CartesianGrid strokeDasharray={'3 3'} stroke="var(--color-gray-300)" vertical={false} />
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
                                .map(([key, value]) => (
                                    <Area
                                        key={key}
                                        dataKey={key}
                                        type="monotone"
                                        fill={value.color}
                                        fillOpacity={0.7}
                                        stroke={value.color}
                                        stackId="1"
                                    />
                                ))}
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default ZoneRevenueChart;
