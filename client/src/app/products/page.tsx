'use client';

import Filter, { FilterConfig } from '@/components/atomic/Filter';
import ProductList from '@/components/Booking/ProductList';
import { getProductFilters, getProducts } from '@/services/products.service';
import { ProductTypes, Products } from '@/types/types';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../../components/atomic/BottomSheet';
import { useBooking } from '@/context/BookingContext';

export interface SelectedProducts extends Products {
    quantity: number;
}

export interface ProductListItem extends Products {
    quantity: number;
}

const ProductPage = () => {
    const { selectedCourts, selectedProducts, TTL } = useBooking();
    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [productTypes, setProductTypes] = useState<ProductTypes[]>([]);
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<number>(1);
    const [selectedProductFilterValueIds, setSelectedProductFilterValueIds] = useState<number[]>([]);
    const [filters, setFilters] = useState<FilterConfig[]>([]);
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});

    useEffect(() => {
        const loadFilters = async () => {
            const filtersResponse = await getProductFilters();
            if (filtersResponse.ok) {
                setProductTypes(filtersResponse.data);

                // Create filter configurations
                const productTypeFilter: FilterConfig = {
                    filterid: 'productType',
                    filterlabel: 'Danh mục sản phẩm',
                    filtertype: 'checkbox',
                    filteroptions: filtersResponse.data.map((type: ProductTypes) => ({
                        optionlabel: type.producttypename,
                        optionvalue: type.producttypeid,
                    })),
                };

                setFilters([
                    { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
                    productTypeFilter,
                ]);

                // Set initial filter values
                setFilterValues({
                    productType: [1], // Default to first product type
                });
            }
        };

        loadFilters();
    }, []);

    // Update product filter options when product type changes
    useEffect(() => {
        if (productTypes.length > 0 && selectedProductTypeId) {
            const selectedProductType = productTypes.find((type) => type.producttypeid === selectedProductTypeId);

            if (selectedProductType?.product_filter?.[0]?.product_filter_values) {
                const productFilterValuesFilter: FilterConfig = {
                    filterid: 'productFilterValues',
                    filterlabel: selectedProductType.product_filter[0].productfiltername || 'Lọc theo danh mục',
                    filtertype: 'checkbox',
                    filteroptions: selectedProductType.product_filter[0].product_filter_values.map((value) => ({
                        optionlabel: value.value || '',
                        optionvalue: value.productfiltervalueid,
                    })),
                };

                setFilters((prev) => [
                    prev[0], // Keep selectedFilter
                    prev[1], // Keep productType filter
                    productFilterValuesFilter,
                ]);
            } else {
                // Remove product filter values if none available
                setFilters((prev) => prev.slice(0, 2));
            }
        }
    }, [selectedProductTypeId, productTypes]);

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

    const handleFilterChange = (filterid: string, value: any) => {
        setFilterValues((prev) => {
            const updated = { ...prev };

            if (filterid === 'productType') {
                // Handle product type selection
                const currentValues = Array.isArray(prev[filterid]) ? [...prev[filterid]] : [];
                const idx = currentValues.indexOf(value);

                if (idx > -1) {
                    currentValues.splice(idx, 1);
                } else {
                    // For product type, only allow single selection
                    updated[filterid] = [value];
                    setSelectedProductTypeId(value);
                    // Clear product filter values when changing product type
                    updated['productFilterValues'] = [];
                    setSelectedProductFilterValueIds([]);
                    return updated;
                }
                updated[filterid] = currentValues.length > 0 ? currentValues : [];

                if (currentValues.length > 0) {
                    setSelectedProductTypeId(currentValues[0]);
                }
            } else if (filterid === 'productFilterValues') {
                // Handle product filter values selection
                const currentValues = Array.isArray(prev[filterid]) ? [...prev[filterid]] : [];
                const idx = currentValues.indexOf(value);

                if (idx > -1) {
                    currentValues.splice(idx, 1);
                } else {
                    currentValues.push(value);
                }
                updated[filterid] = currentValues.length > 0 ? currentValues : [];
                setSelectedProductFilterValueIds(currentValues);
            }

            return updated;
        });
    };

    const handleRemoveFilter = (filterid: string, removeValue?: string | number) => {
        setFilterValues((prev) => {
            const updated = { ...prev };

            if (filterid === 'productType') {
                if (removeValue !== undefined) {
                    const arr = Array.isArray(prev[filterid]) ? [...prev[filterid]] : [];
                    const idx = arr.indexOf(removeValue);
                    if (idx > -1) {
                        arr.splice(idx, 1);
                    }
                    updated[filterid] = arr.length > 0 ? arr : [];

                    // Update selected product type
                    if (arr.length > 0) {
                        setSelectedProductTypeId(arr[0] as number);
                    }
                } else {
                    updated[filterid] = [];
                }
            } else if (filterid === 'productFilterValues') {
                if (removeValue !== undefined) {
                    const arr = Array.isArray(prev[filterid]) ? [...prev[filterid]] : [];
                    const idx = arr.indexOf(removeValue);
                    if (idx > -1) {
                        arr.splice(idx, 1);
                    }
                    updated[filterid] = arr.length > 0 ? arr : [];
                    setSelectedProductFilterValueIds(arr as number[]);
                } else {
                    updated[filterid] = [];
                    setSelectedProductFilterValueIds([]);
                }
            }

            return updated;
        });
    };

    const hasSelectedItems = (selectedCourts?.length > 0 || selectedProducts?.length > 0) ?? false;

    return (
        <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row">
            <div className="flex w-full flex-col sm:w-1/5">
                <Filter
                    filters={filters}
                    values={filterValues}
                    onRemoveFilter={handleRemoveFilter}
                    onChange={handleFilterChange}
                />
            </div>
            <ProductList products={products} selectedProducts={selectedProducts} />
            {hasSelectedItems && (
                <BookingBottomSheet selectedProducts={selectedProducts} selectedCourts={selectedCourts} TTL={TTL} />
            )}
        </div>
    );
};

export default ProductPage;
