import { useState, useEffect } from 'react';

interface ProductFilterValue {
    productfiltervalueid: number;
    value: string;
    productfilterid: number;
}

interface ProductFilterData {
    productfilterid: number;
    productfiltername: string;
    producttypeid: number;
    product_filter_values: ProductFilterValue[];
}

interface ProductTypeWithFilters {
    producttypeid: number;
    producttypename: string;
    product_filter?: ProductFilterData[];
}

interface ProductFilterProps {
    productTypes: ProductTypeWithFilters[];
    onTypeFilterChange: (typeId: number) => void;
    onCategoryFilterChange: (categoryId: number) => void;
    selectedTypeId: number;
    selectedCategoryId: number;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
    productTypes,
    onTypeFilterChange,
    onCategoryFilterChange,
    selectedTypeId,
    selectedCategoryId,
}) => {
    const [filterValues, setFilterValues] = useState<ProductFilterValue[]>([]);

    useEffect(() => {
        // Find the selected product type
        const selectedType = productTypes.find((type) => type.producttypeid === selectedTypeId);

        // Get filter values for the selected type
        if (selectedType && selectedType.product_filter && selectedType.product_filter.length > 0) {
            setFilterValues(selectedType.product_filter[0].product_filter_values);
        } else {
            setFilterValues([]);
        }
    }, [selectedTypeId, productTypes]);

    return (
        <div className="flex flex-col gap-4">
            {/* Product Type Filter */}
            <div className="flex max-w-sm min-w-3xs flex-col gap-5 rounded-lg border-2 border-gray-200 p-4">
                <div className="border-b-2 border-gray-800 pb-1">
                    <h2 className="text-lg font-semibold">Danh mục sản phẩm</h2>
                </div>
                <div className="flex flex-col gap-5">
                    {productTypes.map((type) => (
                        <div
                            key={type.producttypeid}
                            className={`text-md hover:text-primary cursor-pointer pl-2 ${type.producttypeid === selectedTypeId ? 'text-primary' : ''}`}
                            onClick={() => onTypeFilterChange(type.producttypeid)}
                        >
                            {type.producttypename}
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Category Filter */}
            {filterValues.length > 0 && (
                <div className="flex max-w-sm min-w-3xs flex-col gap-5 rounded-lg border-2 border-gray-200 p-4">
                    <div className="border-b-2 border-gray-800 pb-1">
                        <h2 className="text-lg font-semibold">Loại sản phẩm</h2>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div
                            key={0}
                            className={`text-md hover:text-primary cursor-pointer pl-2 ${0 === selectedCategoryId ? 'text-primary' : ''}`}
                            onClick={() => onCategoryFilterChange(0)}
                        >
                            Tất cả
                        </div>
                        {filterValues.map((filterValue) => (
                            <div
                                key={filterValue.productfiltervalueid}
                                className={`text-md hover:text-primary cursor-pointer pl-2 ${filterValue.productfiltervalueid === selectedCategoryId ? 'text-primary' : ''}`}
                                onClick={() => onCategoryFilterChange(filterValue.productfiltervalueid)}
                            >
                                {filterValue.value}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFilter;
