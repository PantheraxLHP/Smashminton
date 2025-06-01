import { SelectedProducts } from '@/app/booking/courts/page';
import { ProductListItem } from '@/app/products/page';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBooking } from '@/context/BookingContext';
import { formatPrice } from '@/lib/utils';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface ProductListProps {
    products: ProductListItem[];
    selectedProducts: SelectedProducts[];
}

const ProductList: React.FC<ProductListProps> = ({ products, selectedProducts }) => {
    const { addProductItem, removeProduct, selectedCourts } = useBooking();
    const [sortBy, setSortBy] = useState('sellingprice');
    const [sortOrder, setSortOrder] = useState('asc');
    const router = useRouter();
    const getProductQuantity = (productId: number) => {
        const product = selectedProducts.find((p) => p.productid === productId);
        return product ? product.quantity : 0;
    };

    const handleQuantityChange = (productId: number, delta: number) => {
        if (delta > 0) {
            if (!selectedCourts || selectedCourts.length === 0) {
                toast.warning('Bạn cần đăng nhập để đặt sản phẩm');
                router.push('/signin');
                return;
            }
            if (getProductQuantity(productId) >= (products.find((p) => p.productid === productId)?.quantity || 0)) {
                toast.warning('Số lượng sản phẩm đã đạt giới hạn');
                return;
            }
            addProductItem(productId);
        } else {
            if (getProductQuantity(productId) == 0) {
                return;
            }
            removeProduct(productId);
        }
    };

    const getSortedProducts = () => {
        return [...products].sort((a, b) => {
            if (sortBy === 'sellingprice') {
                const priceA = a.sellingprice || 0;
                const priceB = b.sellingprice || 0;
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
                            <SelectItem value="sellingprice-asc">Giá tăng dần</SelectItem>
                            <SelectItem value="sellingprice-desc">Giá giảm dần</SelectItem>
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
                            <p className="text-primary-600 font-bold">{formatPrice(product.sellingprice || 0)}</p>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="group bg-primary-50 hover:bg-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded"
                                    onClick={() => handleQuantityChange(product.productid, -1)}
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
                                    onClick={() => handleQuantityChange(product.productid, 1)}
                                >
                                    <Icon
                                        icon="ic:baseline-plus"
                                        className="text-lg text-gray-500 group-hover:text-white"
                                    />
                                </button>
                            </div>
                        </div>
                        {/* show stock quantity */}
                        <div className="flex items-end gap-1 text-sm text-gray-500">
                            <span>Số lượng: {product.quantity}</span>
                            <Icon icon="mdi:racket" className="h-5 w-5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
