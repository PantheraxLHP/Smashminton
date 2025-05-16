import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Products } from '@/types/types';
import { Icon } from '@iconify/react';
import Image from 'next/image';

interface ProductListProps {
    products: Products[];
    productQuantities: { [key: number]: number };
    onIncrement: (productid: number) => void;
    onDecrement: (productid: number) => void;
    sortBy: string;
    sortOrder: string;
    onSortOrderChange: (orderBy: string, sortBy: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    productQuantities,
    onIncrement,
    onDecrement,
    sortBy,
    sortOrder,
    onSortOrderChange,
}) => {
    return (
        <div className="flex w-full flex-col gap-2 p-4">
            <div className="flex justify-end gap-2">
                <div className="text-md flex items-center gap-2 font-semibold">
                    <Icon icon="lucide:sort-desc" className="text-xl" />
                    Sắp xếp
                </div>
                <div>
                    <Select
                        defaultValue={sortBy + '-' + sortOrder}
                        onValueChange={(value) => {
                            const [sortBy, sortOrder] = value.split('-');
                            onSortOrderChange(sortBy, sortOrder);
                        }}
                    >
                        <SelectTrigger className="border-2 bg-transparent focus:ring-0">
                            <SelectValue placeholder="Mặc định" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sellingprice-asc">Giá tăng dần</SelectItem>
                            <SelectItem value="sellingprice-desc">Giá giảm dần</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-15 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.map((item) => (
                    <div key={item.productid} className="">
                        <Image
                            src={item.productimgurl || '/default-image.jpg'}
                            alt={item.productname || 'Hình ảnh sản phẩm'}
                            width={300}
                            height={200}
                            className="w-full object-cover"
                        />
                        <h3 className="text-md font-semibold">{item.productname}</h3>
                        <div className="flex items-center justify-between">
                            <p className="text-primary-600 font-bold">{item.sellingprice?.toLocaleString()} đ</p>
                            <div className="flex items-center">
                                <button
                                    className="bg-primary-50 active:bg-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded"
                                    onClick={() => onDecrement(item.productid)}
                                >
                                    <Icon
                                        icon="ic:baseline-minus"
                                        className="text-lg text-gray-500 active:text-white"
                                    />
                                </button>
                                <span className="mx-4 text-lg">{productQuantities[item.productid]}</span>
                                <button
                                    className="bg-primary-50 active:bg-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded"
                                    onClick={() => onIncrement(item.productid)}
                                >
                                    <Icon icon="ic:baseline-plus" className="text-lg text-gray-500 active:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
