'use client';

export type FilterState = {
    brands: string[];
    weights: string[];
    stiffness: string[];
    balance: string[];
    forms: string[];
    sizes: string[];
};

type Props = {
    selectedCategory: 'Thuê vợt' | 'Thuê giày';
    setSelectedCategory: (category: 'Thuê vợt' | 'Thuê giày') => void;
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
};


const brands = ['Yonex', 'Lining', 'Victor'];
const weights = ['2U: 90 - 94g', '3U: 85 - 89g', '4U: 80 - 84g', '5U: 75 - 79g'];
const stiffness = ['Dẻo', 'Trung bình', 'Cứng'];
const balancePoints = ['Nhẹ đầu', 'Cân bằng', 'Nặng đầu'];
const shoeForms = ['Unisex - Bản chân thường', 'Wide - Bản chân bè'];
const shoeSizes = ['38', '39', '40', '41', '42', '43', '44', '45'];

const RentalFilter = ({ selectedCategory, setSelectedCategory, filters, setFilters }: Props) => {
    const handleToggle = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => {
            const currentList = prev[key];
            const newList = currentList.includes(value)
                ? currentList.filter((item) => item !== value)
                : [...currentList, value];
            return { ...prev, [key]: newList };
        });
    };

    const clearAll = () => {
        setFilters({
            brands: [],
            weights: [],
            stiffness: [],
            balance: [],
            forms: [],
            sizes: [],
        });
    };

    return (
        <div className="w-full space-y-4">
            {/* PHẦN 1: Danh mục sản phẩm */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
                <h3 className="border-b pb-1 text-sm font-semibold">Danh mục sản phẩm</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li
                        onClick={() => setSelectedCategory('Thuê vợt')}
                        className={`cursor-pointer ${selectedCategory === 'Thuê vợt' ? 'text-primary-600 font-semibold' : ''}`}
                    >
                        Thuê vợt
                    </li>
                    <li
                        onClick={() => setSelectedCategory('Thuê giày')}
                        className={`cursor-pointer ${selectedCategory === 'Thuê giày' ? 'text-primary-600 font-semibold' : ''}`}
                    >
                        Thuê giày
                    </li>
                </ul>
            </div>

            {/* PHẦN 2: Bộ lọc */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
                {/* Bộ lọc đã chọn */}
                <div className="mb-4 border-b pb-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-primary-600 text-sm font-semibold">Bạn chọn</h3>
                        <button onClick={clearAll} className="text-xs text-gray-500 hover:underline">
                            Bỏ hết X
                        </button>
                    </div>
                    <div className="mt-2 min-h-[24px] flex flex-wrap gap-2 text-xs">
                        {filters.brands.map((item) => (
                            <span key={item} className="text-primary-600 rounded bg-green-100 px-2 py-1">{item}</span>
                        ))}
                        {selectedCategory === 'Thuê vợt' && (
                            <>
                                {filters.weights.map((item) => (
                                    <span key={item} className="text-primary-600 rounded bg-green-100 px-2 py-1">{item}</span>
                                ))}
                                {filters.stiffness.map((item) => (
                                    <span key={item} className="text-primary-600 rounded bg-green-100 px-2 py-1">{item}</span>
                                ))}
                                {filters.balance.map((item) => (
                                    <span key={item} className="text-primary-600 rounded bg-green-100 px-2 py-1">{item}</span>
                                ))}
                            </>
                        )}
                        {selectedCategory === 'Thuê giày' && (
                            <>
                                {filters.forms.map((item) => (
                                    <span key={item} className="text-primary-600 rounded bg-green-100 px-2 py-1">{item}</span>
                                ))}
                                {filters.sizes.map((item) => (
                                    <span key={item} className="text-primary-600 rounded bg-green-100 px-2 py-1">{item}</span>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Filter Sections */}
                <div className="space-y-4 text-sm">
                    {/* Thương hiệu */}
                    <div className="border-b pb-3">
                        <h3 className="mb-2 font-semibold">THƯƠNG HIỆU</h3>
                        {brands.map((brand) => (
                            <label key={brand} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filters.brands.includes(brand)}
                                    onChange={() => handleToggle('brands', brand)}
                                />
                                <span>{brand}</span>
                            </label>
                        ))}
                    </div>

                    {selectedCategory === 'Thuê vợt' ? (
                        <>
                            {/* Trọng lượng */}
                            <div className="border-b pb-3">
                                <h3 className="mb-2 font-semibold">TRỌNG LƯỢNG</h3>
                                {weights.map((item) => (
                                    <label key={item} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.weights.includes(item)}
                                            onChange={() => handleToggle('weights', item)}
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Độ cứng đũa */}
                            <div className="border-b pb-3">
                                <h3 className="mb-2 font-semibold">ĐỘ CỨNG ĐŨA</h3>
                                {stiffness.map((item) => (
                                    <label key={item} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.stiffness.includes(item)}
                                            onChange={() => handleToggle('stiffness', item)}
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Điểm cân bằng */}
                            <div>
                                <h3 className="mb-2 font-semibold">ĐIỂM CÂN BẰNG</h3>
                                {balancePoints.map((item) => (
                                    <label key={item} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.balance.includes(item)}
                                            onChange={() => handleToggle('balance', item)}
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Form giày */}
                            <div className="border-b pb-3">
                                <h3 className="mb-2 font-semibold">FORM GIÀY</h3>
                                {shoeForms.map((item) => (
                                    <label key={item} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.forms.includes(item)}
                                            onChange={() => handleToggle('forms', item)}
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Size giày */}
                            <div>
                                <h3 className="mb-2 font-semibold">SIZE GIÀY</h3>
                                {shoeSizes.map((item) => (
                                    <label key={item} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.sizes.includes(item)}
                                            onChange={() => handleToggle('sizes', item)}
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RentalFilter;
