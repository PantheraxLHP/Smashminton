import PredictionChart from './PredictionChart';
import PredictionTable from './PredictionTable';
import DoubleBarChart from './DoubleBarChart';
import { getPredictionData, PredictionFilters } from '@/services/prediction.service';

interface PredictionServerProps {
    timeType: 'Tháng' | 'Quý';
    selectedTime: string;
    selectedYear: number;
    sortOrder: 'asc' | 'desc';
    showTable: boolean;
}

// Helper function to create API filters from component props
function createApiFilters(timeType: 'Tháng' | 'Quý', selectedTime: string, selectedYear: number): PredictionFilters {
    const type = timeType === 'Tháng' ? 'month' : 'quarter';
    const filters: PredictionFilters = {
        type,
        year: selectedYear,
    };

    if (type === 'month') {
        filters.month = parseInt(selectedTime.split(' ')[1], 10);
    } else {
        filters.quarter = parseInt(selectedTime.split(' ')[1], 10);
    }

    return filters;
}

// Helper function to sort data
function sortData(data: { id: string; name: string; ratio: number }[], order: 'asc' | 'desc') {
    return [...data].sort((a, b) => (order === 'asc' ? a.ratio - b.ratio : b.ratio - a.ratio));
}

export default async function PredictionServer({
    timeType,
    selectedTime,
    selectedYear,
    sortOrder,
    showTable,
}: PredictionServerProps) {
    try {
        // Create API filters
        const apiFilters = createApiFilters(timeType, selectedTime, selectedYear);

        // Fetch data from APIs using the new function
        const predictionData = await getPredictionData(apiFilters);

        // Sort the data based on sortOrder
        const mappedSales = sortData(predictionData.soldRatio, sortOrder);
        const mappedPurchase = sortData(predictionData.purchasedRatio, sortOrder);
        const doubleBarData = predictionData.salesPurchase;

        return (
            <div className="flex h-full w-full flex-col gap-4 rounded-lg bg-white p-4">
                {/* Prediction Table */}
                {showTable && (
                    <div className="w-full rounded-lg border-2 bg-white p-4">
                        <PredictionTable data={mappedSales} />
                    </div>
                )}
                {/* Charts */}
                <div className="flex h-full w-full gap-2">
                    <div className="flex-1 rounded-lg border-2 bg-white p-4">
                        <PredictionChart
                            data={mappedSales}
                            title={`Tỉ lệ loại sản phẩm bán ra trong ${selectedTime.toLowerCase()} năm ${selectedYear}`}
                            sortOrder={sortOrder}
                        />
                    </div>
                    <div className="flex-1 rounded-lg border-2 bg-white p-4">
                        <PredictionChart
                            data={mappedPurchase}
                            title={`Tỉ lệ loại sản phẩm mua vào trong ${selectedTime.toLowerCase()} năm ${selectedYear}`}
                            sortOrder={sortOrder}
                        />
                    </div>
                </div>

                {/* Double Bar Chart */}
                {doubleBarData.length > 0 && (
                    <div className="h-[80vh] w-full rounded-lg border-2 bg-white p-4">
                        <DoubleBarChart data={doubleBarData} selectedTime={selectedTime} selectedYear={selectedYear} />
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('Error fetching prediction data:', error);

        // Return error state
        return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gray-200 p-4">
                <h2 className="text-xl font-semibold text-red-600">Đã xảy ra lỗi!</h2>
                <p className="text-gray-600">Không thể tải dữ liệu dự đoán từ server.</p>
                <p className="text-sm text-gray-500">Vui lòng thử lại sau hoặc liên hệ quản trị viên.</p>
            </div>
        );
    }
}
