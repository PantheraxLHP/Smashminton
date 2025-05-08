interface ProductTypeFilterProps {
    chosenProductTypeId: number;
    onTypeFilterChange: (typeId: number) => void;
}

const ProductTypeFilter: React.FC<ProductTypeFilterProps> = ({
    chosenProductTypeId,
    onTypeFilterChange,
}) => {
    const productTypeCategories = [
        { id: 1, name: "Đồ ăn - Thức uống" },
        { id: 2, name: "Phụ kiện cầu lông" },
    ];

    return (
        <div>
            <div className="min-w-3xs max-w-sm p-4 border-2 border-gray-200 rounded-lg flex flex-col gap-5">
                <div className="pb-1 border-gray-800 border-b-2">
                    <h2 className="text-lg font-semibold ">Danh mục sản phẩm</h2>
                </div>
                <div className="flex flex-col gap-5">
                    {productTypeCategories.map((type) => (
                        <div
                            key={type.id}
                            className={`pl-2 text-md cursor-pointer hover:text-primary ${type.id === chosenProductTypeId ? "text-primary" : ""}`}
                            onClick={() => onTypeFilterChange(type.id)}
                        >
                            {type.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default ProductTypeFilter;