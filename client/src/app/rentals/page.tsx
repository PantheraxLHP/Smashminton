'use client';

import Filter, { FilterConfig } from '@/components/atomic/Filter';
import RentalList from '@/components/Booking/RentalList';
import { useBooking } from '@/context/BookingContext';
import { getProducts, getRentalFilters } from '@/services/products.service';
import { ProductTypes, Products } from '@/types/types';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../../components/atomic/BottomSheet';

export interface RentalListItem extends Products {
    quantity: number;
}

const RentalPage = () => {
    const { selectedCourts, selectedProducts, TTL } = useBooking();
    const bookingDates = Array.from(
        new Set(
            (selectedCourts ?? []).map((court) => court.date).filter(Boolean), // Ensure we only include valid dates
        ),
    );

    const [products, setProducts] = useState<RentalListItem[]>([]);
    const [productTypes, setProductTypes] = useState<ProductTypes[]>([]);
    const [filters, setFilters] = useState<FilterConfig[]>([]);
    const [filterValues, setFilterValues] = useState<Record<string, any>>({
        selectedDate: bookingDates[0],
        productType: [3], // Default to "Thuê vợt"
        productFilterValues: [],
    });

    // Load filter configs and product types
    useEffect(() => {
        const loadFilters = async () => {
            const filtersResponse = await getRentalFilters();
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
        if (productTypes.length > 0 && filterValues.productType && filterValues.productType.length > 0) {
            const selectedProductTypeId = filterValues.productType[0];
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
                // Add product filter values filter to the filters array
                setFilters((prev) => [prev[0], prev[1], productFilterValuesFilter]);
            } else {
                // Remove product filter values filter if no product type is selected
                setFilters((prev) => prev.slice(0, 2));
            }
        }
    }, [filterValues.productType, productTypes]);

    // Fetch products when filter values change
    useEffect(() => {
        const loadProducts = async () => {
            const selectedProductTypeId = filterValues.productType?.[0];
            const selectedProductFilterValueIds = filterValues.productFilterValues || [];
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

                <Filter filters={filters} values={filterValues} setFilterValues={setFilterValues} />
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
