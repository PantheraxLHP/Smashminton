'use client';

import Filter, { FilterConfig } from '@/components/atomic/Filter';
import RentalList from '@/components/Booking/RentalList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBooking } from '@/context/BookingContext';
import { getProducts, getRentalFilters } from '@/services/products.service';
import { ProductTypes, Products } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../../components/atomic/BottomSheet';

export interface RentalListItem extends Products {
    quantity: number;
}

function formatDateDMY(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

const RentalPage = () => {
    const router = useRouter();
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
        const baseFilters = filters.filter(
            (filter) => filter.filterid === 'selectedFilter' || filter.filterid === 'productType',
        );

        if (baseFilters.length !== 2) return;

        const selectedProductTypeId = filterValues.productType?.[0];
        const selectedProductType = productTypes.find((type) => type.producttypeid === selectedProductTypeId);

        const hasFilterValues = selectedProductType?.product_filter?.[0]?.product_filter_values;

        if (hasFilterValues) {
            const productFilterValuesFilter: FilterConfig = {
                filterid: 'productFilterValues',
                filterlabel: selectedProductType?.product_filter?.[0].productfiltername || 'Lọc sản phẩm',
                filtertype: 'checkbox',
                filteroptions: selectedProductType?.product_filter?.[0]?.product_filter_values?.map((value) => ({
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
                if (updated['productFilterValues'] !== undefined) {
                    updated['productFilterValues'] = undefined;
                }
            }
            return updated;
        });
    };

    const handleConfirm = () => {
        // Redirect to payment page when confirming booking
        router.push('/booking/payment');
    };

    return (
        <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row">
            <div className="flex w-full flex-col gap-4 sm:w-1/5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="date-booking" className="text-sm font-bold">
                        Ngày nhận
                    </label>
                    {bookingDates.length > 0 ? (
                        <Select
                            value={String(filterValues.selectedDate ?? bookingDates[0] ?? '')}
                            onValueChange={(selected) => {
                                setFilterValues((prev) => ({
                                    ...prev,
                                    selectedDate: selected,
                                }));
                            }}
                        >
                            <SelectTrigger
                                id="date-booking"
                                className="w-full rounded-md border border-gray-500 p-2 text-sm placeholder:text-gray-500"
                            >
                                <SelectValue placeholder="Chọn ngày nhận" />
                            </SelectTrigger>
                            <SelectContent>
                                {bookingDates.map((date) => (
                                    <SelectItem key={date} value={date || ''}>
                                        {formatDateDMY(date || '')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Select value="" disabled>
                            <SelectTrigger
                                id="date-booking"
                                className="w-full rounded-md border border-gray-300 p-2 text-sm placeholder:text-gray-500"
                            >
                                <SelectValue placeholder="Chọn ngày nhận" />
                            </SelectTrigger>
                            <SelectContent />
                        </Select>
                    )}
                </div>

                <Filter
                    filters={filters}
                    values={filterValues}
                    setFilterValues={setFilterValues}
                    onFilterChange={handleFilterChange}
                />
            </div>
            <RentalList
                products={products}
                selectedProducts={selectedProducts}
                returnDate={filterValues.selectedDate}
            />
            {hasSelectedItems && (
                <BookingBottomSheet
                    selectedProducts={selectedProducts}
                    selectedCourts={selectedCourts}
                    TTL={TTL}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
};

export default RentalPage;
