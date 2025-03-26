'use client';

import { useState, useEffect, useRef } from 'react';
import BookingStep from '@/app/booking/BookingStep';
import BookingFilter from '@/app/booking/BookingFilter';
import BookingCourtList from '@/app/booking/BookingCourtList';
import BookingBottomSheet from '@/app/booking/BookingBottomSheet';
import { Button } from '@/components/ui/button';

interface Court {
    id: number;
    name: string;
    price: string;
    img: string;
}

interface Product {
    id: number;
    name: string;
    price: string;
    quantity: number;
}

interface SelectedCourt {
    court: Court;
    filters: Filters;
}

interface Filters {
    zone?: string;
    date?: string;
    duration?: number;
    startTime?: string;
    fixedCourt?: boolean;
}

export default function BookingPage() {
    const [step, setStep] = useState<number>(1);
    const [filters, setFilters] = useState<Filters>({
        fixedCourt: false,
    });
    const [courts, setCourts] = useState<Court[]>([]); // Danh sách sân hiển thị
    const [selectedCourts, setSelectedCourts] = useState<SelectedCourt[]>([]); // Danh sách sân muốn thuê
    const [products, setProducts] = useState<Product[]>([]); // Danh sách sản phẩm từ DB
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]); // Danh sách sản phẩm muốn mua
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // ✅ Update filters, including fixedCourt
    const handleFilterChange = (newFilters: Filters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
        }));
    };

    // ✅ Gọi API lấy danh sách sân theo bộ lọc, có debounce
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            try {
                const response = await fetch('/api/courts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filters),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch courts');
                }

                const data: Court[] = await response.json();
                setCourts(data);
            } catch (error) {
                console.error('Error fetching courts:', error);
            }
        }, 500); // Đợi 500ms trước khi gọi API
    }, [filters]);

    const courtExData = [
        { id: 1, name: 'Sân 1', price: '120.000 VND', img: '/Court1.png' },
        { id: 2, name: 'Sân 2', price: '120.000 VND', img: '/Court2.png' },
        { id: 3, name: 'Sân 3', price: '120.000 VND', img: '/Court3.png' },
        { id: 4, name: 'Sân 4', price: '120.000 VND', img: '/Court4.png' },
        { id: 5, name: 'Sân 5', price: '120.000 VND', img: '/Court5.png' },
        { id: 6, name: 'Sân 6', price: '120.000 VND', img: '/Court6.png' },
    ];

    // ✅ Thêm sân vào danh sách thuê
    const handleAddCourt = (scCourt: SelectedCourt) => {
        setSelectedCourts((prev) => [...prev, scCourt]);
    };

    // ✅ Xóa sân khỏi danh sách thuê
    const handleRemoveCourt = (scCourt: SelectedCourt) => {
        setSelectedCourts((prev) => prev.filter((court) =>
            court.court.id !== scCourt.court.id ||
            court.filters.zone !== scCourt.filters.zone ||
            court.filters.date !== scCourt.filters.date ||
            court.filters.duration !== scCourt.filters.duration ||
            court.filters.startTime !== scCourt.filters.startTime ||
            court.filters.fixedCourt !== scCourt.filters.fixedCourt
        ));
    };

    // ✅ Thêm sản phẩm vào danh sách mua
    const handleAddProduct = (product: Product) => {
        setSelectedProducts((prev) => {
            const existingProduct = prev.find((p) => p.id === product.id);
            if (existingProduct) {
                return prev.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            product.quantity = 1;
            return [...prev, product];
        });
    };

    // ✅ Xóa sản phẩm khỏi danh sách mua
    const handleRemoveProduct = (productId: number) => {
        setSelectedProducts((prev) => prev.filter((product) => product.id !== productId));
    };

    // ✅ Tính tổng giá tiền
    const totalPrice =
        selectedCourts.reduce((sum, scCourt) => sum + parseInt(scCourt.court.price.replace(/\D/g, '')), 0) +
        selectedProducts.reduce(
            (sum, product) => sum + parseInt(product.price.replace(/\D/g, '')) * product.quantity, 0
        );

    return (
        <div className="p-4">
            {/* Thanh bước tiến trình đặt sân */}
            <BookingStep currentStep={step} />

            {/* Nội dung từng bước */}
            {step === 1 && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {/* Bộ lọc chọn khu vực, thời gian, số giờ chơi */}
                        <BookingFilter onFilterChange={(newFilters) => handleFilterChange({ ...newFilters })} />

                        {/* Danh sách sân hiển thị theo filter */}
                        <div className="flex-1">
                            <BookingCourtList
                                courts={/*courts*/ courtExData}
                                selectedCourts={selectedCourts}
                                filters={filters}
                                onToggleChange={(isFixed) => handleFilterChange({ fixedCourt: isFixed })}
                                onAddCourt={handleAddCourt} // Thêm sân vào danh sách thuê
                                onRemoveCourt={handleRemoveCourt} // Xóa sân khỏi danh sách thuê
                            />
                        </div>
                    </div>
                </div>
            )}

            {step > 1 && <div className="p-10 text-center text-lg font-semibold text-gray-500">Đang phát triển...</div>}

            {/* Nút chuyển bước */}
            <div className="mt-4 flex justify-between">
                {/* Nút Quay lại */}
                <Button
                    onClick={() => setStep(step - 1)}
                    variant={'secondary'}
                    className={` ${step === 1 ? 'pointer-events-none opacity-0' : ''}`}
                >
                    ← Quay lại
                </Button>

                {/* Nút Tiếp theo */}
                <Button
                    onClick={() => setStep(step + 1)}
                    className={`bg-primary-500 text-white ${step === 3 ? 'pointer-events-none opacity-0' : ''}`}
                >
                    Tiếp theo →
                </Button>
            </div>

            {/* Hiển thị Bottom Sheet nếu có ít nhất 1 sân hoặc sản phẩm */}
            {(selectedCourts.length > 0 || selectedProducts.length > 0) && (
                <BookingBottomSheet
                    totalPrice={totalPrice}
                    selectedCourts={selectedCourts} // Truyền danh sách sân muốn thuê
                    selectedProducts={selectedProducts} // Truyền danh sách sản phẩm muốn mua
                    onRemoveCourt={handleRemoveCourt} // Xóa sân khỏi danh sách thuê
                    onConfirm={() => alert('Đặt sân thành công!')}
                    onCancel={() => {
                        setSelectedCourts([]);
                        setSelectedProducts([]);
                        alert('Hủy đặt sân!');
                    }}
                />
            )}
        </div>
    );
}
