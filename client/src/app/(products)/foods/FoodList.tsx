'use client';
import { useState } from "react";
import Image from "next/image";
import { Products } from "@/types/types";
import { Icon } from "@iconify/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FoodList = () => {
    const foods: Products[] = [
        { productid: 1, productname: "Set cá viên chiên", sellingprice: 105000, productimgurl: "/setcavienchien.png" },
        { productid: 2, productname: "Set cá viên chiên chua cay", sellingprice: 290000, productimgurl: "/setcavienchienchuacay.png" },
        { productid: 3, productname: "Bánh snack O'Star", sellingprice: 275000, productimgurl: "/ostar.png" },
        { productid: 4, productname: "Bánh snack bí đỏ", sellingprice: 245000, productimgurl: "/oishibido.png" },
        { productid: 5, productname: "Nước uống Revive", sellingprice: 230000, productimgurl: "/revive.png" },
        { productid: 6, productname: "Nước uống Pocari", sellingprice: 290000, productimgurl: "/pocarisweat.png" },
    ];

    // State quản lý số lượng sản phẩm các sản phẩm
    const [quantities, setQuantities] = useState<{ [key: number]: number }>(
        // Khởi tạo state quantities với giá trị mặc định là 0 cho mỗi sản phẩm
        foods.reduce((acc, food) => {
            acc[food.productid] = 0; 
            return acc;
        }, {} as { [key: number]: number })
    );

    const handleIncrement = (id: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: prev[id] + 1,
        }));
    };

    // Handle decrement
    const handleDecrement = (id: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(prev[id] - 1, 0),
        }));
    };

    return (
        <div className="w-full flex flex-col p-4 gap-2">
            <div className="flex justify-end gap-2">
                <div className="font-semibold text-md flex items-center gap-2">
                    <Icon icon="lucide:sort-desc" className="text-xl" />
                    Sắp xếp
                </div>
                <div>
                    <Select>
                        <SelectTrigger className="border-2 bg-transparent focus:ring-0">
                            <SelectValue placeholder="Mặc định" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Giá tăng dần</SelectItem>
                            <SelectItem value="desc">Giá giảm dần</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-15">
                {foods.map((item) => (
                    <div key={item.productid} className="">
                        <Image
                            src={item.productimgurl || "/default-image.jpg"}
                            alt={item.productname || "Hình ảnh sản phẩm"}
                            width={300}
                            height={200}
                            className="w-full object-cover"
                        />
                        <h3 className="text-md font-semibold">{item.productname}</h3>
                        <div className="flex items-center justify-between">
                            <p className="text-primary-600 font-bold">{item.sellingprice?.toLocaleString()} đ</p>
                            <div className="flex items-center">
                                <button
                                    className="w-6 h-6 bg-primary-100 rounded items-center flex justify-center cursor-pointer active:bg-primary"
                                    onClick={() => handleDecrement(item.productid)}
                                >
                                    <Icon icon="ic:baseline-minus" className="text-lg text-gray-500 active:text-white"/>
                                </button>
                                <span className="text-lg mx-4">{quantities[item.productid]}</span>
                                <button
                                    className="w-6 h-6 bg-primary-100 rounded items-center flex justify-center cursor-pointer active:bg-primary"
                                    onClick={() => handleIncrement(item.productid)}
                                >
                                    <Icon icon="ic:baseline-plus" className="text-lg text-gray-500 active:text-white"/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodList;