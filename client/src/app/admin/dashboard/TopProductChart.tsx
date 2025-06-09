import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export interface TopProductChartProps {
    className?: string;
    chartData: any[];
    chartConfig: ChartConfig;
    chartWidth?: string;
    chartHeight?: string;
}

const TopProductChart: React.FC<TopProductChartProps> = ({
    className,
    chartData,
    chartConfig,
    chartWidth = "100%",
    chartHeight = "400px",
}) => {
    return (
        <div
            className={`flex flex-col border-2 rounded-lg p-3 bg-white ${className || ''}`}
            style={{ width: `${chartWidth}`, height: `${chartHeight}` }}
        >
            <div className="flex flex-col w-full h-full gap-2">
                <span className="text-lg text-center w-full">
                    Top 10 sản phẩm bán chạy
                </span>
                <div className="flex-1 overflow-hidden">
                    <ChartContainer config={chartConfig} className="min-w-full h-full">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="horizontal"
                            margin={{
                                right: 20,
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
                                dataKey="productName"
                                tickMargin={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                type="number"
                                dataKey="saleCount"
                                tickMargin={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent
                                    hideIndicator
                                />}
                            />
                            <Bar
                                dataKey="saleCount"
                                radius={5}
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
}

export default TopProductChart;