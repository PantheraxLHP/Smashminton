import WeekPicker, { WeekPickerProps } from "./WeekPicker";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import RuleOptions from "./RuleOptions";
import { Icon } from "@iconify/react";

interface ShiftFilterProps extends WeekPickerProps {

}

const ShiftFilter: React.FC<ShiftFilterProps> = ({
    selectedWeek,
    setSelectedWeek,
    weekNumber,
    setWeekNumber,
    year,
    setYear
}) => {
    return (
        <div className="p-4 border rounded-lg flex flex-col gap-4 w-fit">
            <WeekPicker
                selectedWeek={selectedWeek}
                setSelectedWeek={setSelectedWeek}
                weekNumber={weekNumber}
                setWeekNumber={setWeekNumber}
                year={year}
                setYear={setYear}
            />
            <div className="border border-gray-500"></div>
            <div className="flex flex-col justify-left">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-3.5 h-3.5 rounded-xs bg-yellow-500"></div>
                    Ca sáng: 06:00 - 10:00
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-3.5 h-3.5 rounded-xs bg-primary"></div>
                    Ca trưa: 10:00 - 14:00
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-3.5 h-3.5 rounded-xs bg-[#008CFF]"></div>
                    Ca chiều: 14:00 - 18:00
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-3.5 h-3.5 rounded-xs bg-[#746C82]"></div>
                    Ca tối: 18:00 - 22:00
                </div>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="text-md">Phân công tự động</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[50vh]">
                    <DialogHeader>
                        <DialogTitle>Phân công tự động</DialogTitle>
                        <DialogDescription>
                            Bạn muốn thực hiện phân công tự động cho nhân viên trong tuần tiếp theo ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogTrigger asChild>
                            <Button variant="secondary">Thoát</Button>
                        </DialogTrigger>
                        <Button>Thực hiện phân công</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="text-md">
                        <Icon icon="uil:setting" className="size-4"/>
                        Tùy chỉnh
                    </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-[80vw] overflow-y-auto max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Tùy chỉnh quy tắc phân công tự động</DialogTitle>
                        <DialogDescription>
                            Bạn có thể tùy chỉnh quy tắc phân công ca làm việc tự động cho nhân viên bán thời gian tại đây
                        </DialogDescription>
                    </DialogHeader>
                    <RuleOptions />
                    <DialogFooter>
                        <DialogTrigger asChild>
                            <Button variant="secondary">Thoát</Button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                            <Button>Thực hiện phân công</Button>
                        </DialogTrigger>
                        <Button>Lưu tùy chỉnh</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ShiftFilter;