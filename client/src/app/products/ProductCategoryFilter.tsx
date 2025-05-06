import { ProductTypes } from '@/types/types';

interface ProductFilterProps {
    chosenProductCategoryId: number;
    productCategories: ProductTypes[];
    onCategoryFilterChange: (categoryId: number) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
    chosenProductCategoryId,
    productCategories,
    onCategoryFilterChange,
}) => {
    return (
        <>
            {productCategories && productCategories.length > 0 && (
                <div className="border-grey-200 flex h-full max-w-sm min-w-3xs flex-col gap-5 rounded-lg border-2 p-4">
                    <div className="flex flex-col gap-5">
                        <div className="border-b-2 border-gray-800 pb-1">
                            <h2 className="text-lg font-semibold">Loại sản phẩm</h2>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div
                                key={0}
                                className={`text-md hover:text-primary cursor-pointer pl-2 ${0 === chosenProductCategoryId ? 'text-primary' : ''}`}
                                onClick={() => onCategoryFilterChange(0)}
                            >
                                Tất cả
                            </div>
                            {productCategories.map((category) => (
                                <div
                                    key={category.producttypeid}
                                    className={`text-md hover:text-primary cursor-pointer pl-2 ${category.producttypeid === chosenProductCategoryId ? 'text-primary' : ''}`}
                                    onClick={() => onCategoryFilterChange(category.producttypeid)}
                                >
                                    {category.producttypename}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductFilter;
