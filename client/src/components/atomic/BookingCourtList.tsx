import { useState } from "react";
import Image from "next/image"; // Nếu dùng Next.js, nếu không có thể dùng <img />
import { Tooltip, TooltipRoot, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface Court {
    id: number;
    name: string;
    price: string;
    img: string;
}

interface Filters {
    location?: string;
    time?: string;
    duration?: number;
    fixedCourt?: boolean;
}

interface BookingCourtListProps {
    courts: Court[];
    filters: Filters;
    onToggleChange: (isFixed: boolean) => void;
}

const BookingCourtList: React.FC<BookingCourtListProps> = ({ courts, filters, onToggleChange }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false); // Trạng thái mở/đóng tooltip

    return (
        <div className="px-4">
            {/* Toggle đặt sân cố định */}
            <div className="flex items-center justify-end mb-4">
                <span className="text-gray-600">Đặt sân cố định:</span>

                {/* Tooltip icon */}
                <Tooltip>
                    <TooltipRoot
                        open={tooltipOpen}
                        onOpenChange={(isOpen) => setTooltipOpen(isOpen)}
                    >
                        <TooltipTrigger>
                            <button
                                aria-label="Thông tin đặt sân cố định"
                                className="p-1 rounded-full bg-green-500 text-white flex items-center justify-center ml-2 mr-2"
                                onClick={() => setTooltipOpen(!tooltipOpen)}
                            >
                                <Icon icon="mdi:information-outline" className="text-white text-lg" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-sm shadow-md p-2 rounded-md max-w-xs">
                            <strong className="block">CÁCH ĐẶT SÂN CỐ ĐỊNH</strong>
                            <ul className="list-disc pl-4">
                                <li>Hệ thống hỗ trợ đặt sân cố định bằng cách đặt giúp bạn 4 buổi đánh...</li>
                                <li>Sau khi kiểm tra, hệ thống sẽ hiển thị các sân phù hợp.</li>
                                <li>Nếu không tìm thấy, hãy chọn khung giờ hoặc thời lượng chơi khác.</li>
                                <li>Nếu không có sân nào, hệ thống sẽ tắt chức năng này và thử đặt thủ công.</li>
                            </ul>
                        </TooltipContent>
                    </TooltipRoot>
                </Tooltip>

                {/* Toggle Switch */}
                <input
                    type="checkbox"
                    className="toggle-checkbox hidden"
                    id="fixedCourt"
                    checked={filters.fixedCourt}
                    onChange={(e) => onToggleChange(e.target.checked)}
                />
                <label
                    htmlFor="fixedCourt"
                    className={`cursor-pointer w-10 h-5 flex items-center rounded-full transition duration-300 ${filters.fixedCourt ? "bg-green-500" : "bg-gray-300"}`}
                >
                    <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${filters.fixedCourt ? "translate-x-5" : "translate-x-0"}`}
                    ></div>
                </label>
            </div>


            {/* Tiêu đề */}
            <h2 className="text-lg font-semibold text-center">
                Tổng cộng có{" "}
                <span className="text-green-600 font-bold">{courts.length} sân</span> có
                sẵn tại khung giờ này. Đặt bất kỳ sân nào bạn thích nhất.
            </h2>

            {/* Danh sách sân */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                {courts.map((court) => (
                    <div
                        key={court.id}
                        className="border rounded-lg shadow-lg overflow-hidden"
                    >
                        <Image
                            src={court.img}
                            alt={court.name}
                            width={300}
                            height={200}
                            className="w-full object-cover"
                        />
                        <div className="p-4 text-center">
                            <h3 className="text-lg font-semibold">{court.name}</h3>
                            <p className="text-gray-600">{court.price} / 1 giờ</p>
                            <Button className="w-full">
                                ĐẶT SÂN
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default BookingCourtList;
