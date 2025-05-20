'use client'

import { useState } from "react";
import { startOfWeek, endOfWeek, getWeek } from "date-fns";
import { DateRange } from "react-day-picker";
import ShiftFilter from "@/components/shiftAssignment/ShiftFilter";
import AssignmentCalendar from "@/components/shiftAssignment/AssignmentCalendar";
import { useAuth } from "@/context/AuthContext";

const ShiftAssignmentPage = () => {
    const today = new Date();
    const [selectedWeek, setSelectedWeek] = useState<DateRange>({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 })
    });
    const [weekNumber, setWeekNumber] = useState<number>(getWeek(today, { weekStartsOn: 1 }));
    const [year, setYear] = useState<number>(today.getFullYear());
    const [selectedRadio, setSelectedRadio] = useState<string>("fulltime");
    const { user } = useAuth();

    return (
        <div className="p-4 flex flex-col items-center sm:items-start sm:flex-row gap-5 w-full justify-center">
            <ShiftFilter
                selectedWeek={selectedWeek}
                setSelectedWeek={setSelectedWeek}
                weekNumber={weekNumber}
                setWeekNumber={setWeekNumber}
                year={year}
                setYear={setYear}
                selectedRadio={selectedRadio}
                onRadioChange={setSelectedRadio}
            />
            <AssignmentCalendar
                selectedWeek={selectedWeek}
                weekNumber={weekNumber}
                year={year}
                selectedRadio={selectedRadio}
            />
        </div>
    );
}

export default ShiftAssignmentPage;