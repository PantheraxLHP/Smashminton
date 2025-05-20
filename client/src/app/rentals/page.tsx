'use client';

import ProductFilter, { ProductTypeWithFilters } from '@/components/Product/ProductFilter';
import ProductList from '@/components/Product/ProductList';
import { getProducts, getRentFilters } from '@/services/products.service';
import { Products } from '@/types/types';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../../components/atomic/BottomSheet';

export interface SelectedProducts extends Products {
    quantity: number;
}

const RentalPage = () => {
    const [products, setProducts] = useState<Products[]>([]);
    const [productTypesWithFilters, setProductTypesWithFilters] = useState<ProductTypeWithFilters[]>([]);
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<number>(3);
    const [selectedProductFilterValueIds, setSelectedProductFilterValueIds] = useState<number[]>([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('sellingprice');

    // State quản lý số lượng sản phẩm
    const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        // Return json for product types with filters
        // const productTypesWithFilters = [
        //     {
        //         producttypeid: 1,
        //         producttypename: 'Sản phẩm 1',
        //         product_filter: [{ productfilterid: 1, productfiltername: 'Lọc theo danh mục', producttypeid: 1, product_filter_values: [{ productfiltervalueid: 1, value: 'Sản phẩm 1', productfilterid: 1 }] },
        //     },
        const loadFilters = async () => {
            const filtersResponse = await getRentFilters();
            if (filtersResponse.ok) {
                setProductTypesWithFilters(filtersResponse.data);
            }
        };

        loadFilters();
    }, []);

    // Fetch products when filters change
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
    }, [selectedProductTypeId, selectedProductFilterValueIds, sortBy, sortOrder]);

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

    const handleProductTypeChange = (productTypeId: number) => {
        setSelectedProductTypeId(productTypeId);
        setSelectedProductFilterValueIds([]);
    };

    const handleProductFilterValueChange = (productFilterValueIds: number[]) => {
        if (productFilterValueIds.length === 0) {
            // Clear all selections
            setSelectedProductFilterValueIds([]);
        } else if (selectedProductFilterValueIds.includes(productFilterValueIds[0])) {
            // If already selected, remove it
            setSelectedProductFilterValueIds(
                selectedProductFilterValueIds.filter((id) => id !== productFilterValueIds[0]),
            );
        } else {
            // Add new selection
            setSelectedProductFilterValueIds([...selectedProductFilterValueIds, ...productFilterValueIds]);
        }

        console.log(selectedProductFilterValueIds);
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

    return (
        <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row">
            <div className="flex flex-col gap-5">
                <ProductFilter
                    productTypesWithFilters={productTypesWithFilters}
                    onProductTypeChange={handleProductTypeChange}
                    onProductFilterValueChange={handleProductFilterValueChange}
                    selectedProductTypeId={selectedProductTypeId}
                    selectedProductFilterValueIds={selectedProductFilterValueIds}
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

export default RentalPage;
