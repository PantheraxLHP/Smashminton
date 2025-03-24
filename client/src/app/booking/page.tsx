"use client";

import { useState, useEffect, useRef } from "react";
import BookingStep from "@/components/atomic/BookingStep";
import BookingFilter from "@/components/atomic/BookingFilter";
import BookingCourtList from "@/components/atomic/BookingCourtList";
import { Button } from "@/components/ui/button";


interface Court {
    id: number;
    name: string;
    price: string;
    img: string;
}

interface Filters {
    location?: string;
    time?: string;
    duration?: number;
}

export default function BookingPage() {
    const [step, setStep] = useState<number>(1);
    const [filters, setFilters] = useState<Filters>({});
    const [courts, setCourts] = useState<Court[]>([]);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // ✅ Ngăn cập nhật `filters` nếu không có thay đổi thực sự
    const handleFilterChange = (newFilters: Filters) => {
        setFilters((prevFilters) => {
            if (JSON.stringify(prevFilters) !== JSON.stringify(newFilters)) {
                return newFilters;
            }
            return prevFilters;
        });
    };

    // ✅ Gọi API lấy danh sách sân theo bộ lọc, có debounce 500ms
    useEffect(() => {
        if (!filters.location || !filters.time || !filters.duration) return; // Đảm bảo đủ dữ liệu mới gọi API

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                const response = await fetch("/api/courts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(filters),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch courts");
                }

                const data: Court[] = await response.json();
                setCourts(data);
            } catch (error) {
                console.error("Error fetching courts:", error);
            }
        }, 500); // Đợi 500ms trước khi gọi API

    }, [filters]);

    const courtExData = [
        { id: 1, name: "Sân 1", price: "120.000 VND", img: "/Court1.png" },
        { id: 2, name: "Sân 2", price: "120.000 VND", img: "/Court2.png" },
        { id: 3, name: "Sân 3", price: "120.000 VND", img: "/Court3.png" },
        { id: 4, name: "Sân 4", price: "120.000 VND", img: "/Court4.png" },
        { id: 5, name: "Sân 5", price: "120.000 VND", img: "/Court5.png" },
        { id: 6, name: "Sân 6", price: "120.000 VND", img: "/Court6.png" },
    ];

    return (
        <div className="p-4">
            {/* Thanh bước tiến trình đặt sân */}
            <BookingStep currentStep={step} />

            {/* Nội dung từng bước */}
            {step === 1 && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-4">
                        {/* Bộ lọc chọn khu vực, thời gian, số giờ chơi */}
                        <BookingFilter onFilterChange={handleFilterChange} />

                        {/* Danh sách sân hiển thị theo filter */}
                        <div className="flex-1">
                            <BookingCourtList courts={/*courts*/ courtExData} />
                        </div>
                    </div>
                </div>
            )}

            {step > 1 && (
                <div className="text-center text-gray-500 text-lg font-semibold p-10">
                    Đang phát triển...
                </div>
            )}

            {/* Nút chuyển bước */}
            <div className="flex justify-between mt-4">
                {/* Nút Quay lại */}
                <Button
                    onClick={() => setStep(step - 1)}
                    className={`bg-gray-500 text-white ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
                >
                    ← Quay lại
                </Button>

                {/* Nút Tiếp theo */}
                <Button
                    onClick={() => setStep(step + 1)}
                    className={`bg-green-500 text-white ${step === 3 ? "opacity-0 pointer-events-none" : ""}`}
                >
                    Tiếp theo →
                </Button>
            </div>
        </div>
    );
}
