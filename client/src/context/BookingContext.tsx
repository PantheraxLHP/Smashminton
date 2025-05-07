'use client';

import { createContext, useContext, useState } from 'react';
import { SelectedProducts, SelectedCourts } from '@/app/booking/courts/page';

interface BookingContextProps {
    selectedProducts: SelectedProducts[];
    setSelectedProducts: (products: SelectedProducts[]) => void;
    selectedCourts: SelectedCourts[];
    setSelectedCourts: (courts: SelectedCourts[]) => void;
    totalPrice: number;
    TTL: number;
    addCourt: (court: SelectedCourts) => void;
    removeCourt: (court: SelectedCourts) => void;
    removeCourtByIndex: (index: number) => void;
    addProduct: (product: SelectedProducts) => void;
    removeProduct: (product: SelectedProducts) => void;
    removeProductByIndex: (index: number) => void;
    fetchCart: () => Promise<void>;
    clearCourts: () => void;
    clearProducts: () => void;
}

const BookingContext = createContext<BookingContextProps>({
    selectedProducts: [],
    setSelectedProducts: () => {},
    selectedCourts: [],
    setSelectedCourts: () => {},
    totalPrice: 0,
    TTL: 0,
    addProduct: () => {},
    addCourt: () => {},
    removeCourt: () => {},
    removeCourtByIndex: () => {},
    fetchCart: async () => {},
    removeProduct: () => {},
    removeProductByIndex: () => {},
    clearCourts: () => {},
    clearProducts: () => {},
});

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>([]);
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourts[]>([]);
    const [TTL] = useState(300);
    const [totalPrice] = useState(0);

    // Add the addCourt function
    const addCourt = (court: SelectedCourts) => {
        setSelectedCourts((prev) => [...prev, court]);
    };

    // Add the removeCourt function
    const removeCourt = (court: SelectedCourts) => {
        setSelectedCourts((prev) => prev.filter((c) => c !== court));
    };

    // Add the removeCourtByIndex function
    const removeCourtByIndex = (index: number) => {
        setSelectedCourts((prev) => prev.filter((_, i) => i !== index));
    };

    // Add the addProduct function
    const addProduct = (product: SelectedProducts) => {
        setSelectedProducts((prev) => [...prev, product]);
    };

    // Add the removeProduct function
    const removeProduct = (product: SelectedProducts) => {
        setSelectedProducts((prev) => prev.filter((p) => p !== product));
    };

    // Add the removeProductByIndex function
    const removeProductByIndex = (index: number) => {
        setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
    };

    // Add the clearCourts function
    const clearCourts = () => {
        setSelectedCourts([]);
    };

    // Add the clearProducts function
    const clearProducts = () => {
        setSelectedProducts([]);
    };

    // Add the fetchCart function (dummy implementation)
    const fetchCart = async () => {
        // Implement fetch logic here if needed
    };

    return (
        <BookingContext.Provider
            value={{
                selectedProducts,
                setSelectedProducts,
                selectedCourts,
                setSelectedCourts,
                totalPrice,
                TTL,
                addCourt,
                removeCourt,
                removeCourtByIndex,
                addProduct,
                removeProduct,
                removeProductByIndex,
                fetchCart,
                clearCourts,
                clearProducts,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
