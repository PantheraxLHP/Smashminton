'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { Products } from "@/types/types";
import { Icon } from "@iconify/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductListProps {
    products: Products[];
    productQuantities: { [key: number]: number };
    totalPages: number;
    page: number;
    onSetPage: (page: number) => void;
    onIncrement: (productid: number) => void;
    onDecrement: (productid: number) => void;
    sortBy: string;
    sortOrder: string;
    onSortOrderChange: (orderBy: string, sortBy: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    productQuantities,
    totalPages,
    page,
    onSetPage,
    onIncrement,
    onDecrement,
    sortBy,
    sortOrder,
    onSortOrderChange,
}) => {
    return (
        <div className="w-full flex flex-col p-4 gap-2">
            <div className="flex justify-end gap-2">
                <div className="font-semibold text-md flex items-center gap-2">
                    <Icon icon="lucide:sort-desc" className="text-xl" />
                    Sắp xếp
                </div>
                <div>
                    <Select
                        defaultValue={sortBy + "-" + sortOrder}
                        onValueChange={(value) => {
                            const [sortBy, sortOrder] = value.split("-");
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
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-15">
                {products.map((item) => (
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
                                    onClick={() => onDecrement(item.productid)}
                                >
                                    <Icon icon="ic:baseline-minus" className="text-lg text-gray-500 active:text-white" />
                                </button>
                                <span className="text-lg mx-4">{productQuantities[item.productid]}</span>
                                <button
                                    className="w-6 h-6 bg-primary-100 rounded items-center flex justify-center cursor-pointer active:bg-primary"
                                    onClick={() => onIncrement(item.productid)}
                                >
                                    <Icon icon="ic:baseline-plus" className="text-lg text-gray-500 active:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <div
                        key={`page-${pageNumber}`}
                        className={`cursor-pointer px-4 py-2 rounded outline-2 outline-primary ${page === pageNumber ? "bg-primary text-white" : "text-primary hover:bg-primary-200"}`}
                        onClick={() => onSetPage(pageNumber)}
                    >
                        {pageNumber}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;