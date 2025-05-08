'use client'

import ShiftFilter from "@/components/shiftAssignment/ShiftFilter";
import { useState } from "react";
import { startOfWeek, endOfWeek, getWeek } from "date-fns";
import { DateRange } from "react-day-picker";
import CalendarHeader from "@/components/shiftAssignment/CalendarHeader";
import CalendarTimeline from "@/components/shiftAssignment/CalendarTimeline";

const ShiftAssignmentPage = () => {
    const today = new Date();
    const [selectedWeek, setSelectedWeek] = useState<DateRange>({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 })
    });
    const [weekNumber, setWeekNumber] = useState<number>(getWeek(today, { weekStartsOn: 1 }));
    const [year, setYear] = useState<number>(today.getFullYear());

    return (
        <div className="p-4 flex flex-col sm:flex-row gap-5 w-full">
            <ShiftFilter
                selectedWeek={selectedWeek}
                setSelectedWeek={setSelectedWeek}
                weekNumber={weekNumber}
                setWeekNumber={setWeekNumber}
                year={year}
                setYear={setYear}
            />
            <div className="w-full">
                <CalendarHeader
                    selectedWeek={selectedWeek}
                    weekNumber={weekNumber}
                    year={year}
                />
                <CalendarTimeline />
            </div>
        </div>
    );
}

export default ShiftAssignmentPage;