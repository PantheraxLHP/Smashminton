'use client';

import { SelectedCourts, SelectedProducts } from '@/app/booking/courts/page';
import { deleteBookingCourt, getBookingRedis, postBookingCourt } from '@/services/booking.service';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

export interface BookingContextProps {
    selectedProducts: SelectedProducts[];
    setSelectedProducts: (products: SelectedProducts[]) => void;
    selectedCourts: SelectedCourts[];
    setSelectedCourts: (courts: SelectedCourts[]) => void;
    totalPrice: number;
    TTL: number;
    addCourt: (court: SelectedCourts) => void;
    removeCourtByIndex: (index: number) => void;
    addProduct: (product: SelectedProducts) => void;
    removeProductByIndex: (index: number) => void;
    fetchBooking: () => Promise<void>;
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
    removeCourtByIndex: () => {},
    fetchBooking: async () => {},
    removeProductByIndex: () => {},
    clearCourts: () => {},
    clearProducts: () => {},
});

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>([]);
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourts[]>([]);
    const [TTL, setTTL] = useState(300);
    const [totalPrice] = useState(0);
    const { user } = useAuth();
    const router = useRouter();

    const addCourt = async (court: SelectedCourts) => {
        await postBookingCourt({
            username: user?.username,
            court_booking: court,
        });
        fetchBooking();
        toast.success('Thêm sân thành công');
    };

    const removeCourtByIndex = async (index: number) => {
        const court = selectedCourts[index];
        await deleteBookingCourt({
            username: user?.username,
            court_booking: court,
        });
        fetchBooking();
        toast.success('Xóa sân thành công');
    };

    const addProduct = (product: SelectedProducts) => {
        setSelectedProducts((prev) => (prev ? [...prev, product] : [product]));
    };

    const removeProductByIndex = (index: number) => {
        setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const clearCourts = () => {
        setSelectedCourts([]);
    };

    const clearProducts = () => {
        setSelectedProducts([]);
    };

    const fetchBooking = async () => {
        if (user) {
            const result = await getBookingRedis(user.username);
            if (result.ok) {
                setSelectedCourts(result.data.court_booking);
                setSelectedProducts(result.data.products);
                setTTL(result.data.TTL);
            }
        } else {
            toast.warning('Vui lòng đăng nhập');
            router.push('/signin');
        }
    };

    useEffect(() => {
        fetchBooking();
    }, []);

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
                removeCourtByIndex,
                addProduct,
                removeProductByIndex,
                fetchBooking,
                clearCourts,
                clearProducts,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
