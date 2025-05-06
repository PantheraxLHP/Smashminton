'use client'

import ShiftFilter from "@/components/shiftAssignment/ShiftFilter";
import { useState } from "react";
import { startOfWeek, endOfWeek, getWeek } from "date-fns";
import { DateRange } from "react-day-picker";

const ShiftAssignmentPage = () => {
    const today = new Date();
    const [selectedWeek, setSelectedWeek] = useState<DateRange>({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 })
    });
    const [weekNumber, setWeekNumber] = useState<number>(getWeek(today, { weekStartsOn: 1 }));
    const [year, setYear] = useState<number>(today.getFullYear());

    return (
        <div className="p-4 flex flex-col gap-5 w-full">
            <h1 className="text-2xl font-bold">Shift Assignment Page</h1>
            <ShiftFilter
                selectedWeek={selectedWeek}
                setSelectedWeek={setSelectedWeek}
                weekNumber={weekNumber}
                setWeekNumber={setWeekNumber}
                year={year}
                setYear={setYear}
            />
        </div>
    );
}

export default ShiftAssignmentPage;