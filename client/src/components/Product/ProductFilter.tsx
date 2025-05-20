import { ProductFilterValues, ProductTypes } from '@/types/types';
import { useState, useEffect } from 'react';

interface ProductFilterProps {
    productTypes: ProductTypes[];
    onProductTypeChange: (productTypeId: number) => void;
    onProductFilterValueChange: (productFilterValueIds: number[]) => void;
    selectedProductTypeId: number;
    selectedProductFilterValueIds: number[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({
    productTypes,
    onProductTypeChange,
    onProductFilterValueChange,
    selectedProductTypeId,
    selectedProductFilterValueIds,
}) => {
    const [productFilterValues, setProductFilterValues] = useState<ProductFilterValues[]>([]);

    useEffect(() => {
        // Find the selected product type
        const selectedProductType = productTypes.find((type) => type.producttypeid === selectedProductTypeId);

        // Get filter values for the selected type
        if (
            selectedProductType &&
            selectedProductType.product_filter &&
            selectedProductType.product_filter.length > 0
        ) {
            setProductFilterValues(selectedProductType.product_filter[0].product_filter_values || []);
        } else {
            setProductFilterValues([]);
        }
    }, [selectedProductTypeId, productTypes]);

    return (
        <div className="flex flex-col gap-4">
            {/* Product Type Filter */}
            <div className="flex max-w-sm min-w-3xs flex-col gap-5 rounded-lg border-2 border-gray-200 p-4">
                <div className="border-b-2 border-gray-800 pb-1">
                    <h2 className="text-lg font-semibold">Danh mục sản phẩm</h2>
                </div>
                <div className="flex flex-col gap-5">
                    {productTypes.map((productType) => (
                        <div
                            key={productType.producttypeid}
                            className={`text-md hover:text-primary cursor-pointer pl-2 ${productType.producttypeid === selectedProductTypeId ? 'text-primary' : ''}`}
                            onClick={() => onProductTypeChange(productType.producttypeid)}
                        >
                            {productType.producttypename}
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Filter Value With Checkbox */}
            {productFilterValues.length > 0 && (
                <div className="flex w-full max-w-sm flex-col gap-5 rounded-lg border-2 border-gray-200 p-4">
                    {selectedProductFilterValueIds.length > 0 && (
                        <div className="flex flex-col gap-3 border-b-2 border-gray-200 pb-3">
                            <div className="flex w-full items-center justify-between">
                                <span className="text-lg font-semibold">Bạn chọn</span>
                                <button
                                    className="text-sm font-medium text-red-700 hover:text-red-800"
                                    onClick={() => onProductFilterValueChange([])}
                                >
                                    Xoá hết
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedProductFilterValueIds.map((selectedId) => {
                                    const selectedValue = productFilterValues.find(
                                        (val) => val.productfiltervalueid === selectedId,
                                    );
                                    return selectedValue ? (
                                        <div
                                            key={selectedId}
                                            className="bg-primary-50 inline-flex items-center rounded-md px-3 py-1.5"
                                        >
                                            <span className="text-sm font-medium">{selectedValue.value}</span>
                                            <button
                                                className="text-primary-600 hover:text-primary-800 ml-2 text-lg leading-none"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onProductFilterValueChange([selectedId]);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
                    <div className="border-b-2 border-gray-800 pb-2">
                        <h2 className="text-lg font-semibold">
                            {productTypes.find((val) => val.producttypeid === selectedProductTypeId)
                                ?.product_filter?.[0]?.productfiltername ?? 'Lọc theo danh mục'}
                        </h2>
                    </div>
                    <div className="flex flex-col gap-3">
                        {productFilterValues.map((productFilterValue) => (
                            <div
                                key={productFilterValue.productfiltervalueid}
                                className="hover:text-primary flex cursor-pointer items-center"
                                onClick={() => {
                                    onProductFilterValueChange([productFilterValue.productfiltervalueid]);
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedProductFilterValueIds.includes(
                                        productFilterValue.productfiltervalueid,
                                    )}
                                    className="text-primary focus:ring-primary mr-3 h-4 w-4 rounded border-gray-300"
                                    readOnly
                                />
                                <span
                                    className={`text-sm ${selectedProductFilterValueIds.includes(productFilterValue.productfiltervalueid) ? 'text-primary font-medium' : ''}`}
                                >
                                    {productFilterValue.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFilter;
