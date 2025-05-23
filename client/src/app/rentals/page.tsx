'use client';

import ProductFilter from '@/components/Booking/ProductFilter';
import RentalList from '@/components/Booking/RentalList';
import { useBooking } from '@/context/BookingContext';
import { getProducts, getRentFilters } from '@/services/products.service';
import { ProductTypes, Products } from '@/types/types';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../../components/atomic/BottomSheet';

export interface SelectedProducts extends Products {
    quantity: number;
}

const ProductPage = () => {
    const { selectedCourts, selectedProducts, TTL } = useBooking();
    const [products, setProducts] = useState<Products[]>([]);
    const [productTypes, setProductTypes] = useState<ProductTypes[]>([]);
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<number>(3);
    const [selectedProductFilterValueIds, setSelectedProductFilterValueIds] = useState<number[]>([]);

    useEffect(() => {
        const loadFilters = async () => {
            const filtersResponse = await getRentFilters();
            if (filtersResponse.ok) {
                setProductTypes(filtersResponse.data);
            }
        };

        loadFilters();
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            const productsResponse = await getProducts(
                selectedProductTypeId,
                selectedProductFilterValueIds.length > 0 ? selectedProductFilterValueIds : undefined,
            );

            if (productsResponse.ok) {
                setProducts(productsResponse.data);
            }
        };

        loadProducts();
    }, [selectedProductTypeId, selectedProductFilterValueIds]);

    const handleProductTypeChange = (productTypeId: number) => {
        setSelectedProductTypeId(productTypeId);
        setSelectedProductFilterValueIds([]);
    };

    const handleProductFilterValueChange = (productFilterValueIds: number[]) => {
        if (productFilterValueIds.length === 0) {
            setSelectedProductFilterValueIds([]);
        } else if (selectedProductFilterValueIds.includes(productFilterValueIds[0])) {
            setSelectedProductFilterValueIds(
                selectedProductFilterValueIds.filter((id) => id !== productFilterValueIds[0]),
            );
        } else {
            setSelectedProductFilterValueIds([...selectedProductFilterValueIds, ...productFilterValueIds]);
        }
    };

    const hasSelectedItems = (selectedCourts?.length > 0 || selectedProducts?.length > 0) ?? false;

    return (
        <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row">
            <div className="flex flex-col gap-5">
                <ProductFilter
                    productTypes={productTypes}
                    onProductTypeChange={handleProductTypeChange}
                    onProductFilterValueChange={handleProductFilterValueChange}
                    selectedProductTypeId={selectedProductTypeId}
                    selectedProductFilterValueIds={selectedProductFilterValueIds}
                />
            </div>
            <RentalList products={products} selectedProducts={selectedProducts} />
            {hasSelectedItems && (
                <BookingBottomSheet
                    selectedProducts={selectedProducts}
                    selectedCourts={selectedCourts}
                    TTL={TTL}
                    onResetTimer={() => {}}
                    onConfirm={() => {}}
                />
            )}
        </div>
    );
};

export default ProductPage;
