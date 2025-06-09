import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from "recharts";

interface DoubleBarChartProps {
    data: {
        name: string;
        sales: number;
        purchase: number;
    }[];
}

const DoubleBarChart: React.FC<DoubleBarChartProps> = ({ data }) => {
    return (
        <div className="border rounded p-4 shadow bg-white">
            <h2 className="text-lg font-semibold mb-4">So sánh số lượng mua vào và bán ra</h2>
            <div className="w-1/2 mx-auto" style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 30, right: 30, left: 0, bottom: 5 }}
                        barCategoryGap="80%"
                        barGap={30}
                    >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" name="Bán ra" fill="#4f46e5" barSize={40}>
                            <LabelList dataKey="sales" position="top" />
                        </Bar>
                        <Bar dataKey="purchase" name="Mua vào" fill="#10b981" barSize={40}>
                            <LabelList dataKey="purchase" position="top" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DoubleBarChart;
