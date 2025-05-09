'use client';

import { useState } from 'react';
import RentalFilter from './RentalFilter';
import RentalList from './RentalList';
import BookingBottomSheet from '../booking/_components/BookingBottomSheet';

type Racket = {
    productid: number;
    id: number;
    name: string;
    price: number;
    brand: string;
    weight: string;
    stiffness: string;
    balance: string;
    quantity: number;
    productName: string;
};

type Shoe = {
    productid: number;
    id: number;
    name: string;
    price: number;
    brand: string;
    form: string;
    size: string;
    quantity: number;
    productName: string;
};


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

    const [rentalQuantities, setRentalQuantities] = useState<{ [key: number]: number }>({});
    const [rackets, setRackets] = useState<Racket[]>([]);
    const [shoes, setShoes] = useState<Shoe[]>([]);

    const handleIncrement = (id: number) => {
        setRentalQuantities((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    };

    const handleDecrement = (id: number) => {
        setRentalQuantities((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) - 1, 0),
        }));
    };

    const selectedItems = [...rackets, ...shoes]
        .filter((item) => rentalQuantities[item.productid] > 0)
        .map((item) => ({
            ...item,
            quantity: rentalQuantities[item.productid],
            productname: item.name,
        }));


    const totalPrice = selectedItems.reduce((sum, item) => {
        return sum + (item.price || 0) * item.quantity;
    }, 0);

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
                        rentalQuantities={rentalQuantities}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        setRackets={setRackets}
                        setShoes={setShoes}
                    />
                </main>
            </div>

            {selectedItems.length > 0 && (
                <BookingBottomSheet
                    totalPrice={totalPrice}
                    selectedProducts={selectedItems}
                    selectedCourts={[]}
                    TTL={0}
                    onResetTimer={() => { }}
                    onConfirm={() => { }}
                />
            )}
        </div>
    );
}
