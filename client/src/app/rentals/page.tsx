'use client';

import { useState } from 'react';
import RentalFilter from './RentalFilter';
import RentalList from './RentalList';

export default function RentalsPage() {
    const [selectedCategory, setSelectedCategory] = useState<'Thuê vợt' | 'Thuê giày'>('Thuê vợt');

    const [filters, setFilters] = useState({
        brands: [] as string[],
        weights: [] as string[],
        stiffness: [] as string[],
        balance: [] as string[],
        forms: [] as string[],
        sizes: [] as string[],
    });

    return (
        <div className="max-w-8xl mx-auto px-4 py-6 md:px-8 lg:px-12">
            <div className="flex flex-col gap-2 lg:flex-row">
                {/* Filter bên trái */}
                <aside className="w-full pt-2 lg:w-1/4">
                    <RentalFilter
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </aside>

                {/* Danh sách sản phẩm bên phải */}
                <main className="w-full pt-4 lg:w-3/4">
                    <RentalList
                        selectedCategory={selectedCategory}
                        filters={filters}
                    />
                </main>
            </div>
        </div>
    );
}
