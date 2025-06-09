import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface ZoneRevenueChartProps {
    className?: string;
    chartData: any[];
    chartConfig: ChartConfig;
    chartWidth?: string;
    chartHeight?: string;
    zoneList?: { zoneLabel: string, zoneValue: string }[];
    onZoneChange?: (zone: string) => void;
}

const ZoneRevenueChart: React.FC<ZoneRevenueChartProps> = ({
    className,
    chartData,
    chartConfig,
    chartWidth = "100%",
    chartHeight = "400px",
    zoneList = [
        { zoneLabel: "Khu vực A", zoneValue: "zoneA" },
        { zoneLabel: "Khu vực B", zoneValue: "zoneB" },
        { zoneLabel: "Khu vực C", zoneValue: "zoneC" },
    ],
    onZoneChange = ((zone: string) => {
        alert(`Selected zone: ${zone}`);
        console.log(`Selected zone: ${zone}`);
    }),
}) => {
    return (
        <div
            className={`flex flex-col border-2 rounded-lg p-3 bg-white ${className || ''}`}
            style={{ width: `${chartWidth}`, height: `${chartHeight}` }}
        >
            <div className="flex flex-col w-full h-full gap-2">
                <div className="flex justify-end items-center w-full">
                    <Select defaultValue="all" onValueChange={(value) => alert(value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Chọn khu vực" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả khu vực</SelectItem>
                            {zoneList?.map((zone) => (
                                <SelectItem
                                    key={zone.zoneValue}
                                    value={zone.zoneValue}
                                    onClick={() => onZoneChange(zone.zoneValue)}
                                >
                                    {zone.zoneLabel}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <span className="text-lg text-center w-full">
                    Doanh thu của các khu vực sân qua từng tháng
                </span>
                <div className="flex-1 overflow-hidden">
                    <ChartContainer config={chartConfig} className="min-w-full h-full">
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                right: 30,
                                left: 20,
                                bottom: 30,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray={"3 3"}
                                vertical={false}
                                stroke="var(--color-primary-200)"
                            />
                            <XAxis
                                dataKey="month"
                                tickMargin={30}
                                tickFormatter={(value) => `Tháng ${value}`}
                                angle={-45}
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
                            {Object.entries(chartConfig).map(([key, value]) => (
                                <Area
                                    key={key}
                                    dataKey={key}
                                    type="natural"
                                    fill={`url(#fill${key.charAt(0).toUpperCase() + key.slice(1)})`}
                                    fillOpacity={0.4}
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