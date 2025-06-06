import { Pie, PieChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export interface CustomPieChartProps {
    className?: string;
    chartData: any[];
    chartConfig: ChartConfig;
    chartWidth?: string;
    chartHeight?: string;
    chartTitle?: string;
    mainDataKey: string;
    nameKey: string;
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({
    className,
    chartData,
    chartConfig,
    chartWidth = "100%",
    chartHeight = "400px",
    chartTitle,
    mainDataKey,
    nameKey,
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
                    <ChartContainer config={chartConfig} className="min-w-full h-full aspect-square">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                startAngle={90}
                                endAngle={450}
                                data={chartData}
                                dataKey={mainDataKey}
                                label
                                nameKey={nameKey}
                            />
                        </PieChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default CustomPieChart;