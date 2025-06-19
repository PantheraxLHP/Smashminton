import { ChartConfig } from '@/components/ui/chart';
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

// Chart configurations
const predictionChartConfig: ChartConfig = {
    quantity: {
        label: 'Số lượng',
        color: 'var(--color-primary)',
    },
};

const doubleBarChartConfig: ChartConfig = {
    sales: {
        label: 'Sản phẩm bán ra',
        color: 'var(--color-chart-31)',
    },
    purchase: {
        label: 'Sản phẩm mua vào',
        color: 'var(--color-chart-35)',
    },
};

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
function sortData(data: { id: string; name: string; quantity: number }[], order: 'asc' | 'desc') {
    return [...data].sort((a, b) => (order === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity));
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
            <div className="flex h-full min-h-screen w-full flex-col gap-4 bg-gray-200 p-4">
                {/* Charts */}
                <div className="flex h-80 w-full gap-2">
                    <div className="flex-1 rounded-lg border-2 bg-white p-4">
                        <PredictionChart data={mappedSales} title="Tỉ lệ sản phẩm bán ra" sortOrder={sortOrder} />
                    </div>
                    <div className="flex-1 rounded-lg border-2 bg-white p-4">
                        <PredictionChart data={mappedPurchase} title="Tỉ lệ sản phẩm mua vào" sortOrder={sortOrder} />
                    </div>
                </div>

                {/* Double Bar Chart */}
                {doubleBarData.length > 0 && (
                    <div className="h-80 w-full rounded-lg border-2 bg-white p-4">
                        <DoubleBarChart data={doubleBarData} />
                    </div>
                )}

                {/* Prediction Table */}
                {showTable && (
                    <div className="w-full rounded-lg border-2 bg-white p-4">
                        <PredictionTable data={mappedSales} />
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('Error fetching prediction data:', error);

        // Return error state
        return (
            <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 bg-gray-200 p-4">
                <h2 className="text-xl font-semibold text-red-600">Đã xảy ra lỗi!</h2>
                <p className="text-gray-600">Không thể tải dữ liệu dự đoán từ server.</p>
                <p className="text-sm text-gray-500">Vui lòng thử lại sau hoặc liên hệ quản trị viên.</p>
            </div>
        );
    }
}
