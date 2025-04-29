

const ProductTypeFilter = () => {
    const productTypeCategories = [
        { id: 1, name: "Đồ ăn - Thức uống" },
        { id: 2, name: "Phụ kiện cầu lông" },
    ];

    return (
        <div>
            <div className="min-w-3xs max-w-sm p-4 border-2 border-grey-200 rounded-lg flex flex-col gap-5">
                <div className="pb-1 border-gray-800 border-b-2">
                    <h2 className="text-lg font-semibold ">Danh mục sản phẩm</h2>
                </div>
                <div className="flex flex-col gap-5">
                    {productTypeCategories.map((category) => (
                        <div key={category.id} className="text-md cursor-pointer hover:text-primary">
                            {category.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default ProductTypeFilter;