import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useState } from "react"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button";

export interface ZoneRevenueChartProps {
    className?: string;
    chartData: any[];
    chartConfig: ChartConfig;
    chartWidth?: string;
    chartHeight?: string;
}

const ZoneRevenueChart: React.FC<ZoneRevenueChartProps> = ({
    className,
    chartData,
    chartConfig,
    chartWidth = "100%",
    chartHeight = "400px",
}) => {
    const [visibleZones, setVisibleZones] = useState<Record<string, boolean>>(
        Object.keys(chartConfig).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    const handleActiveZoneClick = (data: any) => {
        const dataKey = data.dataKey;
        setVisibleZones(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey]
        }));
    };

    return (
        <div
            className={`flex flex-col border-2 rounded-lg p-3 bg-white ${className || ''}`}
            style={{ width: `${chartWidth}`, height: `${chartHeight}` }}
        >
            <div className="flex flex-col w-full h-full gap-2">
                <div className="flex gap-2 flex-wrap">
                    {Object.entries(chartConfig).map(([key, config]) => (
                        <Button
                            key={key}
                            variant={visibleZones[key] ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleActiveZoneClick({ dataKey: key })}
                            className="text-xs"
                            style={{
                                backgroundColor: visibleZones[key] ? config.color : 'transparent',
                                borderColor: config.color,
                                color: visibleZones[key] ? 'white' : config.color,
                            }}
                        >
                            {config.label}
                        </Button>
                    ))}
                </div>
                <span className="text-lg text-center w-full">
                    Doanh thu của các khu vực sân (Zone) qua từng tháng
                </span>
                <div className="flex-1 overflow-hidden">
                    <ChartContainer config={chartConfig} className="min-w-full h-full">
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                right: 30,
                                left: 20,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray={"3 3"}
                                stroke="var(--color-gray-300)"
                                vertical={false}
                            />
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
                                label={{
                                    value: "Doanh thu (triệu đồng)",
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle' },
                                    offset: 10
                                }}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent
                                    indicator="line"
                                    hideLabel
                                />}
                                
                            />                            
                            <ChartLegend
                                content={<ChartLegendContent
                                    className="mt-6"
                                />}
                            />
                            <defs>
                                {Object.entries(chartConfig).map(([key, value]) => (
                                    <linearGradient
                                        key={key}
                                        id={`fill${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={`${value.color}`}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={`${value.color}`}
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                ))}
                            </defs>                            
                            {Object.entries(chartConfig)
                                .filter(([key]) => visibleZones[key])
                                .map(([key, value]) => (
                                <Area
                                    key={key}
                                    dataKey={key}
                                        type="monotone"
                                    fill={`url(#fill${key.charAt(0).toUpperCase() + key.slice(1)})`}
                                        fillOpacity={0.5}
                                    stroke={`${value.color}`}
                                    stackId="a"
                                />
                            ))}
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
}

export default ZoneRevenueChart;