'use client';

import ProductFilter from '@/app/products/ProductFilter';
import ProductList from '@/app/products/ProductList';
import { getProductFilters, getProducts } from '@/services/products.service';
import { Products } from '@/types/types';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../../components/atomic/BottomSheet';

export interface SelectedProducts extends Products {
    quantity: number;
}

const ProductPage = () => {
    const [products, setProducts] = useState<Products[]>([]);
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [selectedTypeId, setSelectedTypeId] = useState<number>(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('sellingprice');

    // State quản lý số lượng sản phẩm
    const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});

    // Fetch product filters and initial products
    useEffect(() => {
        const loadFilters = async () => {
            const filtersResponse = await getProductFilters();
            if (filtersResponse.ok) {
                setProductTypes(filtersResponse.data);
            }
        };

        loadFilters();
    }, []);

    // Fetch products when filters change
    useEffect(() => {
        const loadProducts = async () => {
            const productsResponse = await getProducts(
                selectedTypeId.toString(),
                selectedCategoryId > 0 ? selectedCategoryId.toString() : undefined,
            );

            if (productsResponse.ok) {
                setProducts(productsResponse.data);
            }
        };

        loadProducts();
    }, [selectedTypeId, selectedCategoryId, sortBy, sortOrder]);

    // Initialize product quantities
    useEffect(() => {
        setProductQuantities((prev) => {
            const updated = { ...prev };
            products.forEach((product) => {
                if (updated[product.productid] === undefined) {
                    updated[product.productid] = 0;
                }
            });
            return updated;
        });
    }, [products]);

    // Tăng số lượng sản phẩm
    const handleIncrement = (productid: number) => {
        setProductQuantities((prev) => ({
            ...prev,
            [productid]: prev[productid] + 1,
        }));
    };

    // Giảm số lượng sản phẩm
    const handleDecrement = (productid: number) => {
        setProductQuantities((prev) => ({
            ...prev,
            [productid]: Math.max(prev[productid] - 1, 0),
        }));
    };

    const handleTypeFilterChange = (typeId: number) => {
        setSelectedTypeId(typeId);
        setSelectedCategoryId(0);
    };

    const handleCategoryFilterChange = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
    };

    const handleSortOrderChange = (orderBy: string, sortBy: string) => {
        setSortOrder(orderBy);
        setSortBy(sortBy);
    };

    const selectedProducts: SelectedProducts[] = products
        .filter((product) => productQuantities[product.productid] > 0)
        .map((product) => ({
            ...product,
            quantity: productQuantities[product.productid],
        }));

    const totalPrice = selectedProducts.reduce((acc, product) => {
        return acc + (product.sellingprice ?? 0) * product.quantity;
    }, 0);

    return (
        <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row">
            <div className="flex flex-col gap-5">
                <ProductFilter
                    productTypes={productTypes}
                    onTypeFilterChange={handleTypeFilterChange}
                    onCategoryFilterChange={handleCategoryFilterChange}
                    selectedTypeId={selectedTypeId}
                    selectedCategoryId={selectedCategoryId}
                />
            </div>
            <ProductList
                products={products}
                productQuantities={productQuantities}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortOrderChange={handleSortOrderChange}
            />
            {selectedProducts.length > 0 && (
                <BookingBottomSheet
                    selectedProducts={selectedProducts}
                    selectedCourts={[]}
                    TTL={0}
                    onResetTimer={() => {}}
                    onConfirm={() => {}}
                />
            )}
        </div>
    );
};

export default ProductPage;
