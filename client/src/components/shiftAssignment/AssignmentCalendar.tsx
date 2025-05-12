import CalendarHeader from "@/components/shiftAssignment/CalendarHeader";
import CalendarTimeline from "@/components/shiftAssignment/CalendarTimeline";
import { DateRange } from "react-day-picker";

interface AssignmentCalendarProps {
    selectedWeek: DateRange;
    weekNumber: number;
    year: number;
}

const AssignmentCalendar: React.FC<AssignmentCalendarProps> = ({
    selectedWeek,
    weekNumber,
    year,
}) => {
    return (
        <div className="w-full overflow-x-auto">
            <CalendarHeader
                selectedWeek={selectedWeek}
                weekNumber={weekNumber}
                year={year}
            />
            <CalendarTimeline />
        </div>
    );
}

export default AssignmentCalendar;