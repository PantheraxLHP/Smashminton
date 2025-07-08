import { formatNumber } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { getDashboardData } from '@/services/dashboard.service';
import { ChartConfig } from '@/components/ui/chart';
import TopCourtChart from './TopCourtChart';
import ZoneRevenueChart from './ZoneRevenueChart';
import NumberOfBookingPerTimeChart from './NumberOfBookingPerTimeChart';
import TopRentalChart from './TopRentalChart';
import TopProductChart from './TopProductChart';
import NumberOfProductAndRentalChart from './NumberOfProductAndRentalChart';
import { CustomerTabSwitcher } from './DashboardControls';

interface DashboardServerProps {
    year: number;
    activeTab: string;
}

// Chart configurations
const topCourtChartConfig: ChartConfig = {
    bookingCount: {
        label: 'Số lượng đặt',
        color: 'var(--color-chart-11)',
    },
};

const numberOfBookingPerTimeChartConfig: ChartConfig = {
    time1: {
        label: '06:00 - 09:00',
        color: 'var(--color-chart-31)',
    },
    time2: {
        label: '09:00 - 12:00',
        color: 'var(--color-chart-32)',
    },
    time3: {
        label: '12:00 - 18:00',
        color: 'var(--color-chart-35)',
    },
    time4: {
        label: '18:00 - 22:00',
        color: 'var(--color-chart-36)',
    },
};

const NumberOfProductAndRentalChartConfig: ChartConfig = {
    saleCount: {
        label: 'Tổng số sản phẩm được bán',
        color: 'var(--color-chart-31)',
    },
    rentalCount: {
        label: 'Tổng số lượt cho thuê của mọi sản phẩm',
        color: 'var(--color-chart-35)',
    },
};

const topProductsChartConfig: ChartConfig = {
    saleCount: {
        label: 'Số lượng bán',
        color: 'var(--color-primary)',
    },
};

const topRentalsChartConfig: ChartConfig = {
    rentalCount: {
        label: 'Số lượt cho thuê',
        color: 'var(--color-primary)',
    },
};

const topColors = [
    'var(--color-chart-1)',
    'var(--color-chart-2)',
    'var(--color-chart-3)',
    'var(--color-chart-4)',
    'var(--color-chart-5)',
    'var(--color-chart-6)',
    'var(--color-chart-7)',
    'var(--color-chart-8)',
    'var(--color-chart-9)',
    'var(--color-chart-10)',
];

const zoneColors = [
    'var(--color-chart-31)',
    'var(--color-chart-32)',
    'var(--color-chart-35)',
    'var(--color-chart-36)',
    'var(--color-chart-37)',
];

export default async function DashboardServer({ year, activeTab }: DashboardServerProps) {
    const dashboardData = await getDashboardData(year);

    // Transform data for charts
    const topCourtData =
        dashboardData.topCourts?.map((court, index) => ({
            courtName: court.courtname,
            bookingCount: court.numberBooking,
            fill: topColors[index],
        })) || [];

    const sportBrand = ['Yonex', 'Lining', 'Mizuno', 'Victor', 'Kamito', 'Taro'];

    const formatProductName = (name: string) => {
        const brand = sportBrand.find((brand) => name.includes(brand));
        if (brand) {
            const brandIndex = name.indexOf(brand);
            return name.substring(brandIndex);
        }
        return name;
    };

    const topProductsData =
        dashboardData.topProducts?.map((product, index) => ({
            productName: formatProductName(product.productname),
            saleCount: product.totalSold,
            fill: topColors[index],
        })) || [];

    const topRentalsData =
        dashboardData.topRentedProducts?.map((rental, index) => ({
            rentalName: formatProductName(rental.productname),
            rentalCount: rental.totalRented,
            fill: topColors[index],
        })) || [];

    // Create dynamic zone revenue chart config based on actual zone names from API
    const dynamicZoneRevenueConfig: ChartConfig = {};
    if (dashboardData.zoneRevenue && dashboardData.zoneRevenue.length > 0) {
        Object.keys(dashboardData.zoneRevenue[0]).forEach((key, index) => {
            if (key !== 'month') {
                dynamicZoneRevenueConfig[key] = {
                    label: key,
                    color: zoneColors[index],
                };
            }
        });
    }

    return (
        <div className="flex h-full min-h-screen w-full flex-col gap-4 bg-gray-200 p-4">
            {/* Stats Cards */}
            <div className="flex h-full w-full gap-2">
                <div className="flex w-1/2 flex-col justify-center rounded-lg border-2 bg-white p-3">
                    <div className="flex w-full items-center justify-center gap-1 text-lg">
                        Tổng giờ chơi
                        <Icon icon="mdi:clock-outline" className="size-5" />
                        <Icon icon="emojione-monotone:badminton" className="size-5" />
                    </div>
                    <div className="text-primary flex w-full items-end justify-center gap-2 font-semibold">
                        <span className="text-4xl">{formatNumber(dashboardData.duration || 0)}</span>
                        <span>giờ</span>
                    </div>
                </div>
                <div className="flex w-1/2 flex-col justify-center rounded-lg border-2 bg-white p-3">
                    <div className="flex w-full items-center justify-center gap-1 text-lg">
                        Tổng doanh thu
                        <Icon icon="material-symbols:attach-money-rounded" className="size-5" />
                    </div>
                    <div className="text-primary flex w-full items-end justify-center gap-2 font-semibold">
                        <span className="text-4xl">{formatNumber(dashboardData.revenue || 0)}</span>
                        <span>VND</span>
                    </div>
                </div>

                <div className="flex w-1/2 justify-center rounded-lg border-2 bg-white p-3">
                    <div className="flex w-full flex-col items-center gap-1 text-lg">
                        <div className="flex w-full items-center justify-center gap-1">
                            <span>Lượng khách hàng mới</span>
                            <Icon icon="lucide:users-round" className="size-5" />
                        </div>
                        <div className="text-primary flex w-full items-end justify-center gap-2 font-semibold">
                            <Icon icon="streamline:graph-arrow-increase" className="text-4xl" />
                            {activeTab === 'số lượng' ? (
                                <>
                                    <span className="text-4xl">{formatNumber(dashboardData.newCustomers || 0)}</span>
                                    <span>khách hàng mới</span>
                                </>
                            ) : (
                                <span className="text-4xl">{`${dashboardData.newCustomerRate.toFixed(2) || 0}%`}</span>
                            )}
                        </div>
                    </div>
                    <CustomerTabSwitcher activeTab={activeTab} />
                </div>
            </div>

            {/* Charts */}
            <div className="flex h-100 w-full items-center gap-2">
                <TopCourtChart
                    chartData={topCourtData}
                    chartConfig={topCourtChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                    year={year}
                />
                <ZoneRevenueChart
                    chartData={dashboardData.zoneRevenue || []}
                    chartConfig={dynamicZoneRevenueConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                    year={year}
                />
            </div>

            <div className="flex h-100 w-full items-center gap-2">
                <NumberOfBookingPerTimeChart
                    chartData={dashboardData.bookingTimeslot || []}
                    chartConfig={numberOfBookingPerTimeChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                    year={year}
                />
                <NumberOfProductAndRentalChart
                    chartData={dashboardData.productSalesRentals || []}
                    chartConfig={NumberOfProductAndRentalChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                    year={year}
                />
            </div>

            <div className="flex h-100 w-full items-center gap-2">
                <TopProductChart
                    chartData={topProductsData}
                    chartConfig={topProductsChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                    year={year}
                />
                <TopRentalChart
                    chartData={topRentalsData}
                    chartConfig={topRentalsChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                    year={year}
                />
            </div>
        </div>
    );
}
