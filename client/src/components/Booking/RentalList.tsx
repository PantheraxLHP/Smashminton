import { SelectedProducts } from '@/app/products/page';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBooking } from '@/context/BookingContext';
import { Products } from '@/types/types';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useState } from 'react';

interface RentalListProps {
    products: Products[];
    selectedProducts: SelectedProducts[];
}

const RentalList: React.FC<RentalListProps> = ({ products, selectedProducts }) => {
    const { addProduct, removeProduct } = useBooking();
    const [sortBy, setSortBy] = useState('rentalprice');
    const [sortOrder, setSortOrder] = useState('asc');

    const getProductQuantity = (productid: number) => {
        const product = selectedProducts.find((p) => p.productid === productid);
        return product ? product.quantity : 0;
    };

    const handleIncrement = (productid: number) => {
        addProduct(productid);
    };

    const handleDecrement = (productid: number) => {
        if (getProductQuantity(productid) == 0) {
            return;
        }
        removeProduct(productid);
    };

    const getSortedProducts = () => {
        return [...products].sort((a, b) => {
            if (sortBy === 'rentalprice') {
                const priceA = a.rentalprice || 0;
                const priceB = b.rentalprice || 0;
                return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
            }
            return 0;
        });
    };

    const handleSortChange = (value: string) => {
        const [newSortBy, newSortOrder] = value.split('-');
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    return (
        <div className="flex w-full flex-col gap-2 p-4">
            <div className="flex justify-end gap-2">
                <div className="text-md flex items-center gap-2 font-semibold">
                    <Icon icon="lucide:sort-desc" className="text-xl" />
                    Sắp xếp
                </div>
                <div>
                    <Select defaultValue={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
                        <SelectTrigger className="border-2 bg-transparent focus:ring-0">
                            <SelectValue placeholder="Mặc định" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rentalprice-asc">Giá tăng dần</SelectItem>
                            <SelectItem value="rentalprice-desc">Giá giảm dần</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-15 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {getSortedProducts().map((product) => (
                    <div key={product.productid} className="">
                        <Image
                            src={product.productimgurl || '/default-image.jpg'}
                            alt={product.productname || 'Hình ảnh sản phẩm'}
                            width={300}
                            height={200}
                            className="!h-[200px] w-full object-scale-down"
                        />
                        <h3 className="text-md font-semibold">{product.productname}</h3>
                        <div className="flex items-center justify-between">
                            <p className="text-primary-600 font-bold">{product.rentalprice?.toLocaleString()} VNĐ</p>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="group bg-primary-50 hover:bg-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded"
                                    onClick={() => handleDecrement(product.productid)}
                                >
                                    <Icon
                                        icon="ic:baseline-minus"
                                        className="text-lg text-gray-500 group-hover:text-white"
                                    />
                                </button>
                                <div className="mx-4 text-lg">{getProductQuantity(product.productid)}</div>
                                <button
                                    type="button"
                                    className="group bg-primary-50 hover:bg-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded"
                                    onClick={() => handleIncrement(product.productid)}
                                >
                                    <Icon
                                        icon="ic:baseline-plus"
                                        className="text-lg text-gray-500 group-hover:text-white"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RentalList;
