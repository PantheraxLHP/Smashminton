'use client';

import { SelectedCourts, SelectedProducts } from '@/app/booking/courts/page';
import { deleteBookingCourt, getBookingRedis, postBookingCourt } from '@/services/booking.service';
import { deleteOrder, getOrderRedis, postOrder } from '@/services/orders.service';
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
    addRentalItem: (productId: number, returnDate: string) => void;
    addProductItem: (productId: number) => void;
    removeProduct: (index: number) => void;
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
    addRentalItem: () => {},
    addProductItem: () => {},
    addCourt: () => {},
    removeCourtByIndex: () => {},
    fetchBooking: async () => {},
    removeProduct: () => {},
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
        const response = await postBookingCourt({
            username: user?.username,
            court_booking: court,
        });
        if (response.ok) {
            fetchBooking();
            toast.success('Thêm sân thành công');
        }
    };

    const removeCourtByIndex = async (index: number) => {
        const court = selectedCourts[index];
        const response = await deleteBookingCourt({
            username: user?.username,
            court_booking: court,
        });
        if (response.ok) {
            fetchBooking();
            toast.success('Xóa sân thành công');
        }
    };

    const addRentalItem = async (productId: number, returnDate: string) => {
        const response = await postOrder({
            username: user?.username,
            productid: productId,
            returndate: returnDate,
        });
        if (response.ok) {
            await fetchOrders();
            toast.success('Thêm thành công');
        }
    };

    const addProductItem = async (productId: number) => {
        const response = await postOrder({
            username: user?.username,
            productid: productId,
        });
        if (response.ok) {
            await fetchOrders();
            toast.success('Thêm thành công');
        }
    };

    const removeProduct = async (productId: number) => {
        const response = await deleteOrder({
            username: user?.username,
            productid: productId,
        });
        if (response.ok) {
            await fetchOrders();
            toast.success('Xóa thành công');
        }
    };

    const clearCourts = () => {
        setSelectedCourts([]);
    };

    const clearProducts = () => {
        setSelectedProducts([]);
    };

    const fetchBooking = async () => {
        if (user?.username) {
            const result = await getBookingRedis(user.username);
            if (result.ok) {
                setSelectedCourts(result.data.court_booking);
                setTTL(result.data.TTL);
            }
        } else {
            toast.warning('Vui lòng đăng nhập');
            router.push('/signin');
        }
    };
    const fetchOrders = async () => {
        if (user?.username) {
            const result = await getOrderRedis(user.username);
            if (result.ok) {
                setSelectedProducts(result.data.product_order);
            }
        }
    };

    useEffect(() => {
        fetchBooking();
        fetchOrders();
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
                addRentalItem,
                addProductItem,
                removeProduct,
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
