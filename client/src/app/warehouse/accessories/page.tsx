'use client';

import { useState } from 'react';
import AccessoryFilter from './AccessoryFilter';
import AccessoryList from './AccessoryList';
import AccessoryModal from './AddAccessories';

interface Filters {
    categories: string[];
    brands: string[];
    priceRange: [number, number];
    search: string;
}

export default function AccessoryManagementPage() {
    const [openModal, setOpenModal] = useState(false);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const [filters, setFilters] = useState<Filters>({
        categories: [],
        brands: [],
        priceRange: [0, 1000000],
        search: '',
    });

    return (
        <div className="flex flex-col lg:flex-row h-full w-full p-4 gap-4">
            <AccessoryModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={(data) => console.log("Phụ kiện mới:", data)}
            />

            {/* Mobile/Tablet Filter Toggle */}
            <div className="flex justify-between items-center mb-2 lg:hidden">
                <button
                    onClick={() => setShowMobileFilter((prev) => !prev)}
                    className="bg-gray-200 px-3 py-2 rounded"
                >
                    {showMobileFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                </button>

                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
                >
                    Thêm
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`w-full lg:w-[280px] shrink-0 ${showMobileFilter ? 'block' : 'hidden'
                    } lg:block`}
            >
                <AccessoryFilter filters={filters} setFilters={setFilters} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Desktop "Thêm" Button */}
                <div className="hidden lg:flex justify-end mb-2 pr-4">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
                    >
                        Thêm
                    </button>
                </div>

                {/* Product List */}
                <AccessoryList filters={filters} />
            </div>
        </div>
    );
}
