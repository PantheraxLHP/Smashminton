import { Products } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

interface SelectedProducts extends Products {
    quantity: number;
}

interface ProductBottomSheetProps {
    totalPrice: number;
    selectedProducts: SelectedProducts[];
    onConfirm: () => void;
    onRemoveProduct: (productid: number) => void;
}

const ProductBottomSheet: React.FC<ProductBottomSheetProps> = ({
    totalPrice,
    selectedProducts,
    onConfirm,
    onRemoveProduct,
}) => {
    return (
        <div className="fixed bottom-0 inset-x-0 bg-black text-white py-2 sm:p-4 shadow-lg z-50">
            <div className="flex flex-col gap-2 items-center sm:flex-row sm:max-h-20">
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-0 max-h-[calc(100vh-150px)] sm:max-h-20">
                    <div className="flex flex-col gap-1">
                        {/* Danh sách foods */}
                        <div className="flex flex-wrap gap-4">
                            {selectedProducts.map((scProduct) => (
                                <div key={scProduct.productid} className="flex items-center gap-2">
                                    <Icon icon="mdi:racket" className="w-5 h-5" />
                                    <span>
                                        {scProduct.quantity} {scProduct.productname}
                                    </span>
                                    <Icon
                                        onClick={() => onRemoveProduct(scProduct.productid)}
                                        icon="mdi:close-circle"
                                        className="w-5 h-5 text-red-500 cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="flex flex-col sm:flex-row gap-5 items-center justify-end sm:h-20 sm:min-w-90 sm:max-w-180">
                    <div className="hidden sm:block h-full w-1 bg-white"></div>
                    {/* Tổng tiền & Thanh toán */}
                    <div className="flex flex-col items-center max-w-full sm:max-w-65">
                        <div className="flex mb-2 gap-2 items-center">
                            <span className="text-white">Tạm tính:</span>
                            <span className="text-lg font-bold">
                                {totalPrice.toLocaleString("vi-VN")} VND
                            </span>
                        </div>
                        <Button
                            className="w-full bg-primary"
                            onClick={onConfirm}
                        >
                            THANH TOÁN
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductBottomSheet;