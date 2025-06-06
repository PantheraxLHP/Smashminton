'use client';

import { formatNumber } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { ChartConfig } from "@/components/ui/chart";
import CustomBarChart from "./CustomBarChart";
import CustomLineChart from "./CustomLineChart";
import CustomPieChart from "./CustomPieChart";

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
        color: "var(--color-red-200)",
    },
    zoneD: {
        label: "Khu vực D",
        color: "var(--color-yellow-200)",
    },
}

const DashboardPage = () => {
    const newCustomerTabs = ["số lượng", "tỉ lệ %"];
    const [activeTab, setActiveTab] = useState<string>(newCustomerTabs[0]);
    const topCourtData = [
        {courtName: "Sân 1", bookingCount: 150},
        {courtName: "Sân 2", bookingCount: 120},
        {courtName: "Sân 3", bookingCount: 100},
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
        { zone: "zoneC", revenue: 6000000, fill: "var(--color-red-200)" },
        { zone: "zoneD", revenue: 8000000, fill: "var(--color-yellow-200)" },
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
            <CustomBarChart
                chartData={topCourtData}
                chartConfig={topCourtChartConfig}
                chartTitle="Xếp hạng sân được đặt nhiều nhất"
                layout="vertical"
                chartWidth="100%"
                chartHeight="400px"
                xAxisDataType="number"
                xAxisDataKey="bookingCount"
                yAxisDataType="category"
                yAxisDataKey="courtName"
                mainDataKey="bookingCount"
                className=""
            />
            <CustomLineChart
                chartData={numberOfOrdersData}
                chartConfig={numberOfOrdersChartConfig}
                chartTitle="Số lượng đơn hàng theo tháng"
                layout="horizontal"
                chartWidth="100%"
                chartHeight="400px"
                xAxisDataType="category"
                xAxisDataKey="month"
                yAxisDataType="number"
                yAxisDataKey="orderCount"
                mainDataKey="orderCount"
                className=""
            />
            <CustomPieChart
                chartData={revenuePerZoneData}
                chartConfig={revenuePerZoneChartConfig}
                chartTitle="Doanh thu theo khu vực sân (Zone)"
                chartWidth="100%"
                chartHeight="400px"
                mainDataKey="revenue"
                nameKey="zone"
                className=""
            />
        </div>
    );
}

export default DashboardPage;