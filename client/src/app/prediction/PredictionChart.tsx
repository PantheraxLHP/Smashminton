import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PredictionChartProps {
    data: { id: string; name: string; quantity: number }[];
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
}

const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171", "#A78BFA", "#F472B6", "#10B981"];

const PredictionChart: React.FC<PredictionChartProps> = ({ data, sortOrder, onSortOrderChange }) => {
    const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0);
    const chartData = data.map((item) => ({
        ...item,
        percent: totalQuantity === 0 ? 0 : (item.quantity / totalQuantity) * 100,
    }));

    const renderCustomizedLabel = (props: any) => {
        const { name, percent } = props;
        return `${name}: ${percent.toFixed(2)}%`;
    };

    return (
        <div className="border rounded p-4 shadow bg-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Tỉ lệ phần trăm sản phẩm được bán ra</h2>
                <div className="flex items-center gap-2">
                    <label className="text-sm">Sắp xếp:</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
                        className="border pl-2 pr-2 pt-1 pb-1 rounded"
                    >
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="percent"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#34D399"
                        label={renderCustomizedLabel} // label của Pie được chỉnh lại ở đây
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PredictionChart;
