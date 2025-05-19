'use client';

import { useEffect, useState, useRef } from 'react';
import { FaSortAmountDownAlt } from 'react-icons/fa';
import Image from 'next/image';
import { Icon } from '@iconify/react';

type Props = {
    selectedCategory: 'Thuê vợt' | 'Thuê giày';
    filters: {
        brands: string[];
        weights?: string[];
        stiffness?: string[];
        balance?: string[];
        forms?: string[];
        sizes?: string[];
    };
    rentalQuantities: { [id: number]: number };
    onIncrement: (id: number) => void;
    onDecrement: (id: number) => void;
    setRackets: (items: Racket[]) => void;
    setShoes: (items: Shoe[]) => void;
};

type Item = {
    id: number;
    name: string;
    image: string;
    price: string;
    brand: string;
    weight?: string;
    stiffness?: string;
    balance?: string;
    form?: string;
    size?: string;
};

type Racket = {
    productid: number;
    id: number;
    name: string;
    price: number;
    brand: string;
    weight: string;
    stiffness: string;
    balance: string;
    quantity: number;
    productName: string;
};

type Shoe = {
    productid: number;
    id: number;
    name: string;
    price: number;
    brand: string;
    form: string;
    size: string;
    quantity: number;
    productName: string;
};

const racketItems: Item[] = Array.from({ length: 36 }, (_, index) => ({
    id: index,
    name: 'Vợt Yonex Nanoflare 001F 2025',
    image: '/YonexRacket1.png',
    price: '34,000 đ / giờ',
    brand: 'Yonex',
    weight: '4U: 80 - 84g',
    stiffness: 'Trung bình',
    balance: 'Cân bằng',
}));

const shoeItems: Item[] = Array.from({ length: 36 }, (_, index) => ({
    id: index + 100,
    name: 'Giày Lining Ranger V',
    image: '/YonexRacket1.png',
    price: '22,000 đ / giờ',
    brand: 'Lining',
    form: 'Unisex - Bản chân thường',
    size: '42',
}));

export default function RentalList({
    selectedCategory,
    filters,
    rentalQuantities,
    onIncrement,
    onDecrement,
    setRackets,
    setShoes,
}: Props) {
    const [sortOption, setSortOption] = useState<'default' | 'priceAsc' | 'priceDesc' | 'nameAsc'>('default');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const prevDataRef = useRef<string>('');

    const items = selectedCategory === 'Thuê giày' ? shoeItems : racketItems;

    const filteredItems = items.filter((item) => {
        const matchBrand = filters.brands.length === 0 || filters.brands.includes(item.brand);

        if (selectedCategory === 'Thuê vợt') {
            const matchWeight = filters.weights?.length === 0 || filters.weights?.includes(item.weight!);
            const matchStiffness = filters.stiffness?.length === 0 || filters.stiffness?.includes(item.stiffness!);
            const matchBalance = filters.balance?.length === 0 || filters.balance?.includes(item.balance!);
            return matchBrand && matchWeight && matchStiffness && matchBalance;
        } else {
            const matchForm = filters.forms?.length === 0 || filters.forms?.includes(item.form!);
            const matchSize = filters.sizes?.length === 0 || filters.sizes?.includes(item.size!);
            return matchBrand && matchForm && matchSize;
        }
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        const getPrice = (priceStr: string) => parseInt(priceStr.replace(/[^\d]/g, ''));
        if (sortOption === 'priceAsc' || sortOption === 'priceDesc') {
            const priceA = getPrice(a.price);
            const priceB = getPrice(b.price);
            return sortOption === 'priceAsc' ? priceA - priceB : priceB - priceA;
        }
        if (sortOption === 'nameAsc') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const currentItems = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/[^\d]/g, ''));

        if (selectedCategory === 'Thuê vợt') {
            const rackets: Racket[] = sortedItems.map(item => ({
                productid: item.id,
                id: item.id,
                name: item.name,
                price: parsePrice(item.price),
                brand: item.brand,
                weight: item.weight!,
                stiffness: item.stiffness!,
                balance: item.balance!,
                quantity: rentalQuantities[item.id] || 0,
                productName: item.name,
            }));
            const newDataStr = JSON.stringify(rackets);
            if (newDataStr !== prevDataRef.current) {
                prevDataRef.current = newDataStr;
                setRackets(rackets);
            }
        } else {
            const shoes: Shoe[] = sortedItems.map(item => ({
                productid: item.id,
                id: item.id,
                name: item.name,
                price: parsePrice(item.price),
                brand: item.brand,
                form: item.form!,
                size: item.size!,
                quantity: rentalQuantities[item.id] || 0,
                productName: item.name,
            }));
            const newDataStr = JSON.stringify(shoes);
            if (newDataStr !== prevDataRef.current) {
                prevDataRef.current = newDataStr;
                setShoes(shoes);
            }
        }
    }, [sortedItems, selectedCategory, setRackets, setShoes, rentalQuantities]);

    return (
        <div className="flex flex-col flex-1">
            {/* Sort dropdown */}
            <div className="flex justify-end px-6 py-2 mb-4">
                <div className="flex items-center gap-2">
                    <FaSortAmountDownAlt className="text-md flex items-center gap-2 font-semibold" />
                    <span className="text-md font-semibold">Sắp xếp</span>
                    <select
                        className="w-28 border border-gray-300 rounded py-1 text-md outline-none focus:ring focus:ring-blue-200"
                        value={sortOption}
                        onChange={(e) => {
                            setSortOption(e.target.value as typeof sortOption);
                            setCurrentPage(1); // Reset page khi sắp xếp lại
                        }}
                    >
                        <option value="default">Mặc định</option>
                        <option value="priceAsc">Giá tăng dần</option>
                        <option value="priceDesc">Giá giảm dần</option>
                        <option value="nameAsc">Theo tên (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 p-4 flex-1">
                {currentItems.map((item) => (
                    <div
                        key={item.id}
                        className=""
                    >
                        <Image
                            src={item.image || '/YonexRacket1.png'}
                            alt={item.name || 'Tên sản phẩm'}
                            width={300}
                            height={200}
                            className="w-full object-scale-down !h-[200px]"
                        />
                        <h4 className="text-md font-semibold">{item.name}</h4>
                        <div className="flex items-center justify-between">
                            <p className="text-primary-600 font-bold">{item.price}</p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onDecrement(item.id)}
                                    className="group bg-gray-50 border border-gray-100 hover:bg-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded"
                                >
                                    <Icon icon="ic:baseline-minus" className="text-lg text-gray-500 group-hover:text-white" />
                                </button>
                                <span className='mx-4 text-lg'>{rentalQuantities[item.id] || 0}</span>
                                <button
                                    onClick={() => onIncrement(item.id)}
                                    className="group bg-gray-50 border border-gray-100 hover:bg-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded"
                                >
                                    <Icon icon="ic:baseline-plus" className="text-lg text-gray-500 group-hover:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {currentItems.length === 0 && (
                    <p className="col-span-full text-center text-sm text-gray-500">
                        Không tìm thấy sản phẩm phù hợp.
                    </p>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 py-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-1 border-2 border-primary-500 rounded disabled:text-primary-50 disabled:border-primary-50 
                    disabled:hover:bg-white disabled:hover:text-primary-50 text-primary-500 hover:bg-primary-500 hover:text-white
                    cursor-pointer disabled:cursor-default"
                >
                    &lt;
                </button>
                <span className="text-sm text-primary-600">
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1 border-2 border-primary-500 rounded disabled:text-primary-50 disabled:border-primary-50 
                    disabled:hover:bg-white disabled:hover:text-primary-50 text-primary-500 hover:bg-primary-500 hover:text-white
                    cursor-pointer disabled:cursor-default"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}
