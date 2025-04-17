'use client';

import { useState, useEffect } from "react";
import { Products } from "@/types/types";
import ProductFilter from "@/app/(products)/ProductFilter";
import ProductList from "@/app/(products)/ProductList";
import ProductBottomSheet from "@/app/(products)/ProductBottomSheet";

interface FoodResponse {
    foods: Products[]; // Danh sách sản phẩm
    totalPages: number; // Tổng số trang
    page: number; // Trang hiện tại (trường hợp page > totalPages thì trả về page cuối cùng)
    foodCategory: string[]; // Danh mục sản phẩm
}

interface SelectedProducts extends Products {
    quantity: number;
}

const FoodPage = () => {
    const [foods, setFoods] = useState<Products[]>([]); // State quản lý danh sách sản phẩm
    const [foodCategories, setFoodCategories] = useState<string[]>([]); // State quản lý danh mục sản phẩm
    const [page, setPage] = useState(1); // State quản lý trang hiện tại
    const [totalPages, setTotalPages] = useState(10); // State quản lý tổng số trang
    //? State quản lý số lượng sản phẩm trên mỗi trang (nếu có tính năng thay đổi số lượng sản phẩm trên mỗi trang thì sẽ sử dụng state này, còn không mặc định 1 trang là 12 sản phẩm)
    const [pageSize, setPageSize] = useState(12);

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

    const foodsExData: Products[] = [
        { productid: 1, productname: "Set cá viên chiên", sellingprice: 105000, productimgurl: "/setcavienchien.png" },
        { productid: 2, productname: "Set cá viên chiên chua cay", sellingprice: 290000, productimgurl: "/setcavienchienchuacay.png" },
        { productid: 3, productname: "Bánh snack O'Star", sellingprice: 275000, productimgurl: "/ostar.png" },
        { productid: 4, productname: "Bánh snack bí đỏ", sellingprice: 245000, productimgurl: "/oishibido.png" },
        { productid: 5, productname: "Nước uống Revive", sellingprice: 230000, productimgurl: "/revive.png" },
        { productid: 6, productname: "Nước uống Pocari", sellingprice: 290000, productimgurl: "/pocarisweat.png" },
    ];


    const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>(
        // foods.reduce((acc, food) => {
        foodsExData.reduce((acc, food) => {
            acc[food.productid] = 0;
            return acc;
        }, {} as { [key: number]: number })
    ); // State quản lý số lượng sản phẩm các sản phẩm

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

    const handleRemoveFood = (productid: number) => {
        setProductQuantities((prev) => ({
            ...prev,
            [productid]: 0,
        }));
    }

    // const selectedFoods: SelectedProducts[] = foods
    const selectedFoods: SelectedProducts[] = foodsExData
        .filter((food) => productQuantities[food.productid] > 0)
        .map((food) => ({
            ...food,
            quantity: productQuantities[food.productid],
        }));

    const totalPrice = selectedFoods.reduce((acc, food) => {
        return acc + (food.sellingprice ?? 0) * food.quantity;
    }, 0);


    return (
        <div className="flex px-2 py-4 gap-4">
            <ProductFilter />
            <ProductList
                // products={foods}
                products={foodsExData}
                productQuantities={productQuantities}
                page={page}
                totalPages={totalPages}
                onSetPage={setPage}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
            />
            {(selectedFoods.length > 0) && (
                <ProductBottomSheet
                    totalPrice={totalPrice}
                    selectedProducts={selectedFoods}
                    onRemoveProduct={handleRemoveFood}
                    onConfirm={() => { alert("Đặt hàng thành công") }}
                />
            )}
        </div>
    );
};

export default FoodPage;