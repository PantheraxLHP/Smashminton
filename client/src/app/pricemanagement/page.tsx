'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import ServiceModal from "./AddService";
import ServiceActionsMenu from "./MoreActionsMenu";
import { Service } from "./type";

// Dữ liệu dịch vụ
const rawServices: Service[] = [
    {
        name: "Thuê sân",
        type: "Thuê sân",
        product: "Zone A",
        price: "100.000 VND",
        startTime: "5:00",
        endTime: "17:00",
        image: "ZoneA.png",
    },
    {
        name: "Thuê sân",
        type: "Thuê sân",
        product: "Zone B",
        price: "150.000 VND",
        startTime: "5:00",
        endTime: "17:00",
        image: "ZoneB.png",
    },
    {
        name: "Thuê vợt",
        type: "Thuê vợt",
        product: "001F",
        price: "200.000 VND",
        startTime: "6:00",
        endTime: "22:00",
        image: "YonexRacket1.png",
    },
    {
        name: "Thuê giày",
        type: "Thuê giày",
        product: "Atlas",
        price: "200.000 VND",
        startTime: "6:00",
        endTime: "22:00",
        image: "YonexShoes1.png",
    },
    {
        name: "Thuê sân",
        type: "Thuê sân",
        product: "Zone A",
        price: "150.000 VND",
        startTime: "18:00",
        endTime: "22:00",
        image: "Court1.png",
    },
];

function normalizeTimeString(time: string) {
    const [hour, minute] = time.split(":").map(Number);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hour)}:${pad(minute)}`;
}

const services: Service[] = rawServices.map((s) => ({
    ...s,
    startTime: normalizeTimeString(s.startTime),
    endTime: normalizeTimeString(s.endTime),
}));

export default function ServicePriceManager() {
    const [showModal, setShowModal] = useState(false);
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [editData, setEditData] = useState<Service | null>(null);
    const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);
    const [servicesState, setServicesState] = useState<Service[]>(services);


    return (
        <div className="p-4 sm:p-6">
            <div className="flex justify-center sm:justify-end mb-4 pr-2 ">
                <Button onClick={() => setShowModal(true)} className="bg-primary-500 hover:bg-primary-600 text-white rounded cursor-pointer">
                    Thêm dịch vụ
                </Button>
            </div>

            <div className="max-w-[calc(100vw-70px)] overflow-x-auto rounded border border-primary-200">
                <table className="w-full text-sm">
                    <thead className="bg-primary-50 text-left text-gray-700">
                        <tr>
                            <th className="px-3 py-2 font-medium">Dịch vụ</th>
                            <th className="px-3 py-2 font-medium">Sản phẩm áp dụng</th>
                            <th className="px-3 py-2 font-medium">Giá / h</th>
                            <th className="px-3 py-2 font-medium">Thời gian áp dụng</th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicesState.map((s, index) => (
                            <tr
                                key={index}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="px-3 py-3 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="mr-2 accent-primary-600"
                                    />
                                    <img
                                        src={s.image || "/.png"}
                                        alt=""
                                        className="w-8 h-8 rounded object-cover"
                                    />
                                    {s.name}
                                </td>
                                <td className="px-3 py-3">{s.product}</td>
                                <td className="px-3 py-3">{s.price}</td>
                                <td className="px-3 py-3">
                                    {`${normalizeTimeString(s.startTime)} - ${normalizeTimeString(s.endTime)}`}
                                </td>
                                <td className="px-3 py-3 text-right relative">
                                    <button
                                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setSelectedServiceIndex(index); // lưu index đúng
                                            setMenuPosition({
                                                x: rect.left - 38,
                                                y: rect.bottom + 5,
                                            });
                                        }}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {menuPosition && (
                                        <ServiceActionsMenu
                                            position={menuPosition}
                                            onClose={() => setMenuPosition(null)}
                                            onEdit={() => {
                                                if (selectedServiceIndex !== null) {
                                                    setEditData(services[selectedServiceIndex]);
                                                }
                                                setShowModal(true);
                                            }}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ServiceModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditData(null); // clear sau khi đóng
                }}
                onSubmit={(updatedService) => {
                    if (editData) {
                        // đang sửa -> cập nhật dịch vụ đúng index
                        setServicesState(prev =>
                            prev.map((s, i) =>
                                i === selectedServiceIndex ? updatedService : s
                            )
                        );
                    } else {
                        // đang thêm mới
                        setServicesState(prev => [...prev, updatedService]);
                    }

                    setShowModal(false);
                    setEditData(null);
                    setSelectedServiceIndex(null);
                }}

                editData={editData}
            />

        </div>
    );
}
