'use client';

import { SelectedCourts, SelectedProducts } from '@/app/booking/courts/page';
import { deleteBookingCourt, getBookingRedis, postBookingCourt } from '@/services/booking.service';
import { deleteOrder, deleteRentalOrder, getOrderRedis, postOrder } from '@/services/orders.service';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

export interface BookingContextProps {
    selectedProducts: SelectedProducts[];
    setSelectedProducts: (products: SelectedProducts[]) => void;
    selectedCourts: SelectedCourts[];
    setSelectedCourts: (courts: SelectedCourts[]) => void;
    totalCourtPrice: number;
    totalProductPrice: number;
    TTL: number;
    addCourt: (court: SelectedCourts, fixedCourt: boolean) => void;
    removeCourtByIndex: (index: number) => void;
    addRentalItem: (productId: number, returnDate: string) => void;
    addProductItem: (productId: number) => void;
    removeProduct: (index: number) => void;
    fetchBooking: () => Promise<void>;
    clearCourts: () => void;
    clearRentalOrder: () => Promise<void>;
    refreshCourts: () => void;
    refreshTrigger: number;
}

const BookingContext = createContext<BookingContextProps>({
    selectedProducts: [],
    setSelectedProducts: () => {},
    selectedCourts: [],
    setSelectedCourts: () => {},
    totalCourtPrice: 0,
    totalProductPrice: 0,
    TTL: 0,
    addRentalItem: () => {},
    addProductItem: () => {},
    addCourt: () => {},
    removeCourtByIndex: () => {},
    fetchBooking: async () => {},
    removeProduct: () => {},
    clearCourts: () => {},
    clearRentalOrder: async () => {},
    refreshCourts: () => {},
    refreshTrigger: 0,
});

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>([]);
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourts[]>([]);
    const [TTL, setTTL] = useState(300);
    const [totalCourtPrice, setTotalCourtPrice] = useState(0);
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const { user } = useAuth();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshCourts = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const addCourt = async (court: SelectedCourts, fixedCourt: boolean) => {
        const response = await postBookingCourt({
            username: user?.username || '',
            fixedCourt,
            court_booking: court,
        });
        if (response.ok) {
            await fetchBooking();
            toast.success('Thêm sân thành công');
        } else {
            await toast.error('Sân đã được đặt! Vui lòng chọn sân khác');
            refreshCourts();
        }
    };

    const removeCourtByIndex = async (index: number) => {
        const court = selectedCourts[index];
        const response = await deleteBookingCourt({
            username: user?.username || '',
            court_booking: court,
        });

        if (response.ok) {
            await fetchBooking();
            if (selectedCourts.length === 1) {
                await clearRentalOrder();
                await fetchOrders();
            }
            toast.success('Xóa sân thành công');
            refreshCourts();
        }
    };

    const addRentalItem = async (productId: number, returnDate: string) => {
        const response = await postOrder({
            username: user?.username || '',
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
            username: user?.username || '',
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

    const clearRentalOrder = async () => {
        if (user?.username) {
            await deleteRentalOrder(user.username);
        }
    };

    const fetchBooking = async () => {
        if (user?.username) {
            const result = await getBookingRedis(user.username);
            if (result.ok) {
                setSelectedCourts(result.data.court_booking);
                setTTL(result.data.TTL);
                setTotalCourtPrice(result.data.totalprice);
            }
        }
    };
    const fetchOrders = async () => {
        if (user?.username) {
            const result = await getOrderRedis(user.username);
            if (result.ok) {
                setSelectedProducts(result.data.product_order);
                setTotalProductPrice(result.data.totalprice);
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
                totalCourtPrice,
                totalProductPrice,
                TTL,
                addCourt,
                removeCourtByIndex,
                addRentalItem,
                addProductItem,
                removeProduct,
                fetchBooking,
                clearCourts,
                clearRentalOrder,
                refreshCourts,
                refreshTrigger,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
