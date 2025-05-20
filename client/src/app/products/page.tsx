'use client';

import ProductFilter from '@/components/Product/ProductFilter';
import ProductList from '@/components/Product/ProductList';
import { getProductFilters, getProducts } from '@/services/products.service';
import { ProductTypes, Products } from '@/types/types';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../../components/atomic/BottomSheet';
import { useBooking } from '@/context/BookingContext';

export interface SelectedProducts extends Products {
    quantity: number;
}

const ProductPage = () => {
    const { selectedCourts, selectedProducts, TTL } = useBooking();
    const [products, setProducts] = useState<Products[]>([]);
    const [productTypes, setProductTypes] = useState<ProductTypes[]>([]);
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<number>(1);
    const [selectedProductFilterValueIds, setSelectedProductFilterValueIds] = useState<number[]>([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('sellingprice');

    useEffect(() => {
        const loadFilters = async () => {
            const filtersResponse = await getProductFilters();
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

    const handleSortOrderChange = (orderBy: string, sortBy: string) => {
        setSortOrder(orderBy);
        setSortBy(sortBy);
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
            <ProductList
                products={products}
                selectedProducts={selectedProducts}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortOrderChange={handleSortOrderChange}
            />
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
