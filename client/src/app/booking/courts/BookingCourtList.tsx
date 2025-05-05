import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipRoot, TooltipTrigger } from '@/components/ui/tooltip';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useState } from 'react';
import { CourtsWithPrice, Filters, SelectedCourts } from './page';
import { formatPrice } from '@/lib/utils';

interface BookingCourtListProps {
    courts: CourtsWithPrice[];
    selectedCourts: SelectedCourts[];
    filters: Filters;
    onToggleChange: (isFixed: boolean) => void;
    onAddCourt: (scCourt: SelectedCourts) => void;
    onRemoveCourt: (scCourt: SelectedCourts) => void;
}

const BookingCourtList: React.FC<BookingCourtListProps> = ({
    courts = [], // Provide default empty array
    selectedCourts = [],
    filters,
    onToggleChange,
    onAddCourt,
    onRemoveCourt,
}) => {
    const [tooltipOpen, setTooltipOpen] = useState(false); // Trạng thái mở/đóng tooltip

    return (
        <div className="px-4">
            {/* Toggle đặt sân cố định */}
            <div className="mb-4 flex items-center justify-end">
                <span className="text-gray-600">Đặt sân cố định:</span>

                {/* Tooltip icon */}
                <Tooltip>
                    <TooltipRoot open={tooltipOpen} onOpenChange={(isOpen) => setTooltipOpen(isOpen)}>
                        <TooltipTrigger>
                            <button
                                aria-label="Thông tin đặt sân cố định"
                                className="bg-primary-500 mr-2 ml-2 flex items-center justify-center rounded-full p-1 text-white"
                                onClick={() => setTooltipOpen(!tooltipOpen)}
                            >
                                <Icon icon="mdi:information-outline" className="text-lg text-white" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="z-1000 max-w-xs rounded-md bg-white p-2 text-sm shadow-md">
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
                    className={`flex h-5 w-10 cursor-pointer items-center rounded-full transition duration-300 ${filters.fixedCourt ? 'bg-primary-500' : 'bg-gray-300'}`}
                >
                    <div
                        className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${filters.fixedCourt ? 'translate-x-5' : 'translate-x-0'}`}
                    ></div>
                </label>
            </div>

            {/* Tiêu đề */}
            <h2 className="text-center text-lg font-semibold">
                Tổng cộng có <span className="text-primary-600 font-bold">{courts?.length || 0} sân</span> có sẵn tại
                khung giờ này. Đặt bất kỳ sân nào bạn thích nhất.
            </h2>

            {/* Danh sách sân */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courts?.map((court) => {
                    const scCourt = selectedCourts?.find(
                        (selected) =>
                            selected.courtid === court.courtid &&
                            selected.filters.zone === filters.zone &&
                            selected.filters.date === filters.date &&
                            selected.filters.duration === filters.duration &&
                            selected.filters.startTime === filters.startTime &&
                            selected.filters.fixedCourt === filters.fixedCourt,
                    );

                    return (
                        <div key={court.courtid} className="overflow-hidden rounded-lg border shadow-lg">
                            <Image
                                src={court.courtimgurl || 'default-court.png'}
                                alt={court.courtname || 'Hình ảnh sân'}
                                width={300}
                                height={200}
                                className="w-full object-cover"
                            />
                            <div className="p-4 text-left">
                                <h3 className="text-lg font-semibold">{court.courtname}</h3>
                                <p className="text-primary-500 py-1 text-lg font-semibold">
                                    {formatPrice(parseInt(court.price))}
                                </p>
                                <Button
                                    className="w-full"
                                    variant={scCourt ? 'destructive' : 'default'}
                                    onClick={() => {
                                        if (scCourt) {
                                            onRemoveCourt(scCourt);
                                        } else {
                                            const selectedCourt: SelectedCourts = {
                                                ...court,
                                                filters,
                                            };
                                            onAddCourt(selectedCourt);
                                        }
                                    }}
                                >
                                    {scCourt ? 'HỦY ĐẶT SÂN' : 'ĐẶT SÂN'}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BookingCourtList;
