'use client'

import { useParams, notFound, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { startOfWeek, endOfWeek, getWeek } from "date-fns";
import { DateRange } from "react-day-picker";
import ShiftFilter from "@/components/shiftAssignment/ShiftFilter";
import AssignmentCalendar from "@/components/shiftAssignment/AssignmentCalendar";
import PersonalShift from "@/components/shiftAssignment/PersonalShift";
import { useAuth } from "@/context/AuthContext";

const VALID_TYPES = ["enrollments", "assignments"];

const ShiftAssignmentPage = ()  => {
    const { type } = useParams();
    if (!VALID_TYPES.includes(type as string)) {
        notFound();
    }

    const router = useRouter();

    const today = new Date();
    const [selectedWeek, setSelectedWeek] = useState<DateRange>({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 })
    });
    const [weekNumber, setWeekNumber] = useState<number>(getWeek(today, { weekStartsOn: 1 }));
    const [year, setYear] = useState<number>(today.getFullYear());
    const [selectedRadio, setSelectedRadio] = useState<string>("fulltime");
    const { user, setUser } = useAuth();

    useEffect(() => {
        if (!user) {
            const localUser = {
                id: "9999",
                username: "testing",
                accounttype: "testing",
                role: "employee"
            };
            setUser(localUser);
            // ! router.push("/singin");
        }
        else if (type as string === "enrollment" && (user.role === "wh_manager" || user.role === "hr_manager")) {
            router.push("/assignments");
        }
    }, [user, setUser]);

    return (
        <div className="p-4 flex flex-col items-center sm:items-start sm:flex-row gap-5 w-full justify-center h-[95vh]">
            <div className="flex sm:flex-col gap-2 items-center h-fit sm:h-full">
                <ShiftFilter
                    selectedWeek={selectedWeek}
                    setSelectedWeek={setSelectedWeek}
                    weekNumber={weekNumber}
                    setWeekNumber={setWeekNumber}
                    year={year}
                    setYear={setYear}
                    selectedRadio={selectedRadio}
                    onRadioChange={setSelectedRadio}
                    role={user?.role}
                    type={type as "enrollments" | "assignments"}
                />
                <PersonalShift
                    role={user?.role}
                    type={type as "enrollments" | "assignments"}
                    shiftData={[]}
                />
            </div>
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