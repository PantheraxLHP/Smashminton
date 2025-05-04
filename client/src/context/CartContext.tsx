import { createContext, useContext, useState, useEffect } from "react";
import { SelectedProducts, SelectedCourts } from "@/app/booking/courts/page";

interface CartContextProps {
    selectedProducts: SelectedProducts[];
    setSelectedProducts: (products: SelectedProducts[]) => void;
    selectedCourts: SelectedCourts[];
    setSelectedCourts: (courts: SelectedCourts[]) => void;
    totalPrice: number;
    addProduct: (productId: number) => void;
    removeProductOne: (productId: number) => void;
    removeProductAll: (productId: number) => void;
    addCourt: (court: SelectedCourts) => void;
    removeCourt: (court: SelectedCourts) => void;
    fetchCart: () => Promise<void>;
    TTL: number;
}

const CartContext = createContext<CartContextProps>({
    selectedProducts: [],
    setSelectedProducts: () => { },
    selectedCourts: [],
    setSelectedCourts: () => { },
    totalPrice: 0,
    addProduct: () => { },
    removeProductOne: () => { },
    removeProductAll: () => { },
    addCourt: () => { },
    removeCourt: () => { },
    fetchCart: async () => { },
    TTL: 0,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>([]);
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourts[]>([]);
    const [TTL, setTTL] = useState(300);
    const [totalPrice, setTotalPrice] = useState(0);

    const fetchCart = async () => {
        try {
            const response = await fetch("/api/cart", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setSelectedProducts(data.products);
                setSelectedCourts(data.courts);
                setTTL(data.TTL);
                setTotalPrice(data.totalPrice);
            } else {
                console.error("Failed to fetch cart data");
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    const addCourt = async (court: SelectedCourts) => {
        await fetch(`/api/cart/courts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(court),
            credentials: "include",
        });
        await fetchCart();
    }

    const removeCourt = async (court: SelectedCourts) => {
        await fetch(`/api/cart/courts`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(court),
            credentials: "include",
        });
        await fetchCart();
    }

    const addProduct = async (productId: number) => {
        await fetch(`/api/cart/products/${productId}/increment`, {
            method: "POST",
            credentials: "include",
        });
        await fetchCart();
    }

    const removeProductOne = async (productId: number) => {
        await fetch(`/api/cart/products/${productId}/decrement`, {
            method: "POST",
            credentials: "include",
        });
        await fetchCart();
    }

    const removeProductAll = async (productId: number) => {
        await fetch(`/api/cart/products/${productId}/remove`, {
            method: "DELETE",
            credentials: "include",
        });
        await fetchCart();
    }

    return (
        <CartContext.Provider
            value={{
                selectedProducts,
                setSelectedProducts,
                selectedCourts,
                setSelectedCourts,
                totalPrice,
                addProduct,
                removeProductOne,
                removeProductAll,
                addCourt,
                removeCourt,
                fetchCart,
                TTL,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);