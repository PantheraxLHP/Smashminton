import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export interface CustomBarChartProps {
    className?: string;
    chartData: any[];
    chartConfig: ChartConfig;
    chartWidth?: string;
    chartHeight?: string;
    chartTitle?: string;
    layout: "horizontal" | "vertical";
    mainDataKey: string;
    xAxisDataKey: string;
    xAxisDataType: "number" | "category";
    yAxisDataKey: string;
    yAxisDataType: "number" | "category";
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
    className,
    chartData,
    chartConfig,
    chartWidth = "100%",
    chartHeight = "400px",
    layout = "horizontal",
    chartTitle,
    mainDataKey,
    xAxisDataKey,
    xAxisDataType,
    yAxisDataKey,
    yAxisDataType,
}) => {
    return (
        <div
            className={`flex flex-col border-2 rounded-lg p-3 bg-white ${className || ''}`}
            style={{ width: `${chartWidth}`, height: `${chartHeight}` }}
        >
            <div className="flex flex-col w-full h-full gap-2">
                {chartTitle && (
                    <span className="text-lg text-center w-full">
                        {chartTitle}
                    </span>
                )}
                <div className="flex-1 overflow-hidden">
                    <ChartContainer config={chartConfig} className="min-w-full h-full">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout={layout}
                            width={undefined}
                            height={undefined}
                            margin={{
                                left: -10,
                            }}
                        >
                            <XAxis
                                type={xAxisDataType}
                                dataKey={xAxisDataKey}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                type={yAxisDataType}
                                dataKey={yAxisDataKey}
                                tickMargin={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent
                                    
                                />}
                            />
                            {Object.keys(chartConfig).map((key) => (
                                <Bar
                                    dataKey={mainDataKey}
                                    fill={`var(--color-${key})`}
                                    radius={4}
                                /> 
                            ))}
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
}

export default CustomBarChart;