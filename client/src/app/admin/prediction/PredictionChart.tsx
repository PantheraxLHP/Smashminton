import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface PredictionChartProps {
    data: { id: string; name: string; quantity: number }[];
    sortOrder: "asc" | "desc";
    onSortOrderChange: (order: "asc" | "desc") => void;
    title?: string;
}

const COLOR_MAP = new Map<string, string>();
const COLORS = [
    "#34D399", "#60A5FA", "#FBBF24", "#F87171",
    "#A78BFA", "#F472B6", "#10B981", "#FDBA74",
];

let colorIndex = 0;
function getColorForId(id: string): string {
    if (!COLOR_MAP.has(id)) {
        COLOR_MAP.set(id, COLORS[colorIndex % COLORS.length]);
        colorIndex++;
    }
    return COLOR_MAP.get(id)!;
}

const PredictionChart: React.FC<PredictionChartProps> = ({
    data,
    sortOrder,
    onSortOrderChange,
    title = "Tỉ lệ phần trăm sản phẩm bán ra",
}) => {
    const totalQuantity = data.reduce((acc, item) => acc + item.quantity, 0);

    const chartData = data.map((item) => ({
        ...item,
        percent: totalQuantity === 0 ? 0 : (item.quantity / totalQuantity) * 100,
    }));

    const renderCustomizedLabel = ({ name, percent }: any) => {
        if (percent < 0.5) return ""; // tránh hiển thị label quá nhỏ
        return `${name}: ${percent.toFixed(1)}%`;
    };

    return (
        <div className="border rounded p-4 shadow bg-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                {/* Nếu muốn bật lại chức năng sắp xếp */}
                {/* <div className="flex items-center gap-2">
                    <label className="text-sm">Sắp xếp:</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
                        className="border pl-2 pr-2 pt-1 pb-1 rounded"
                    >
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div> */}
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
                        label={renderCustomizedLabel}
                    >
                        {chartData.map((entry) => (
                            <Cell key={`cell-${entry.id}`} fill={getColorForId(entry.id)} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PredictionChart;
