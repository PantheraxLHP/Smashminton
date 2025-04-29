'use client';

import ProductFilter from '@/app/products/ProductCategoryFilter';
import ProductList from '@/app/products/ProductList';
import ProductTypeFilter from '@/app/products/ProductTypeFilter';
import { Products, ProductTypes } from '@/types/types';
import { useEffect, useState } from 'react';
import BookingBottomSheet from '../booking/_components/BookingBottomSheet';

interface ProductResponse {
    products: Products[]; // Danh sách sản phẩm
    totalPages: number; // Tổng số trang
    page: number; // Trang hiện tại (trường hợp page > totalPages thì trả về page cuối cùng)
    productCategories: ProductTypes[]; // Danh mục sản phẩm
}

export interface SelectedProducts extends Products {
    quantity: number;
}

const ProductPage = () => {
    const [foods, setFoods] = useState<Products[]>([
        { productid: 1, productname: 'Set cá viên chiên', sellingprice: 105000, productimgurl: '/setcavienchien.png' },
        { productid: 2, productname: 'Set cá viên chiên chua cay', sellingprice: 290000, productimgurl: '/setcavienchienchuacay.png', },
        { productid: 3, productname: "Bánh snack O'Star", sellingprice: 275000, productimgurl: '/ostar.png' },
        { productid: 4, productname: 'Bánh snack bí đỏ', sellingprice: 245000, productimgurl: '/oishibido.png' },
        { productid: 5, productname: 'Nước uống Revive', sellingprice: 230000, productimgurl: '/revive.png' },
        { productid: 6, productname: 'Nước uống Pocari', sellingprice: 290000, productimgurl: '/pocarisweat.png' },
    ]); // State quản lý danh sách sản phẩm
    const [foodCategories, setFoodCategories] = useState<ProductTypes[]>([
        { producttypeid: 1, producttypename: 'Đồ mặn', productisfood: true },
        { producttypeid: 2, producttypename: 'Snack', productisfood: true },
        { producttypeid: 3, producttypename: 'Nước uống', productisfood: true },
    ]); // State quản lý loại đồ ăn - thức uống
    const [accessories, setAccessories] = useState<Products[]>([
        { productid: 7, productname: 'Ống cầu lồng Taro xanh', sellingprice: 105000, productimgurl: '/oishibido.png' },
        { productid: 8, productname: 'Ống cầu lông Kamito K10 Pro', sellingprice: 290000, productimgurl: '/revive.png', },
        { productid: 9, productname: "Ống cầu lông Kamito K10", sellingprice: 275000, productimgurl: '/ostar.png' },
    ]); // State quản lý danh sách phụ kiện
    const [accessoryCategories, setAccessoryCategories] = useState<ProductTypes[]>([
        { producttypeid: 4, producttypename: 'Túi đựng giày cầu lông', productisfood: false },
        { producttypeid: 5, producttypename: 'Ống cầu lông', productisfood: false },
        { producttypeid: 6, producttypename: 'Quấn cán cầu lông', productisfood: false },
        { producttypeid: 7, producttypename: 'Vớ cầu lông', productisfood: false },
        { producttypeid: 8, producttypename: 'Cước đan vợt cầu lông', productisfood: false },
    ]); // State quản lý loại phụ kiện
    const [page, setPage] = useState(1); // State quản lý trang hiện tại
    const [totalPages, setTotalPages] = useState(0); // State quản lý tổng số trang
    //? State quản lý số lượng sản phẩm trên mỗi trang (nếu có tính năng thay đổi số lượng sản phẩm trên mỗi trang thì sẽ sử dụng state này, còn không mặc định 1 trang là 12 sản phẩm)
    const [pageSize, setPageSize] = useState(12);
    const [chosenProductType, setChosenProductType] = useState<number>(1);
    const [chosenProductCategory, setChosenProductCategory] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState('asc'); // State quản lý thứ tự sắp xếp (tăng dần hoặc giảm dần)
    const [sortBy, setSortBy] = useState("sellingprice"); // State quản lý trường sắp xếp (theo giá, tên, ...)

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                let url = `/api/foods?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`
                // Trường hợp chọn "Tất cả"
                if (chosenProductCategory !== 0) {
                    url += `&producttypeid=${chosenProductCategory}`;
                }
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch foods');
                }
    
                const data: ProductResponse = await response.json();
                setFoods(data.products); // Cập nhật danh sách sản phẩm
                setTotalPages(data.totalPages); // Cập nhật tổng số trang
                // Trường hợp page > totalPages thì backend sẽ trả về page đúng (page cuối cùng)
                if (page !== data.page) { 
                    setPage(data.page); // Cập nhật trang hiện tại
                }
                setFoodCategories(data.productCategories); // Cập nhật danh mục sản phẩm
            } catch (error) {
                console.error("Error fetching foods:", error);
            }
        };

        const fetchAccessories = async () => {
            try {
                let url = `/api/accessories?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
                if (chosenProductCategory !== 0) {
                    url += `&producttypeid=${chosenProductCategory}`;
                }
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch accessories');
                }

                const data: ProductResponse = await response.json();
                setAccessories(data.products); // Cập nhật danh sách phụ kiện
                setTotalPages(data.totalPages); // Cập nhật tổng số trang
                setPage(data.page); // Cập nhật trang hiện tại
                setAccessoryCategories(data.productCategories); // Cập nhật danh mục sản phẩm
            } catch (error) {
                console.error("Error fetching accessories:", error);
            }
        };

        if (chosenProductType === 1) {
            fetchFoods();
        }
        else if (chosenProductType === 2) {
            fetchAccessories();
        }
    }, [page, pageSize, chosenProductCategory, chosenProductType, sortBy, sortOrder]);

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

    const totalPrice = selectedProducts.reduce((acc, food) => {
        return acc + (food.sellingprice ?? 0) * food.quantity;
    }, 0);

    const handleTypeFilterChange = (type: number) => {
        setChosenProductType(type);
        setPage(1);
        setChosenProductCategory(0);
    };

    const handleCategoryFilterChange = (category: number) => {
        setChosenProductCategory(category);
        setPage(1);
    };

    const handleSortOrderChange = (orderBy: string, sortBy: string) => {
        setSortOrder(orderBy);
        setSortBy(sortBy);
        setPage(1);
    }

    const pageComponentRender = () => {
        if (chosenProductType === 1) {
            return (
                <>
                    <div className="flex flex-col gap-5">
                        <ProductTypeFilter
                            chosenProductTypeId={chosenProductType}
                            onTypeFilterChange={handleTypeFilterChange}
                        />
                        <ProductFilter
                            chosenProductCategoryId={chosenProductCategory}
                            productCategories={foodCategories}
                            onCategoryFilterChange={handleCategoryFilterChange}
                        />
                    </div>
                    <ProductList
                        products={foods}
                        productQuantities={productQuantities}
                        page={page}
                        totalPages={totalPages}
                        onSetPage={setPage}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortOrderChange={handleSortOrderChange}
                    />
                </>
            );
        }
        else if (chosenProductType === 2) {
            return (
                <>
                    <div className="flex flex-col gap-5">
                        <ProductTypeFilter
                            chosenProductTypeId={chosenProductType}
                            onTypeFilterChange={handleTypeFilterChange}
                        />
                        <ProductFilter
                            chosenProductCategoryId={chosenProductCategory}
                            productCategories={accessoryCategories}
                            onCategoryFilterChange={handleCategoryFilterChange}
                        />
                    </div>
                    <ProductList
                        products={accessories}
                        productQuantities={productQuantities}
                        page={page}
                        totalPages={totalPages}
                        onSetPage={setPage}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortOrderChange={handleSortOrderChange}
                    />
                </>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 px-2 py-4">
            {pageComponentRender()}
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
