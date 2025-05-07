import WeekPicker, { WeekPickerProps } from "./WeekPicker";
import { Button } from "@/components/ui/button"
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
            <Button variant="outline" className="text-md">Phân công tự động</Button>
            <Button variant="outline" className="text-md">
                <Icon icon="uil:setting" className="size-4"/>
                Tùy chỉnh
            </Button>
        </div>
    );
};

export default ShiftFilter;