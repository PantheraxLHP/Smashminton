'use client';

import Filter, { FilterConfig } from '@/components/atomic/Filter';
import RentalList from '@/components/Booking/RentalList';
import { useBooking } from '@/context/BookingContext';
import { getProducts, getRentalFilters } from '@/services/products.service';
import { ProductTypes, Products } from '@/types/types';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../../components/atomic/BottomSheet';

export interface SelectedProducts extends Products {
    quantity: number;
}
export interface RentalListItem extends Products {
    quantity: number;
}

const RentalPage = () => {
    const { selectedCourts, selectedProducts, TTL } = useBooking();
    const bookingDates = Array.from(
        new Set(
            (selectedCourts ?? []).map((court) => court.date).filter(Boolean), // remove undefined/null
        ),
    );

    const [products, setProducts] = useState<RentalListItem[]>([]);
    const [productTypes, setProductTypes] = useState<ProductTypes[]>([]);
    const [selectedProductTypeId, setSelectedProductTypeId] = useState<number>(3); // Default to "Thuê vợt"
    const [selectedProductFilterValueIds, setSelectedProductFilterValueIds] = useState<number[]>([]);

    const [filters, setFilters] = useState<FilterConfig[]>([]);
    const [filterValues, setFilterValues] = useState<Record<string, any>>({
        selectedDate: bookingDates[0],
        productType: [3], // Default to "Thuê vợt"
        productFilterValues: [],
    });

    useEffect(() => {
        const loadFilters = async () => {
            const filtersResponse = await getRentalFilters();
            if (filtersResponse.ok) {
                setProductTypes(filtersResponse.data);

                // Create filter configurations
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
        if (productTypes.length > 0 && selectedProductTypeId) {
            const selectedProductType = productTypes.find((type) => type.producttypeid === selectedProductTypeId);

            if (selectedProductType?.product_filter?.[0]?.product_filter_values) {
                const productFilterValuesFilter: FilterConfig = {
                    filterid: 'productFilterValues',
                    filterlabel: selectedProductType.product_filter[0].productfiltername || 'Lọc sản phẩm',
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

    // Enhanced filter values change handler to sync with business logic
    const handleFilterValuesChange = (updatedValues: Record<string, any>) => {
        setFilterValues(updatedValues);

        // Handle product type changes
        if (updatedValues.productType && Array.isArray(updatedValues.productType)) {
            const newProductTypeId = updatedValues.productType[0];
            if (newProductTypeId && newProductTypeId !== selectedProductTypeId) {
                setSelectedProductTypeId(newProductTypeId);
                // Clear product filter values when changing product type
                setSelectedProductFilterValueIds([]);
            } else if (updatedValues.productType.length === 0) {
                // If no product type selected, reset to default
                setSelectedProductTypeId(3);
                setSelectedProductFilterValueIds([]);
            }
        }

        // Handle product filter values changes
        if (updatedValues.productFilterValues && Array.isArray(updatedValues.productFilterValues)) {
            setSelectedProductFilterValueIds(updatedValues.productFilterValues);
        } else if (updatedValues.productFilterValues === undefined || updatedValues.productFilterValues?.length === 0) {
            setSelectedProductFilterValueIds([]);
        }
    };

    // Load products whenever filter selections change
    useEffect(() => {
        const loadProducts = async () => {
            // Only load if we have a valid product type
            if (selectedProductTypeId) {
                const productsResponse = await getProducts(
                    selectedProductTypeId,
                    selectedProductFilterValueIds.length > 0 ? selectedProductFilterValueIds : undefined,
                );

                if (productsResponse.ok) {
                    setProducts(productsResponse.data);
                }
            }
        };

        loadProducts();
    }, [selectedProductTypeId, selectedProductFilterValueIds]);

    // Also refetch when filter values change (for cases where state updates might be missed)
    useEffect(() => {
        const productTypeFromFilter = filterValues.productType;
        const productFilterValuesFromFilter = filterValues.productFilterValues;

        // Sync selectedProductTypeId with filter values
        if (productTypeFromFilter && Array.isArray(productTypeFromFilter) && productTypeFromFilter.length > 0) {
            const filterProductTypeId = productTypeFromFilter[0];
            if (filterProductTypeId !== selectedProductTypeId) {
                setSelectedProductTypeId(filterProductTypeId);
            }
        }

        // Sync selectedProductFilterValueIds with filter values
        if (productFilterValuesFromFilter && Array.isArray(productFilterValuesFromFilter)) {
            const filterValueIds = productFilterValuesFromFilter;
            if (JSON.stringify(filterValueIds) !== JSON.stringify(selectedProductFilterValueIds)) {
                setSelectedProductFilterValueIds(filterValueIds);
            }
        } else if (!productFilterValuesFromFilter && selectedProductFilterValueIds.length > 0) {
            setSelectedProductFilterValueIds([]);
        }
    }, [filterValues.productType, filterValues.productFilterValues]);

    const hasSelectedItems = (selectedCourts?.length > 0 || selectedProducts?.length > 0) ?? false;

    return (
        <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row">
            <div className="flex w-full flex-col sm:w-1/5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="date-booking" className="text-sm font-bold">
                        Ngày nhận
                    </label>
                    <select
                        id="date-booking"
                        className="w-full rounded-md border border-gray-300 p-2 text-sm placeholder:text-gray-500"
                        value={filterValues.selectedDate || (bookingDates[0] ?? '')}
                        onChange={(e) => {
                            const selected = e.target.value;
                            setFilterValues((prev) => ({
                                ...prev,
                                selectedDate: selected,
                            }));
                        }}
                    >
                        {bookingDates.map((date) => (
                            <option key={date} value={date}>
                                {date}
                            </option>
                        ))}
                    </select>
                </div>

                <Filter filters={filters} values={filterValues} setFilterValues={handleFilterValuesChange} />
            </div>
            <RentalList
                products={products}
                selectedProducts={selectedProducts}
                returnDate={filterValues.selectedDate}
            />
            {hasSelectedItems && (
                <BookingBottomSheet selectedProducts={selectedProducts} selectedCourts={selectedCourts} TTL={TTL} />
            )}
        </div>
    );
};

export default RentalPage;
