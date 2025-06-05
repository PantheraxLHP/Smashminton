import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export interface ChartDataProps {
    chartData: any[];
}

const chartConfig: ChartConfig = {
    bookingCount: {
        label: "Số lần đặt",
        color: "hsl(var(--primary))", // Use your primary color
    },
};

const HorizontalBarChart: React.FC<ChartDataProps> = ({
    chartData,
}) => {
    // Calculate proper height based on data length
    const chartHeight = Math.max(200, chartData.length * 60); // 60px per bar minimum
    const containerHeight = Math.min(chartHeight + 80, 400); // Add padding, max 400px

    return (
        <div className="flex flex-col border-2 rounded-lg p-3 bg-white w-100 h-50" >
            <div className="flex flex-col w-full h-full gap-2">
                <h3 className="text-lg font-semibold text-center w-full flex justify-center">Top sân theo số lần đặt</h3>
                <div className="flex-1 overflow-hidden">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="vertical"
                            width={undefined}
                            height={undefined}
                            margin={{
                                left: -10,
                            }}
                        >
                            <XAxis
                                type="number"
                                dataKey="bookingCount"
                                hide={false}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                dataKey="courtName"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                width={60}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent
                                    hideLabel
                                    formatter={(value, name) => [
                                        `${value} lượt đặt`,
                                        "Số lần đặt"
                                    ]}
                                />}
                            />
                            <Bar
                                dataKey="bookingCount"
                                fill="var(--color-primary)"
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
}

export default HorizontalBarChart;