'use client';

import ProductFilter from '@/app/products/ProductFilter';
import ProductList from '@/app/products/ProductList';
import ProductTypeFilter from '@/app/products/ProductTypeFitler';
import { Products, ProductTypes } from '@/types/types';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../booking/_components/BookingBottomSheet';

interface FoodResponse {
    foods: Products[]; // Danh sách sản phẩm
    totalPages: number; // Tổng số trang
    page: number; // Trang hiện tại (trường hợp page > totalPages thì trả về page cuối cùng)
    foodCategory: string[]; // Danh mục sản phẩm
}

export interface SelectedProducts extends Products {
    quantity: number;
}

const ProductPage = () => {
    const [foods, setFoods] = useState<Products[]>([
        { productid: 1, productname: 'Set cá viên chiên', sellingprice: 105000, productimgurl: '/setcavienchien.png' },
        {
            productid: 2,
            productname: 'Set cá viên chiên chua cay',
            sellingprice: 290000,
            productimgurl: '/setcavienchienchuacay.png',
        },
        { productid: 3, productname: "Bánh snack O'Star", sellingprice: 275000, productimgurl: '/ostar.png' },
        { productid: 4, productname: 'Bánh snack bí đỏ', sellingprice: 245000, productimgurl: '/oishibido.png' },
        { productid: 5, productname: 'Nước uống Revive', sellingprice: 230000, productimgurl: '/revive.png' },
        { productid: 6, productname: 'Nước uống Pocari', sellingprice: 290000, productimgurl: '/pocarisweat.png' },
    ]); // State quản lý danh sách sản phẩm
    const [foodCategories, setFoodCategories] = useState<ProductTypes[]>([
        { producttypeid: 1, producttypename: 'Tất cả', productisfood: true },
        { producttypeid: 2, producttypename: 'Đồ mặn', productisfood: true },
        { producttypeid: 3, producttypename: 'Snack', productisfood: true },
        { producttypeid: 4, producttypename: 'Nước uống', productisfood: true },
    ]); // State quản lý loại đồ ăn - thức uống
    const [accessories, setAccessories] = useState<Products[]>([]); // State quản lý danh sách phụ kiện
    const [accessoryCategories, setAccessoryCategories] = useState<string[]>([]); // State quản lý loại phụ kiện
    const [page, setPage] = useState(1); // State quản lý trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // State quản lý tổng số trang
    //? State quản lý số lượng sản phẩm trên mỗi trang (nếu có tính năng thay đổi số lượng sản phẩm trên mỗi trang thì sẽ sử dụng state này, còn không mặc định 1 trang là 12 sản phẩm)
    const [pageSize, setPageSize] = useState(12);

    const productType = [
        { id: 1, name: 'Đồ ăn - Thức uống' },
        { id: 2, name: 'Phụ kiện cầu lông' },
    ];

    const foodExCategories = [
        { id: 1, name: 'Tất cả' },
        { id: 2, name: 'Đồ mặn' },
        { id: 3, name: 'Snack' },
        { id: 4, name: 'Nước uống' },
    ];

    const [chosenProductType, setChosenProductType] = useState<number>(1);
    const [chosenProductCategory, setChosenProductCategory] = useState<number>(1);

    /*
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`/api/foods?page=${page}&pageSize=${pageSize}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch foods');
                }
    
                const data: FoodResponse = await response.json();
                setFoods(data.foods); // Cập nhật danh sách sản phẩm
                setTotalPages(data.totalPages); // Cập nhật tổng số trang
                setPage(data.page); // Cập nhật trang hiện tại
                setFoodCategories(data.foodCategory); // Cập nhật danh mục sản phẩm
            } catch (error) {
                console.error("Error fetching foods:", error);
            }
        };
    
        fetchProducts();
    }, [page, pageSize]); // Chạy lại khi page hoặc itemsPerPage thay đổi
    */

    // State quản lý số lượng sản phẩm
    const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        setProductQuantities((prev) => {
            const updated = { ...prev };
            [...foods, ...accessories].forEach((product) => {
                if (updated[product.productid] === undefined) {
                    updated[product.productid] = 0;
                }
            });
            return updated;
        });
    }, [foods, accessories]);

    // Tăng số lượng sản phẩm
    const handleIncrement = (productid: number) => {
        setProductQuantities((prev) => ({
            ...prev,
            [productid]: prev[productid] + 1,
        }));
    };

    // Giảm số lượng sản phẩm
    const handleDecrement = (productid: number) => {
        setProductQuantities((prev) => ({
            ...prev,
            [productid]: Math.max(prev[productid] - 1, 0),
        }));
    };

    const handleRemove = (productid: number) => {
        setProductQuantities((prev) => ({
            ...prev,
            [productid]: 0,
        }));
    };

    const selectedFoods: SelectedProducts[] = foods
        .filter((food) => productQuantities[food.productid] > 0)
        .map((food) => ({
            ...food,
            quantity: productQuantities[food.productid],
        }));

    const selectedAccessories: SelectedProducts[] = accessories
        .filter((accessory) => productQuantities[accessory.productid] > 0)
        .map((accessory) => ({
            ...accessory,
            quantity: productQuantities[accessory.productid],
        }));

    const selectedProducts = [...selectedFoods, ...selectedAccessories];

    const totalPrice = selectedFoods.reduce((acc, food) => {
        return acc + (food.sellingprice ?? 0) * food.quantity;
    }, 0);

    return (
        <div className="flex gap-4 px-2 py-4">
            {chosenProductType === 1 && (
                <>
                    <div className="flex flex-col gap-5">
                        <ProductTypeFilter />
                        <ProductFilter />
                    </div>
                    <ProductList
                        products={foods}
                        productQuantities={productQuantities}
                        page={page}
                        totalPages={totalPages}
                        onSetPage={setPage}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                    />
                </>
            )}
            {selectedProducts.length > 0 && (
                <BookingBottomSheet
                    totalPrice={totalPrice}
                    selectedProducts={selectedProducts}
                    onRemoveProduct={handleRemove}
                />
            )}
        </div>
    );
};

export default ProductPage;
