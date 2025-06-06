import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export interface SingleLineChartProps {
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

const SingleLineChart: React.FC<SingleLineChartProps> = ({
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
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            layout={layout}
                            width={undefined}
                            height={undefined}
                            margin={{
                                left: -10,
                                right: 20,
                            }}
                        >
                            <XAxis
                                type={xAxisDataType}
                                dataKey={xAxisDataKey}
                                tickLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                type={yAxisDataType}
                                dataKey={yAxisDataKey}
                                tickMargin={10}
                                tickLine={false}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent

                                />}
                            />
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray={"5"}
                                stroke="var(--color-gray-300)"
                            />
                            <Line
                                type="monotone"
                                strokeWidth={2}
                                stroke="var(--color-primary)"
                                dataKey={mainDataKey}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default SingleLineChart;