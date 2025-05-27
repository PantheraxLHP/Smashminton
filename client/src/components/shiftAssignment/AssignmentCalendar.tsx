import CalendarHeader from "@/components/shiftAssignment/CalendarHeader";
import CalendarTimeline from "@/components/shiftAssignment/CalendarTimeline";
import { DateRange } from "react-day-picker";
import { ShiftAssignment, ShiftEnrollment, ShiftDate } from "@/types/types";

interface AssignmentCalendarProps {
    selectedWeek: DateRange;
    weekNumber: number;
    year: number;
    selectedRadio: string;
    role?: string;
    type: "enrollments" | "assignments";
    shiftData: ShiftDate[] | ShiftEnrollment[] | ShiftAssignment[]; 
}

const AssignmentCalendar: React.FC<AssignmentCalendarProps> = ({
    selectedWeek,
    weekNumber,
    year,
    selectedRadio,
    role,
    type,
    shiftData
}) => {
    return (
        <div className="h-full w-full overflow-x-auto">
            {/* Hiển thị thứ và ngày của tuần đã chọn */}
            <CalendarHeader
                selectedWeek={selectedWeek}
                weekNumber={weekNumber}
                year={year}
            />
            {/* Hiển thị timeline và nội dung của tuần đó */}
            <CalendarTimeline 
                selectedRadio={selectedRadio}
                role={role}
                type={type}
                shiftData={shiftData}
            />
        </div>
    );
}

export default AssignmentCalendar;