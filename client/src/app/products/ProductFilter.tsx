const ProductFilter = () => {
    const foodCategories = [
        { id: 1, name: "Tất cả" },
        { id: 2, name: "Đồ mặn" },
        { id: 3, name: "Snack" },
        { id: 4, name: "Nước uống" },
    ]

    return (
        <div className="min-w-3xs max-w-sm p-4 border-2 border-grey-200 rounded-lg flex flex-col gap-5 h-full">
            <div className="pb-1 border-gray-800 border-b-2">
                <h2 className="text-lg font-semibold ">Loại sản phẩm</h2>
            </div>
            <div className="flex flex-col gap-5">
                {foodCategories.map((category) => (
                    <div key={category.id} className="text-md cursor-pointer hover:text-primary">
                        {category.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductFilter;