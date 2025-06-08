"use client";

import React, { useState, useEffect } from "react";
import PredictionChart from "./PredictionChart";
import PredictionTable from "./PredictionTable";

const dummyData = [
    { year: 2024, month: 1, producttypeid: "PT01", producttypename: "Dụng cụ", salesquantity: 75 },
    { year: 2024, month: 2, producttypeid: "PT02", producttypename: "Đồ uống", salesquantity: 57 },
    { year: 2024, month: 3, producttypeid: "PT02", producttypename: "Đồ uống", salesquantity: 44 },
    { year: 2024, month: 4, producttypeid: "PT03", producttypename: "Snack", salesquantity: 19 },
    { year: 2025, month: 1, producttypeid: "PT01", producttypename: "Dụng cụ", salesquantity: 8 },
    { year: 2025, month: 2, producttypeid: "PT04", producttypename: "Đồ ăn", salesquantity: 5 },
    { year: 2024, month: 2, producttypeid: "PT04", producttypename: "Đồ ăn", salesquantity: 5 },
];

const PredictionPage = () => {
    const [mappedData, setMappedData] = useState<{ id: string; name: string; quantity: number }[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showTable, setShowTable] = useState(false);

    const [timeType, setTimeType] = useState<"Tháng" | "Quý">("Tháng");
    const [selectedTime, setSelectedTime] = useState("Tháng 1");
    const [selectedYear, setSelectedYear] = useState(2024);

    useEffect(() => {
        let filtered = dummyData.filter((item) => item.year === selectedYear);

        if (timeType === "Tháng") {
            const month = parseInt(selectedTime.split(" ")[1], 10);
            filtered = filtered.filter((item) => item.month === month);
            const mapped = filtered.map((item) => ({
                id: item.producttypeid,
                name: item.producttypename,
                quantity: item.salesquantity,
            }));
            setMappedData(sortData(mapped, sortOrder));
        } else {
            const quarter = parseInt(selectedTime.split(" ")[1], 10);
            const months = { 1: [1, 2, 3], 2: [4, 5, 6], 3: [7, 8, 9], 4: [10, 11, 12] }[quarter] || [];
            filtered = filtered.filter((item) => months.includes(item.month));

            // Gộp quantity cho các id trùng
            const merged = new Map<string, { id: string; name: string; quantity: number }>();
            filtered.forEach((item) => {
                if (merged.has(item.producttypeid)) {
                    merged.get(item.producttypeid)!.quantity += item.salesquantity;
                } else {
                    merged.set(item.producttypeid, {
                        id: item.producttypeid,
                        name: item.producttypename,
                        quantity: item.salesquantity,
                    });
                }
            });
            setMappedData(sortData(Array.from(merged.values()), sortOrder));
        }
    }, [timeType, selectedTime, selectedYear, sortOrder]);

    const sortData = (data: { id: string; name: string; quantity: number }[], order: "asc" | "desc") => {
        return [...data].sort((a, b) => (order === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity));
    };

    const handleTimeTypeChange = (value: string) => {
        setTimeType(value as "Tháng" | "Quý");
        setSelectedTime(value === "Tháng" ? "Tháng 1" : "Quý 1");
    };

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex-1 p-6 space-y-6">
                <h1 className="text-xl font-semibold text-primary-600">Dự đoán các loại sản phẩm bán chạy</h1>

                <div className="flex justify-end gap-4 items-end">
                    {/* Chọn loại thời gian */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2">Chọn loại thời gian:</label>
                        <select
                            className="border px-2 py-1 rounded"
                            value={timeType}
                            onChange={(e) => handleTimeTypeChange(e.target.value)}
                        >
                            <option>Tháng</option>
                            <option>Quý</option>
                        </select>
                    </div>

                    {/* Chọn thời gian */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2">Chọn {timeType.toLowerCase()}:</label>
                        <select
                            className="border px-2 py-1 rounded"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        >
                            {timeType === "Tháng"
                                ? Array.from({ length: 12 }, (_, i) => (
                                    <option key={i}>{`Tháng ${i + 1}`}</option>
                                ))
                                : Array.from({ length: 4 }, (_, i) => (
                                    <option key={i}>{`Quý ${i + 1}`}</option>
                                ))}
                        </select>
                    </div>

                    {/* Chọn năm */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-2">Chọn năm:</label>
                        <select
                            className="border px-2 py-1 rounded"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                        >
                            <option value={2024}>2024</option>
                            <option value={2025}>2025</option>
                        </select>
                    </div>

                    <div className="ml-auto">
                        <button
                            onClick={() => setShowTable(true)}
                            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition cursor-pointer"
                        >
                            Dự đoán
                        </button>
                    </div>
                </div>

                {/* Biểu đồ */}
                <PredictionChart data={mappedData} sortOrder={sortOrder} onSortOrderChange={setSortOrder} />

                {/* Bảng */}
                {showTable && <PredictionTable data={mappedData} />}
            </div>
        </div>
    );
};

export default PredictionPage;
