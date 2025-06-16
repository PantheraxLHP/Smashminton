'use client';
import BookingDetailFilter from './BookingDetailFilter';
import BookingDetailCourtList from './BookingDetailCourtList';
import { useState } from 'react';
export interface BookingDetailFilters {
    date: string;
    zoneid: number;
}

const BookingDetailPage = () => {
    const [filters, setFilters] = useState<BookingDetailFilters>({
        date: '',
        zoneid: 0,
    });

    const handleFilterChange = (newFilters: BookingDetailFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };
    return (
        <div className="flex w-full flex-col items-center gap-4 p-4 sm:flex-row sm:items-start">
            <BookingDetailFilter handleFilterChange={handleFilterChange} />
            <BookingDetailCourtList filters={filters} />
        </div>
    );
};

export default BookingDetailPage;
