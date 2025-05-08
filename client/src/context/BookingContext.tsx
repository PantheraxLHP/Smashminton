'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { SelectedProducts, SelectedCourts } from '@/app/booking/courts/page';
import { getBookingRedis, postBookingCourt, deleteBookingCourt } from '@/services/booking.service';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

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

    const addCourt = (court: SelectedCourts) => {
        setSelectedCourts((prev) => (prev ? [...prev, court] : [court]));
        postBookingCourt({
            username: user?.username,
            court_booking: court,
        });
        toast.success('Thêm sân thành công');
    };

    const removeCourtByIndex = (index: number) => {
        setSelectedCourts((prev) => prev.filter((_, i) => i !== index));
        deleteBookingCourt({
            username: user?.username,
            court_booking: selectedCourts[index],
        });
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
            console.log('result', result.data.court_booking);
            if (!result.ok) {
                toast.error(result.message || 'Không thể tải danh sách sân');
            } else {
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
