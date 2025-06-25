'use client';
import React, { useState } from 'react';
import { PredictionTableControls, PredictionChartControls } from './PredictionControls';
import PredictionTable from './PredictionTable';
import PredictionChart from './PredictionChart';
import DoubleBarChart from './DoubleBarChart';
import {
    getPredictionData,
    getPredictionDataTable,
    PredictionTable as PredictionTableType,
} from '@/services/prediction.service';
import { Button } from '@/components/ui/button';

export default function PredictionPage() {
    // Table control state (local, not from search params)
    const [tableTimeType, setTableTimeType] = useState<'Tháng' | 'Quý'>('Tháng');
    const [tableSelectedTime, setTableSelectedTime] = useState('Tháng 1');
    const [tableShow, setTableShow] = useState(false);
    const [tableData, setTableData] = useState<PredictionTableType[]>([]);
    const [tableLoading, setTableLoading] = useState(false);

    // Chart control state (can still use search params or local state as needed)
    const [chartTimeType, setChartTimeType] = useState<'Tháng' | 'Quý'>('Tháng');
    const [chartSelectedTime, setChartSelectedTime] = useState('Tháng 1');
    const [chartSelectedYear, setChartSelectedYear] = useState(2024);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [chartData, setChartData] = useState<{ id: string; name: string; quantity: number }[]>([]);
    const [purchaseData, setPurchaseData] = useState<{ id: string; name: string; quantity: number }[]>([]);
    const [doubleBarData, setDoubleBarData] = useState<any[]>([]);
    const [chartLoading, setChartLoading] = useState(false);

    // Table predict handler
    const handleTablePredict = async () => {
        setTableLoading(true);
        setTableShow(false);
        try {
            const type = tableTimeType === 'Tháng' ? 'month' : 'quarter';
            const filters: any = { type };
            if (type === 'month') {
                filters.month = parseInt(tableSelectedTime.split(' ')[1], 10);
            } else {
                filters.quarter = parseInt(tableSelectedTime.split(' ')[1], 10);
            }
            const predictionData = await getPredictionDataTable(filters);
            setTableData(predictionData);
            setTableShow(true);
        } catch (e) {
            setTableData([]);
            setTableShow(false);
        } finally {
            setTableLoading(false);
        }
    };

    // Chart fetch handler (fetch on control change)
    React.useEffect(() => {
        setChartLoading(true);
        const fetchData = async () => {
            const type = chartTimeType === 'Tháng' ? 'month' : 'quarter';
            const filters: any = { type, year: chartSelectedYear };
            if (type === 'month') {
                filters.month = parseInt(chartSelectedTime.split(' ')[1], 10);
            } else {
                filters.quarter = parseInt(chartSelectedTime.split(' ')[1], 10);
            }
            const predictionData = await getPredictionData(filters);
            setChartData(predictionData.soldRatio);
            setPurchaseData(predictionData.purchasedRatio);
            setDoubleBarData(predictionData.salesPurchase);
            setChartLoading(false);
        };
        fetchData();
    }, [chartTimeType, chartSelectedTime, chartSelectedYear, sortOrder]);

    return (
        <div className="flex h-full w-full flex-col gap-8 bg-gray-200 p-4">
            {/* Part 1: Table controls and table */}
            <div>
                <PredictionTableControls
                    timeType={tableTimeType}
                    selectedTime={tableSelectedTime}
                    onTimeTypeChange={(type) => setTableTimeType(type as 'Tháng' | 'Quý')}
                    onTimeChange={setTableSelectedTime}
                    onPredict={handleTablePredict}
                />
                {tableLoading && <div>Đang tải dữ liệu...</div>}
                {tableShow && (
                    <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
                        <Button variant="outline" onClick={() => setTableShow(false)}>
                            Ẩn bảng dự đoán
                        </Button>
                        <PredictionTable data={tableData} />
                    </div>
                )}
            </div>

            {/* Part 2: Chart controls and charts grouped in a div */}
            <div className="flex flex-col gap-4 rounded-lg bg-gray-200">
                <PredictionChartControls
                    timeType={chartTimeType}
                    selectedTime={chartSelectedTime}
                    selectedYear={chartSelectedYear}
                    onTimeTypeChange={(type) => setChartTimeType(type as 'Tháng' | 'Quý')}
                    onTimeChange={setChartSelectedTime}
                    onYearChange={setChartSelectedYear}
                />
                {chartLoading ? (
                    <div>Đang tải biểu đồ...</div>
                ) : (
                    <div className="flex h-full w-full gap-2">
                        <div className="flex-1 rounded-lg border-2 bg-white p-4">
                            <PredictionChart
                                data={chartData}
                                title={`Tỉ lệ loại sản phẩm bán ra trong ${chartSelectedTime.toLowerCase()} năm ${chartSelectedYear}`}
                                sortOrder={sortOrder}
                            />
                        </div>
                        <div className="flex-1 rounded-lg border-2 bg-white p-4">
                            <PredictionChart
                                data={purchaseData}
                                title={`Tỉ lệ loại sản phẩm mua vào trong ${chartSelectedTime.toLowerCase()} năm ${chartSelectedYear}`}
                                sortOrder={sortOrder}
                            />
                        </div>
                    </div>
                )}
                {doubleBarData.length > 0 && (
                    <div className="h-[80vh] w-full rounded-lg border-2 bg-white p-4">
                        <DoubleBarChart
                            data={doubleBarData}
                            selectedTime={chartSelectedTime}
                            selectedYear={chartSelectedYear}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
