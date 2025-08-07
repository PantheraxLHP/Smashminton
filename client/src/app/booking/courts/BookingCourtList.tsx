import { useDebounce } from '@/app/hooks/useDebounce';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { SelectedCourts } from './page';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Switch } from '@/components/ui/switch';

interface BookingCourtListProps {
    courts: SelectedCourts[];
    fixedCourt: boolean;
    setFixedCourt: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookingCourtList: React.FC<BookingCourtListProps> = ({ courts = [], fixedCourt, setFixedCourt }) => {
    const { selectedCourts, addCourt, removeCourtByIndex, removeMultiCourt } = useBooking();
    const [showFixedCourtDialog, setShowFixedCourtDialog] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [hasShownDialog, setHasShownDialog] = useState(false);

    const handleAddCourt = (scCourt: SelectedCourts) => {
        addCourt(scCourt, fixedCourt);
    };

    // const handleRemoveCourtByIndex = (index: number) => {
    //     removeCourtByIndex(index);
    // };

    const handleRemoveMultiCourt = (court: SelectedCourts, fixedCourt: boolean) => {
        removeMultiCourt(court, fixedCourt);
    };

    // New handler for booking button
    const handleBookingButtonClick = (court: SelectedCourts, isSelected: boolean, fixedCourt: boolean) => {
        if (isSelected) {
            handleRemoveMultiCourt(selectedCourts[0], fixedCourt);
        } else {
            // Only show dialog if fixedCourt is false and dialog hasn't been shown in this page load
            if (!fixedCourt && !hasShownDialog) {
                setShowFixedCourtDialog(true);
                setHasShownDialog(true);
            } else {
                handleAddCourt(court);
            }
        }
    };

    // Debounced click handler
    const debouncedHandleClick = useDebounce(handleBookingButtonClick, 300);

    return (
        <div className="px-4">
            {/* AlertDialog for fixed court feature */}
            <AlertDialog open={showFixedCourtDialog} onOpenChange={setShowFixedCourtDialog}>
                <AlertDialogContent>
                    <AlertDialogTitle>
                        Bạn có muốn sử dụng tính năng &quot;Đặt sân cố định&quot;? (Nút bật/tắt góc phải phía trên)
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Tính năng này sẽ giúp bạn đặt sân cố định cho 4 buổi liên tiếp. Bạn có muốn bật tính năng này
                        không?
                    </AlertDialogDescription>
                    <div className="mt-4 flex justify-end gap-2">
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowFixedCourtDialog(false);
                                    setFixedCourt(false);
                                }}
                            >
                                Không
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={() => {
                                    setShowFixedCourtDialog(false);
                                    setFixedCourt(true);
                                }}
                            >
                                Có
                            </Button>
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Toggle đặt sân cố định */}
            <div className="mb-4 flex items-center justify-end">
                <span className="text-gray-600">Đặt sân cố định:</span>
                {/* Tooltip icon */}
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger>
                        <div
                            aria-label="Thông tin đặt sân cố định"
                            className="bg-primary-500 mr-2 ml-2 flex items-center justify-center rounded-full p-1 text-white"
                            onClick={() => setTooltipOpen(!tooltipOpen)}
                        >
                            <Icon icon="mdi:information-outline" className="text-lg text-white" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="z-1000 max-w-xs rounded-md bg-white p-2 text-sm text-black shadow-md shadow-gray-300">
                        <strong className="block">CÁCH ĐẶT SÂN CỐ ĐỊNH</strong>
                        <ul className="list-disc pl-4">
                            <li>Hệ thống hỗ trợ đặt sân cố định bằng cách đặt giúp bạn 4 buổi đánh...</li>
                            <li>Sau khi kiểm tra, hệ thống sẽ hiển thị các sân phù hợp.</li>
                            <li>Nếu không tìm thấy, hãy chọn khung giờ hoặc thời lượng chơi khác.</li>
                            <li>Nếu không có sân nào, hệ thống sẽ tắt chức năng này và thử đặt thủ công.</li>
                        </ul>
                    </TooltipContent>
                </Tooltip>
                {/* Switch from shadcn/ui */}
                <Switch
                    id="fixedCourt"
                    checked={fixedCourt}
                    onCheckedChange={() => setFixedCourt(!fixedCourt)}
                    className="ml-2"
                />
            </div>
            {/* Tiêu đề */}
            <h2 className="text-center text-lg font-semibold">
                Tổng cộng có <span className="text-primary-600 font-bold">{courts?.length || 0} sân</span> có sẵn tại
                khung giờ này. Đặt bất kỳ sân nào bạn thích nhất.
            </h2>

            {/* Danh sách sân */}
            <div className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courts?.map((court) => {
                    const scCourtIndex =
                        selectedCourts?.findIndex(
                            (selected) =>
                                selected.courtid === court.courtid &&
                                selected.date === court.date &&
                                selected.starttime === court.starttime,
                        ) ?? -1;
                    const isSelected = scCourtIndex !== -1;

                    return (
                        <div key={court.courtid} className="flex h-full w-full flex-col rounded-lg border shadow-lg">
                            <div className="relative overflow-hidden">
                                <Image
                                    src={court.courtimgurl || 'default-court.png'}
                                    alt={court.courtname || 'Hình ảnh sân'}
                                    width={200}
                                    height={400}
                                    className="!h-[350px] w-full rounded-t-lg object-cover"
                                />
                                <div className="text-primary-600 absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                                    ⭐ {court.avgrating || 0}
                                </div>
                            </div>
                            <div className="p-4 text-left">
                                <h3 className="text-lg font-semibold">{court.courtname}</h3>
                                <p className="text-primary-500 py-1 text-lg font-semibold">
                                    {formatPrice(court.price)}
                                </p>
                                <Button
                                    className="w-full"
                                    variant={isSelected ? 'destructive' : 'default'}
                                    onClick={() => debouncedHandleClick(court, isSelected, fixedCourt)}
                                >
                                    {isSelected ? 'HỦY ĐẶT SÂN' : 'ĐẶT SÂN'}
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
