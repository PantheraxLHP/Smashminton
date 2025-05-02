import { createContext, useContext, useState, useEffect } from "react";
import { SelectedProducts, SelectedCourts } from "@/app/booking/courts/page";

interface CartContextProps {
    selectedProducts: SelectedProducts[];
    setSelectedProducts: (products: SelectedProducts[]) => void;
    selectedCourts: SelectedCourts[];
    setSelectedCourts: (courts: SelectedCourts[]) => void;
    totalPrice: number;
    addProduct: (product: SelectedProducts) => void;
    updateProductQuantity: (products: SelectedProducts[]) => void;
    removeProduct: (productId: number) => void;
    addCourt: (court: SelectedCourts) => void;
    removeCourt: (court: SelectedCourts) => void;
    fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps>({
    selectedProducts: [],
    setSelectedProducts: () => { },
    selectedCourts: [],
    setSelectedCourts: () => { },
    totalPrice: 0,
    addProduct: () => { },
    updateProductQuantity: () => { },
    removeProduct: () => { },
    addCourt: () => { },
    removeCourt: () => { },
    fetchCart: async () => { },
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>([]);
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourts[]>([]);

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

    const addCourt = (court: SelectedCourts) => {
        setSelectedCourts((prev) => [...prev, court]);
    }

    const removeCourt = (court: SelectedCourts) => {
        setSelectedCourts((prev) =>
            prev.filter(
                (c) =>
                    c.courtid !== court.courtid ||
                    c.filters.zone !== court.filters.zone ||
                    c.filters.date !== court.filters.date ||
                    c.filters.duration !== court.filters.duration ||
                    c.filters.startTime !== court.filters.startTime ||
                    c.filters.fixedCourt !== court.filters.fixedCourt,
            ),
        );
    }

    const addProduct = (product: SelectedProducts) => {
        const existingProduct = selectedProducts.find((p) => p.productid === product.productid);
        if (existingProduct) {
            setSelectedProducts((prev) =>
                prev.map((p) =>
                    p.productid === product.productid ? { ...p, quantity: p.quantity + 1 } : p,
                ),
            );
        } else {
            setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }]);
        }
    }

    const updateProductQuantity = (products: SelectedProducts[]) => {
        setSelectedProducts((prev) =>
            prev.map((product) => {
                const updatedProduct = products.find((p) => p.productid === product.productid);
                return updatedProduct ? { ...product, quantity: updatedProduct.quantity } : product;
            }),
        );
    }

    const removeProduct = (productId: number) => {
        setSelectedProducts((prev) => prev.filter((product) => product.productid !== productId));
    }

    const totalPrice = selectedCourts?.reduce((sum, scCourt) => sum + parseInt(scCourt.price.replace(/\D/g, '')), 0) + selectedProducts?.reduce((sum, product) => sum + ((product.sellingprice || 0) + (product.rentalprice || 0)) * product.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                selectedProducts,
                setSelectedProducts,
                selectedCourts,
                setSelectedCourts,
                totalPrice,
                addProduct,
                updateProductQuantity,
                removeProduct,
                addCourt,
                removeCourt,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);