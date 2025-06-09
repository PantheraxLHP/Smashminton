"use client";

import React, { useState, useEffect } from "react";
import PredictionChart from "./PredictionChart";
import PredictionTable from "./PredictionTable";
import DoubleBarChart from "./DoubleBarChart";

const dummyData = [
    { year: 2024, month: 1, producttypeid: "PT01", producttypename: "Phụ kiện cầu lông", salesquantity: 75, purchasequantity: 50 },
    { year: 2024, month: 1, producttypeid: "PT05", producttypename: "Thuê vợt", salesquantity: 75, purchasequantity: 100 },
    { year: 2024, month: 1, producttypeid: "PT06", producttypename: "Thuê giày", salesquantity: 64, purchasequantity: 100 },
    { year: 2024, month: 2, producttypeid: "PT02", producttypename: "Đồ ăn - Thức uống", salesquantity: 57, purchasequantity: 40 },
    { year: 2024, month: 3, producttypeid: "PT02", producttypename: "Đồ ăn - Thức uống", salesquantity: 44, purchasequantity: 30 },
    { year: 2024, month: 4, producttypeid: "PT03", producttypename: "Đồ ăn - Thức uống", salesquantity: 19, purchasequantity: 25 },
    { year: 2025, month: 1, producttypeid: "PT01", producttypename: "Phụ kiện cầu lông", salesquantity: 8, purchasequantity: 20 },
    { year: 2025, month: 2, producttypeid: "PT04", producttypename: "Đồ ăn - Thức uống", salesquantity: 5, purchasequantity: 10 },
    { year: 2025, month: 5, producttypeid: "PT05", producttypename: "Thuê vợt", salesquantity: 8, purchasequantity: 6 },
    { year: 2024, month: 6, producttypeid: "PT06", producttypename: "Thuê giày", salesquantity: 57, purchasequantity: 45 },
];

const PredictionPage = () => {
    const [mappedSales, setMappedSales] = useState<{ id: string; name: string; quantity: number }[]>([]);
    const [mappedPurchase, setMappedPurchase] = useState<{ id: string; name: string; quantity: number }[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showTable, setShowTable] = useState(false);
    const [doubleBarData, setDoubleBarData] = useState<
        { name: string; sales: number; purchase: number }[]
    >([]);

    const [timeType, setTimeType] = useState<"Tháng" | "Quý">("Tháng");
    const [selectedTime, setSelectedTime] = useState("Tháng 1");
    const [selectedYear, setSelectedYear] = useState(2024);

    useEffect(() => {
        let filtered = dummyData.filter((item) => item.year === selectedYear);

        if (timeType === "Tháng") {
            const month = parseInt(selectedTime.split(" ")[1], 10);
            filtered = filtered.filter((item) => item.month === month);

            const sales = filtered.map((item) => ({
                id: item.producttypeid,
                name: item.producttypename,
                quantity: item.salesquantity,
            }));
            const purchase = filtered.map((item) => ({
                id: item.producttypeid,
                name: item.producttypename,
                quantity: item.purchasequantity,
            }));

            setMappedSales(sortData(sales, sortOrder));
            setMappedPurchase(sortData(purchase, sortOrder));
        } else {
            const quarter = parseInt(selectedTime.split(" ")[1], 10);
            const months = { 1: [1, 2, 3], 2: [4, 5, 6], 3: [7, 8, 9], 4: [10, 11, 12] }[quarter] || [];
            filtered = filtered.filter((item) => months.includes(item.month));

            const mergeQuantities = (key: "salesquantity" | "purchasequantity") => {
                const map = new Map<string, { id: string; name: string; quantity: number }>();
                filtered.forEach((item) => {
                    if (map.has(item.producttypeid)) {
                        map.get(item.producttypeid)!.quantity += item[key];
                    } else {
                        map.set(item.producttypeid, {
                            id: item.producttypeid,
                            name: item.producttypename,
                            quantity: item[key],
                        });
                    }
                });
                return sortData(Array.from(map.values()), sortOrder);
            };

            setMappedSales(mergeQuantities("salesquantity"));
            setMappedPurchase(mergeQuantities("purchasequantity"));
        }

        const mergedComparison = new Map<string, { name: string; sales: number; purchase: number }>();

        filtered.forEach((item) => {
            const key = item.producttypeid;
            if (!mergedComparison.has(key)) {
                mergedComparison.set(key, {
                    name: item.producttypename,
                    sales: item.salesquantity,
                    purchase: item.purchasequantity,
                });
            } else {
                const existing = mergedComparison.get(key)!;
                existing.sales += item.salesquantity;
                existing.purchase += item.purchasequantity;
            }
        });
        setDoubleBarData(Array.from(mergedComparison.values()));

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

                <div className="flex flex-wrap justify-end gap-4 items-end">
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

                {/* Biểu đồ song song */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <PredictionChart
                            data={mappedSales}
                            title="Tỉ lệ sản phẩm bán ra"
                            sortOrder={sortOrder}
                            onSortOrderChange={setSortOrder}
                        />
                    </div>
                    <div className="flex-1">
                        <PredictionChart
                            data={mappedPurchase}
                            title="Tỉ lệ sản phẩm mua vào"
                            sortOrder={sortOrder}
                            onSortOrderChange={setSortOrder}
                        />
                    </div>
                </div>

                {doubleBarData.length > 0 && <DoubleBarChart data={doubleBarData} />}

                {/* Bảng dự đoán */}
                {showTable && <PredictionTable data={mappedSales} />}
            </div>
        </div>
    );
};

export default PredictionPage;
