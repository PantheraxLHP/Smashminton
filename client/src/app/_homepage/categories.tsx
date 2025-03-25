import { ArrowDownLeft, Footprints, GlassWater, GripVertical, Search, ShoppingBag } from 'lucide-react';

const categories = [
    { title: 'Thuê vợt', icon: Search, desc: 'Vợt chất lượng cao từ nhiều thương hiệu' },
    { title: 'Thuê giày', icon: Footprints, desc: 'Giày thể thao chuyên dụng nhiều size' },
    { title: 'Túi đựng giày', icon: ShoppingBag, desc: 'Bảo vệ giày khi di chuyển' },
    { title: 'Đồ ăn & nước', icon: GlassWater, desc: 'Đồ uống và thực phẩm dinh dưỡng' },
    { title: 'Quả cầu', icon: ArrowDownLeft, desc: 'Cầu lông đạt tiêu chuẩn thi đấu' },
    { title: 'Phụ kiện', icon: GripVertical, desc: 'Băng, grip và các phụ kiện khác' },
];

const Categories = () => {
    return (
        <div className="min-h-[400px] p-4">
            <div className="container mx-auto">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 md:text-3xl">Danh mục sản phẩm - dịch vụ</h3>
                </div>

                <div className="flex items-center justify-center py-16">
                    <div className="grid max-w-[900px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((item, index) => (
                            <div
                                key={index}
                                className={`group flex aspect-square flex-col items-center justify-center p-8 ${
                                    index % 2 === 1 ? 'bg-gray-100' : 'bg-white'
                                } hover:bg-primary-500 transition-all duration-100 ease-in-out`}
                            >
                                <item.icon className="text-primary-600 mb-4 h-16 w-16 duration-200 group-hover:-translate-y-2 group-hover:text-white" />
                                <h4 className="text-lg font-semibold text-gray-800 duration-200 group-hover:-translate-y-2 group-hover:text-white">
                                    {item.title}
                                </h4>
                                <p className="mt-2 text-center text-gray-600 duration-200 group-hover:-translate-y-2 group-hover:text-white">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Categories;
