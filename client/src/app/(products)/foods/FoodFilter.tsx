const FoodFilter = () => {
    const foodCategories = [
        { id: 1, name: "Tất cả" },
        { id: 2, name: "Đồ mặn"},
        { id: 3, name: "Snack" },
        { id: 4, name: "Nước uống" },
    ]

    return (
        <div className="min-w-3xs max-w-sm p-4 border-2 border-grey-200 rounded-lg flex flex-col gap-5">
            <div className="pb-1 border-gray-800 border-b-2">
                <h2 className="text-lg font-semibold ">Danh mục sản phẩm</h2>
            </div>
            <ul className="space-y-5">
                {foodCategories.map((category) => (
                    <li key={category.id} className="text-md cursor-pointer hover:text-primary">
                        {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FoodFilter;