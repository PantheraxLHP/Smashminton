'use client';

import Filter, { FilterConfig } from '@/components/atomic/Filter';
import ProductList from '@/components/Booking/ProductList';
import { useBooking } from '@/context/BookingContext';
import { getProductFilters, getProducts } from '@/services/products.service';
import { ProductTypes, Products } from '@/types/types';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../../components/atomic/BottomSheet';

export interface ProductListItem extends Products {
    quantity: number;
}

const ProductsPage = () => {
    const { selectedCourts, selectedProducts, TTL } = useBooking();

    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [productTypes, setProductTypes] = useState<ProductTypes[]>([]);
    const [filters, setFilters] = useState<FilterConfig[]>([]);
    const [filterValues, setFilterValues] = useState<Record<string, any>>({
        productType: [1], // Default to "Đồ ăn thức uống"
    });

    // Load filter configs and product types
    useEffect(() => {
        const loadFilters = async () => {
            const filtersResponse = await getProductFilters();
            if (filtersResponse.ok) {
                setProductTypes(filtersResponse.data);

                const productTypeFilter: FilterConfig = {
                    filterid: 'productType',
                    filterlabel: 'Danh mục sản phẩm',
                    filtertype: 'radio',
                    filteroptions: filtersResponse.data.map((type: ProductTypes) => ({
                        optionlabel: type.producttypename || '',
                        optionvalue: type.producttypeid,
                    })),
                };

                setFilters([
                    { filterid: 'selectedFilter', filterlabel: 'selectedFilter', filtertype: 'selectedFilter' },
                    productTypeFilter,
                ]);
            }
        };
        loadFilters();
    }, []);

    // Update product filter options when product type changes
    useEffect(() => {
        const baseFilters = filters.filter(filter =>
            filter.filterid === 'selectedFilter' || filter.filterid === 'productType'
        );

        if (baseFilters.length !== 2) return;

        const selectedProductTypeId = filterValues.productType?.[0];
        const selectedProductType = productTypes.find(type =>
            type.producttypeid === selectedProductTypeId
        );

        const hasFilterValues = selectedProductType?.product_filter?.[0]?.product_filter_values;

        if (hasFilterValues) {
            const productFilterValuesFilter: FilterConfig = {
                filterid: 'productFilterValues',
                filterlabel: selectedProductType?.product_filter?.[0].productfiltername || 'Lọc sản phẩm',
                filtertype: 'checkbox',
                filteroptions: selectedProductType?.product_filter?.[0]?.product_filter_values?.map(value => ({
                    optionlabel: value.value || '',
                    optionvalue: value.productfiltervalueid,
                })),
            };
            setFilters([...baseFilters, productFilterValuesFilter]);
        } else {
            setFilters(baseFilters);
        }
    }, [filterValues, productTypes]);

    // Fetch products when filter values change
    useEffect(() => {
        const loadProducts = async () => {
            const selectedProductTypeId = filterValues.productType?.[0];
            const selectedProductFilterValueIds = filterValues.productFilterValues || [];

            if (!selectedProductTypeId) {
                setProducts([]);
                return;
            }

            const productsResponse = await getProducts(
                selectedProductTypeId,
                selectedProductFilterValueIds.length > 0 ? selectedProductFilterValueIds : undefined,
            );

            if (productsResponse.ok) {
                setProducts(productsResponse.data);
            }
        };

        loadProducts();
    }, [filterValues]);

    const hasSelectedItems = (selectedCourts?.length > 0 || selectedProducts?.length > 0) ?? false;

    const handleFilterChange = (filterid: string, value: any) => {
        const type = filters.find((f) => f.filterid === filterid)?.filtertype;
        setFilterValues((prev) => {
            const updated = { ...prev };
            if (type === 'search' || type === 'range' || type === 'monthyear') {
                updated[filterid] = value;
            } else if (type === 'checkbox') {
                const arr = Array.isArray(prev[filterid]) ? [...prev[filterid]] : [];
                const idx = arr.indexOf(value);
                if (idx > -1) {
                    arr.splice(idx, 1);
                } else {
                    arr.push(value);
                }
                updated[filterid] = arr;
            } else if (type === 'radio') {
                updated[filterid] = [value];
                if (updated["productFilterValues"] !== undefined) {
                    updated["productFilterValues"] = undefined;
                }
            }
            return updated;
        });
    };

    return (
        <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row">
            <div className="flex w-full flex-col sm:w-1/5">
                <Filter
                    filters={filters}
                    values={filterValues}
                    setFilterValues={setFilterValues}
                    onFilterChange={handleFilterChange}
                />
            </div>
            <ProductList products={products} selectedProducts={selectedProducts} />
            {hasSelectedItems && (
                <BookingBottomSheet selectedProducts={selectedProducts} selectedCourts={selectedCourts} TTL={TTL} />
            )}
        </div>
    );
};

export default ProductsPage;
