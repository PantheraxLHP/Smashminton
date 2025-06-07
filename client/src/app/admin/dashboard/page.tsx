'use client';

import { formatNumber } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { ChartConfig } from "@/components/ui/chart";
import SingleBarChart from "./SingleBarChart";
import SingleLineChart from "./SingleLineChart";
import CustomPieChart from "./CustomPieChart";
import MultipleBarChart from "./MultipleBarChart";

const topCourtChartConfig: ChartConfig = {
    bookingCount: {
        label: "Số lần đặt",
        color: "var(--color-primary)",
    },
};

const numberOfOrdersChartConfig: ChartConfig = {
    orderCount: {
        label: "Số lượng đơn hàng",
        color: "var(--color-primary)",
    }
}

const revenuePerZoneChartConfig: ChartConfig = {
    zoneA: {
        label: "Khu vực A",
        color: "var(--color-primary-200)",
    },
    zoneB: {
        label: "Khu vực B",
        color: "var(--color-blue-200)",
    },
    zoneC: {
        label: "Khu vực C",
        color: "var(--color-red-100)",
    },
    zoneD: {
        label: "Khu vực D",
        color: "var(--color-yellow-100)",
    },
}

const revenueOfProductsandRentalsChartConfig: ChartConfig = {
    productRevenue: {
        label: "Doanh thu sản phẩm",
        color: "var(--color-green-200)",
    },
    rentalRevenue: {
        label: "Doanh thu cho thuê",
        color: "var(--color-blue-200)",
    },
}

const topProductsChartConfig: ChartConfig = {
    salesCount: {
        label: "Số lượng bán",
        color: "var(--color-secondary)",
    },
}

const topRentalsChartConfig: ChartConfig = {
    rentalCount: {
        label: "Số lượng cho thuê",
        color: "var(--color-secondary)",
    },
}

const DashboardPage = () => {
    const newCustomerTabs = ["số lượng", "tỉ lệ %"];
    const [activeTab, setActiveTab] = useState<string>(newCustomerTabs[0]);
    const topCourtData = [
        {courtName: "Sân 1", bookingCount: 150, fill: "var(--color-primary-200)"},
        {courtName: "Sân 2", bookingCount: 120, fill: "var(--color-blue-200)"},
        {courtName: "Sân 3", bookingCount: 130, fill: "var(--color-red-100)"},
        { courtName: "Sân 4", bookingCount: 170, fill: "var(--color-yellow-100)" },
        { courtName: "Sân 5", bookingCount: 110, fill: "var(--color-blue-500)" },
        { courtName: "Sân 6", bookingCount: 140, fill: "var(--color-gray-400)" },
    ]

    const numberOfOrdersData = [
        { month: "T1", orderCount: 200 },
        { month: "T2", orderCount: 180 },
        { month: "T3", orderCount: 220 },
        { month: "T4", orderCount: 250 },
        { month: "T5", orderCount: 300 },
        { month: "T6", orderCount: 280 },
        { month: "T7", orderCount: 320 },
        { month: "T8", orderCount: 350 },
        { month: "T9", orderCount: 400 },
        { month: "T10", orderCount: 450 },
        { month: "T11", orderCount: 500 },
        { month: "T12", orderCount: 550 },
    ]

    const revenuePerZoneData = [
        { zone: "zoneA", revenue: 5000000, fill: "var(--color-primary-200)" },
        { zone: "zoneB", revenue: 7000000, fill: "var(--color-blue-200)" },
        { zone: "zoneC", revenue: 6000000, fill: "var(--color-red-100)" },
        { zone: "zoneD", revenue: 8000000, fill: "var(--color-yellow-100)" },
    ]

    const revenueOfProductsandRentalsData = [
        { month: "T1", productRevenue: 3000000, rentalRevenue: 5000000 },
        { month: "T2", productRevenue: 4000000, rentalRevenue: 6000000 },
        { month: "T3", productRevenue: 3500000, rentalRevenue: 5500000 },
        { month: "T4", productRevenue: 4500000, rentalRevenue: 6500000 },
        { month: "T5", productRevenue: 5000000, rentalRevenue: 7000000 },
        { month: "T6", productRevenue: 6000000, rentalRevenue: 8000000 },
        { month: "T7", productRevenue: 7000000, rentalRevenue: 9000000 },
        { month: "T8", productRevenue: 8000000, rentalRevenue: 10000000 },
        { month: "T9", productRevenue: 9000000, rentalRevenue: 11000000 },
        { month: "T10", productRevenue: 10000000, rentalRevenue: 12000000 },
        { month: "T11", productRevenue: 11000000, rentalRevenue: 13000000 },
        { month: "T12", productRevenue: 12000000, rentalRevenue: 14000000 },
    ]

    const topProductsData = [
        { productName: "Sản phẩm A", salesCount: 500, fill: "var(--color-green-200)" },
        { productName: "Sản phẩm B", salesCount: 300, fill: "var(--color-blue-200)" },
        { productName: "Sản phẩm C", salesCount: 400, fill: "var(--color-red-100)" },
        { productName: "Sản phẩm D", salesCount: 600, fill: "var(--color-yellow-100)" },
    ]

    const topRentalsData = [
        { rentalName: "Dịch vụ A", rentalCount: 200, fill: "var(--color-green-200)" },
        { rentalName: "Dịch vụ B", rentalCount: 150, fill: "var(--color-blue-200)" },
        { rentalName: "Dịch vụ C", rentalCount: 180, fill: "var(--color-red-100)" },
        { rentalName: "Dịch vụ D", rentalCount: 220, fill: "var(--color-yellow-100)" },
    ]

    return (
        <div className="flex flex-col w-full min-h-screen h-full p-4 gap-4 bg-gray-400">
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
                                <>
                                    <span className="text-4xl">
                                        {`${50} %`}
                                    </span>
                                </>
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
            <div className="flex items-center gap-2 w-full h-80">
                <SingleBarChart
                    chartData={topCourtData}
                    chartConfig={topCourtChartConfig}
                    chartTitle="Xếp hạng sân được đặt nhiều nhất"
                    layout="vertical"
                    chartWidth="100%"
                    chartHeight="100%"
                    xAxisDataType="number"
                    xAxisDataKey="bookingCount"
                    yAxisDataType="category"
                    yAxisDataKey="courtName"
                    mainDataKey="bookingCount"
                    className=""
                />
                <CustomPieChart
                    chartData={revenuePerZoneData}
                    chartConfig={revenuePerZoneChartConfig}
                    chartTitle="Doanh thu theo khu vực sân (Zone)"
                    chartWidth="40%"
                    chartHeight="100%"
                    mainDataKey="revenue"
                    nameKey="zone"
                    className=""
                />
            </div>
            <div className="flex items-center gap-2 w-full h-80">
                <SingleLineChart
                    chartData={numberOfOrdersData}
                    chartConfig={numberOfOrdersChartConfig}
                    chartTitle="Số lượng đơn hàng theo tháng"
                    layout="horizontal"
                    chartWidth="100%"
                    chartHeight="100%"
                    xAxisDataType="category"
                    xAxisDataKey="month"
                    yAxisDataType="number"
                    yAxisDataKey="orderCount"
                    mainDataKey="orderCount"
                    className=""
                />
                <MultipleBarChart
                    chartData={revenueOfProductsandRentalsData}
                    chartConfig={revenueOfProductsandRentalsChartConfig}
                    chartTitle="Doanh thu sản phẩm và dịch vụ cho thuê theo tháng"
                    layout="horizontal"
                    chartWidth="100%"
                    chartHeight="100%"
                    xAxisDataType="category"
                    xAxisDataKey="month"
                    yAxisDataType="number"
                    yAxisDataKey="rentalRevenue"
                    mainDataKey={["productRevenue", "rentalRevenue"]}
                    className=""
                />
            </div>
            <div className="flex items-center gap-2 w-full h-80">
                <SingleBarChart
                    chartData={topProductsData}
                    chartConfig={topProductsChartConfig}
                    chartTitle="Top sản phẩm bán chạy nhất"
                    layout="horizontal"
                    chartWidth="100%"
                    chartHeight="100%"
                    xAxisDataType="category"
                    xAxisDataKey="productName"
                    yAxisDataType="number"
                    yAxisDataKey="salesCount"
                    mainDataKey="salesCount"
                    className=""
                />
                <SingleBarChart
                    chartData={topRentalsData}
                    chartConfig={topRentalsChartConfig}
                    chartTitle="Top dịch vụ cho thuê nhiều nhất"
                    layout="horizontal"
                    chartWidth="100%"
                    chartHeight="100%"
                    xAxisDataType="category"
                    xAxisDataKey="rentalName"
                    yAxisDataType="number"
                    yAxisDataKey="rentalCount"
                    mainDataKey="rentalCount"
                    className=""
                />
            </div>
        </div>
    );
}

export default DashboardPage;