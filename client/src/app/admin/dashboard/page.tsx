'use client';

import { formatNumber } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { ChartConfig } from "@/components/ui/chart";
import TopCourtChart from "./TopCourtChart";
import ZoneRevenueChart from "./ZoneRevenueChart";
import NumberOfBookingPerTimeChart from "./NumberOfBookingPerTimeChart";
import TopRentalChart from "./TopRentalChart";
import TopProductChart from "./TopProductChart";
import NumberOfProductAndRentalChart from "./NumberOfProductAndRentalChart";

const topCourtChartConfig: ChartConfig = {
    bookingCount: {
        label: "Số lượng đặt",
        color: "var(--color-chart-11)",
    }
};

const numberOfBookingPerTimeChartConfig: ChartConfig = {
    time1: {
        label: "06:00 - 09:00",
        color: "var(--color-chart-31)",
    },
    time2: {
        label: "09:00 - 12:00",
        color: "var(--color-chart-32)",
    },
    time3: {
        label: "12:00 - 18:00",
        color: "var(--color-chart-35)",
    },
    time4: {
        label: "18:00 - 22:00",
        color: "var(--color-chart-36)",
    },
}

const revenuePerZoneChartConfig: ChartConfig = {
    zoneA: {
        label: "Khu vực A",
        color: "var(--color-chart-31)",
    },
    zoneB: {
        label: "Khu vực B",
        color: "var(--color-chart-32)",
    },
    zoneC: {
        label: "Khu vực C",
        color: "var(--color-chart-35)",
    },
    zoneD: {
        label: "Khu vực D",
        color: "var(--color-chart-36)",
    },
}

const NumberOfProductAndRentalChartConfig: ChartConfig = {
    saleCount: {
        label: "Tổng số sản phẩm được bán",
        color: "var(--color-chart-31)",
    },
    rentalCount: {
        label: "Tổng số lượt cho thuê của mọi sản phẩm",
        color: "var(--color-chart-35)",
    },
}

const topProductsChartConfig: ChartConfig = {
    saleCount: {
        label: "Số lượng bán",
        color: "var(--color-primary)",
    },
}

const topRentalsChartConfig: ChartConfig = {
    rentalCount: {
        label: "Số lượt cho thuê",
        color: "var(--color-primary)",
    },
}

const DashboardPage = () => {
    const newCustomerTabs = ["số lượng", "tỉ lệ %"];
    const [activeTab, setActiveTab] = useState<string>(newCustomerTabs[0]);
    const topCourtData = [
        { courtName: "Sân 1", bookingCount: 150, fill: "var(--color-chart-11)" },
        { courtName: "Sân 2", bookingCount: 120, fill: "var(--color-chart-12)" },
        { courtName: "Sân 3", bookingCount: 100, fill: "var(--color-chart-13)" },
        { courtName: "Sân 4", bookingCount: 90, fill: "var(--color-chart-14)" },
        { courtName: "Sân 5", bookingCount: 80, fill: "var(--color-chart-15)" },
        { courtName: "Sân 6", bookingCount: 70, fill: "var(--color-chart-16)" },
        { courtName: "Sân 7", bookingCount: 60, fill: "var(--color-chart-17)" },
        { courtName: "Sân 8", bookingCount: 50, fill: "var(--color-chart-18)" },
        { courtName: "Sân 9", bookingCount: 40, fill: "var(--color-chart-19)" },
        { courtName: "Sân 10", bookingCount: 30, fill: "var(--color-chart-20)" },
    ]

    const numberOfBookingPerTimeData = [
        { month: 1, time1: 300, time2: 600, time3: 500, time4: 700 },
        { month: 2, time1: 400, time2: 700, time3: 600, time4: 800 },
        { month: 3, time1: 350, time2: 650, time3: 550, time4: 750 },
        { month: 4, time1: 450, time2: 750, time3: 650, time4: 850 },
        { month: 5, time1: 500, time2: 800, time3: 700, time4: 900 },
        { month: 6, time1: 600, time2: 900, time3: 800, time4: 1000 },
        { month: 7, time1: 700, time2: 1000, time3: 900, time4: 1100 },
        { month: 8, time1: 800, time2: 1100, time3: 1000, time4: 1200 },
        { month: 9, time1: 900, time2: 1200, time3: 1100, time4: 1300 },
        { month: 10, time1: 1000, time2: 1300, time3: 1200, time4: 1400 },
        { month: 11, time1: 1100, time2: 1400, time3: 1300, time4: 1500 },
        { month: 12, time1: 1200, time2: 1500, time3: 1400, time4: 1600 },
    ]

    const revenuePerZoneData = [
        { month: 1, zoneA: 5, zoneB: 7, zoneC: 6, zoneD: 8 },
        { month: 2, zoneA: 6, zoneB: 8, zoneC: 7, zoneD: 9 },
        { month: 3, zoneA: 7, zoneB: 9, zoneC: 8, zoneD: 10 },
        { month: 4, zoneA: 8, zoneB: 10, zoneC: 9, zoneD: 11 },
        { month: 5, zoneA: 9, zoneB: 11, zoneC: 10, zoneD: 12 },
        { month: 6, zoneA: 10, zoneB: 12, zoneC: 11, zoneD: 13 },
        { month: 7, zoneA: 11, zoneB: 13, zoneC: 12, zoneD: 14 },
        { month: 8, zoneA: 12, zoneB: 14, zoneC: 13, zoneD: 15 },
        { month: 9, zoneA: 13, zoneB: 15, zoneC: 14, zoneD: 16 },
        { month: 10, zoneA: 14, zoneB: 16, zoneC: 15, zoneD: 17 },
        { month: 11, zoneA: 15, zoneB: 17, zoneC: 16, zoneD: 18 },
        { month: 12, zoneA: 16, zoneB: 18, zoneC: 17, zoneD: 19 },
    ]

    const numberOfProductAndRentalData = [
        { month: 1, saleCount: 500, rentalCount: 300 },
        { month: 2, saleCount: 1500, rentalCount: 1300 },
        { month: 3, saleCount: 600, rentalCount: 400 },
        { month: 4, saleCount: 700, rentalCount: 500 },
        { month: 5, saleCount: 1300, rentalCount: 1100 },
        { month: 6, saleCount: 800, rentalCount: 600 },
        { month: 7, saleCount: 1000, rentalCount: 800 },
        { month: 8, saleCount: 1600, rentalCount: 1400 },
        { month: 9, saleCount: 900, rentalCount: 700 },
        { month: 10, saleCount: 1200, rentalCount: 1000 },
        { month: 11, saleCount: 1100, rentalCount: 900 },
        { month: 12, saleCount: 1400, rentalCount: 1200 },
    ]

    const topProductsData = [
        { productName: "Sản phẩm A", saleCount: 1100, fill: "var(--color-chart-11)" },
        { productName: "Sản phẩm B", saleCount: 1050, fill: "var(--color-chart-12)" },
        { productName: "Sản phẩm C", saleCount: 800, fill: "var(--color-chart-13)" },
        { productName: "Sản phẩm D", saleCount: 600, fill: "var(--color-chart-14)" },
        { productName: "Sản phẩm E", saleCount: 550, fill: "var(--color-chart-15)" },
        { productName: "Sản phẩm F", saleCount: 540, fill: "var(--color-chart-16)" },
        { productName: "Sản phẩm G", saleCount: 540, fill: "var(--color-chart-17)" },
        { productName: "Sản phẩm H", saleCount: 490, fill: "var(--color-chart-18)" },
        { productName: "Sản phẩm I", saleCount: 420, fill: "var(--color-chart-19)" },
        { productName: "Sản phẩm J", saleCount: 350, fill: "var(--color-chart-20)" },
    ]

    const topRentalsData = [
        { rentalName: "Dịch vụ A", rentalCount: 900, fill: "var(--color-chart-11)" },
        { rentalName: "Dịch vụ B", rentalCount: 800, fill: "var(--color-chart-12)" },
        { rentalName: "Dịch vụ C", rentalCount: 700, fill: "var(--color-chart-13)" },
        { rentalName: "Dịch vụ D", rentalCount: 700, fill: "var(--color-chart-14)" },
        { rentalName: "Dịch vụ E", rentalCount: 650, fill: "var(--color-chart-15)" },
        { rentalName: "Dịch vụ F", rentalCount: 500, fill: "var(--color-chart-16)" },
        { rentalName: "Dịch vụ G", rentalCount: 450, fill: "var(--color-chart-17)" },
        { rentalName: "Dịch vụ H", rentalCount: 200, fill: "var(--color-chart-18)" },
        { rentalName: "Dịch vụ I", rentalCount: 150, fill: "var(--color-chart-19)" },
        { rentalName: "Dịch vụ J", rentalCount: 100, fill: "var(--color-chart-20)" },
    ]

    return (
        <div className="flex flex-col w-full min-h-screen h-full p-4 gap-4 bg-gray-200">
            <div className="flex items-center gap-10">
                <span className="text-2xl font-semibold">Dashboard</span>
                <div>
                    Chọn filter các kiểu
                </div>
            </div>
            <div className="flex gap-2 w-full h-full">
                <div className="border-2 rounded-lg p-3 flex flex-col justify-center w-1/4 bg-white">
                    <div className="text-lg w-full flex justify-center gap-1 items-center">
                        Tổng doanh thu
                        <Icon icon="material-symbols:attach-money-rounded" className="size-5" />
                    </div>
                    <div className="w-full flex gap-2 justify-center items-end text-primary font-semibold">
                        <span className="text-4xl">
                            {formatNumber(1000000000)}
                        </span>
                        <span className="">
                            VND
                        </span>
                    </div>
                </div>
                <div className="border-2 rounded-lg p-3 flex flex-col justify-center w-1/4 bg-white">
                    <div className="text-lg w-full flex justify-center gap-1 items-center">
                        Tổng giờ chơi
                        <Icon icon="mdi:clock-outline" className="size-5" />
                        <Icon icon="emojione-monotone:badminton" className="size-5" />
                    </div>
                    <div className="w-full flex gap-2 justify-center items-end text-primary font-semibold">
                        <span className="text-4xl">
                            {formatNumber(100000)}
                        </span>
                        <span className="">
                            giờ
                        </span>
                    </div>
                </div>
                <div className="border-2 rounded-lg p-3 flex justify-center w-2/4 bg-white">
                    <div className="text-lg w-full flex flex-col items-center gap-1">
                        <div className="w-full flex justify-center gap-1 items-center">
                            <span className="">
                                Lượng khách hàng mới
                            </span>
                            <Icon icon="lucide:users-round" className="size-5" />
                        </div>
                        <div className="w-full flex gap-2 justify-center items-end text-primary font-semibold">
                            <Icon icon="streamline:graph-arrow-increase" className="text-4xl" />
                            {activeTab === "số lượng" ? (
                                <>
                                    <span className="text-4xl">
                                        {formatNumber(1000000000)}
                                    </span>
                                    <span className="">
                                        khách hàng mới
                                    </span>
                                </>
                            ) : (
                                <span className="text-4xl">
                                    {`${50} %`}
                                </span>
                            )}
                        </div>

                    </div>
                    <div className="relative w-fit flex border shadow-inner bg-gray-100 rounded-full h-fit">
                        <div
                            className="absolute top-0 h-full bg-white shadow-lg rounded-full transition-transform duration-300 ease-out"
                            style={{
                                width: `${100 / newCustomerTabs.length}%`,
                                transform: `translateX(${newCustomerTabs.indexOf(activeTab) * 100}%)`
                            }}
                        />
                        {newCustomerTabs.map((tab, index) => (
                            <div
                                key={index}
                                className="relative w-20 flex justify-center cursor-pointer py-0.5 px-2 z-10 transition-colors duration-200"
                                onClick={() => setActiveTab(tab)}
                            >
                                <span className={`text-sm transition-colors duration-200 ${activeTab === tab ? "text-gray-700" : "text-gray-500"
                                    }`}>
                                    {tab}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 w-full h-100">
                <TopCourtChart
                    chartData={topCourtData}
                    chartConfig={topCourtChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                />
                <ZoneRevenueChart
                    chartData={revenuePerZoneData}
                    chartConfig={revenuePerZoneChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                />
            </div>
            <div className="flex items-center gap-2 w-full h-100">
                <NumberOfBookingPerTimeChart
                    chartData={numberOfBookingPerTimeData}
                    chartConfig={numberOfBookingPerTimeChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                />
                <NumberOfProductAndRentalChart
                    chartData={numberOfProductAndRentalData}
                    chartConfig={NumberOfProductAndRentalChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                />
            </div>
            <div className="flex items-center gap-2 w-full h-100">
                <TopProductChart
                    chartData={topProductsData}
                    chartConfig={topProductsChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                />
                <TopRentalChart
                    chartData={topRentalsData}
                    chartConfig={topRentalsChartConfig}
                    chartWidth="100%"
                    chartHeight="100%"
                    className=""
                />
            </div>
        </div>
    );
}

export default DashboardPage;