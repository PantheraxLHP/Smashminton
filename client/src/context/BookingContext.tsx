'use client';

import { SelectedCourts, SelectedProducts } from '@/app/booking/courts/page';
import { deleteBookingCourt, getBookingRedis, postBookingCourt } from '@/services/booking.service';
import { deleteOrder, deleteRentalOrder, getOrderRedis, postOrder } from '@/services/orders.service';
import { useRouter } from 'next/navigation';
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
    addCourt: (court: SelectedCourts) => void;
    removeCourtByIndex: (index: number) => void;
    addRentalItem: (productId: number, returnDate: string) => void;
    addProductItem: (productId: number) => void;
    removeProduct: (index: number) => void;
    fetchBooking: () => Promise<void>;
    clearCourts: () => void;
    clearRentalOrder: () => Promise<void>;
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
});

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>([]);
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourts[]>([]);
    const [TTL, setTTL] = useState(300);
    const [totalCourtPrice, setTotalCourtPrice] = useState(0);
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const { user } = useAuth();
    const router = useRouter();

    const addCourt = async (court: SelectedCourts) => {
        const response = await postBookingCourt({
            username: user?.username || '',
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
            username: user?.username || '',
            court_booking: court,
        });
        if (response.ok) {
            fetchBooking();
            toast.success('Xóa sân thành công');
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
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
