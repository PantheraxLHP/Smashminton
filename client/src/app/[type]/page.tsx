'use client'

import { useParams, notFound, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { startOfWeek, endOfWeek, getWeek, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import ShiftFilter from "@/components/shiftAssignment/ShiftFilter";
import AssignmentCalendar from "@/components/shiftAssignment/AssignmentCalendar";
import PersonalShift from "@/components/shiftAssignment/PersonalShift";
import { useAuth } from "@/context/AuthContext";
import { ShiftAssignment, ShiftEnrollment, ShiftDate } from "@/types/types";


const VALID_TYPES = ["enrollments", "assignments"];

const ShiftAssignmentPage = () => {
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
    const [shiftData, setShiftData] = useState<ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[]>([]);
    const [personalShift, setPersonalShift] = useState<ShiftAssignment[] | ShiftEnrollment[]>([]);

    const fetchData = useCallback((userRole: string, pageType: string, radioValue: string) => {
        if (pageType === "enrollments") {
            if (userRole === "employee") {
                setPersonalShift(tmpUserShiftEnrollment);

                if (radioValue === "assignable") {
                    setShiftData(tmpEnrollableShift);
                } else if (radioValue === "assigned") {
                    setShiftData(tmpUserShiftEnrollment);
                }
            }
        }
        else if (pageType === "assignments") {
            if (userRole === "hr_manager") {
                setShiftData(tmpShiftDates);
            } else if (userRole === "wh_manager") {
                setPersonalShift(tmpUserShiftAssignmentFulltime);
                setShiftData(tmpUserShiftAssignmentFulltime);
            } else if (userRole === "employee") {
                setPersonalShift(tmpUserShiftAssignmentParttime);
                setShiftData(tmpUserShiftAssignmentParttime);
            }
        }
    }, []);

    useEffect(() => {
        if (!user) {
            const localUser = {
                accountid: 9999,
                username: "testing",
                accounttype: "testing",
                employees: {
                    employeeid: 9999,
                    role: "hr_manager",
                }
            };
            setUser(localUser);
            // ! router.push("/signin");
            return;
        }

        if (type === "enrollments" && (user.employees?.role === "wh_manager" || user.employees?.role === "hr_manager")) {
            router.push("/assignments");
            return;
        }

        if (type === "enrollments" && user.employees?.role === "employee") {
            setSelectedRadio("assignable");
        } else if (type === "assignments" && user.employees?.role === "hr_manager") {
            setSelectedRadio("fulltime");
        }

        fetchData(user.employees?.role as string, type as string, selectedRadio);
    }, [user, type, router]);

    useEffect(() => {
        if (user) {
            fetchData(user.employees?.role as string, type as string, selectedRadio);
        }
    }, [selectedRadio, user, type]);

    const nextWeekStart = startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 });

    const startTime = ["06:00", "14:00", "06:00", "10:00", "14:00", "18:00"];
    const endTime = ["14:00", "22:00", "10:00", "14:00", "18:00", "22:00"];

    const tmpShiftDates: ShiftDate[] = [];
    for (let i = 1; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            tmpShiftDates.push({
                shiftid: i,
                shiftdate: addDays(nextWeekStart, j),
                shift: {
                    shiftid: i,
                    shiftstarthour: startTime[i - 1],
                    shiftendhour: endTime[i - 1],
                },
                shift_assignment: [
                    {
                        shiftid: i,
                        shiftdate: addDays(nextWeekStart, j),
                        employeeid: Math.floor(Math.random() * 10 + 1),
                    },
                    {
                        shiftid: i,
                        shiftdate: addDays(nextWeekStart, j),
                        employeeid: Math.floor(Math.random() * 10 + 1),
                    },
                    {
                        shiftid: i,
                        shiftdate: addDays(nextWeekStart, j),
                        employeeid: Math.floor(Math.random() * 10 + 1),
                    },
                ]
            });
        }
    }

    const tmpUserShiftAssignmentFulltime: ShiftAssignment[] = [
        {
            shiftid: 1,
            shiftdate: new Date(),
            employeeid: 1,
            status: "confirmed",
            shift_date: {
                shiftid: 1,
                shiftdate: new Date(),
                shift: {
                    shiftid: 1,
                    shiftstarthour: startTime[0],
                    shiftendhour: endTime[0],
                }
            }
        },
        {
            shiftid: 2,
            shiftdate: new Date(),
            employeeid: 1,
            status: "refused",
            shift_date: {
                shiftid: 2,
                shiftdate: new Date(),
                shift: {
                    shiftid: 2,
                    shiftstarthour: startTime[1],
                    shiftendhour: endTime[1],
                }
            },
        },
    ];

    const tmpUserShiftAssignmentParttime: ShiftAssignment[] = [
        {
            shiftid: 3,
            shiftdate: new Date(),
            employeeid: 1,
            status: "confirmed",
            shift_date: {
                shiftid: 3,
                shiftdate: new Date(),
                shift: {
                    shiftid: 3,
                    shiftstarthour: startTime[2],
                    shiftendhour: endTime[2],
                }
            },
        },
        {
            shiftid: 4,
            shiftdate: new Date(),
            employeeid: 1,
            status: "refused",
            shift_date: {
                shiftid: 4,
                shiftdate: new Date(),
                shift: {
                    shiftid: 4,
                    shiftstarthour: startTime[3],
                    shiftendhour: endTime[3],
                }
            },
        },
    ]

    const tmpEnrollableShift: ShiftDate[] = [
        {
            shiftid: 3,
            shiftdate: new Date(),
            shift: {
                shiftid: 3,
                shiftstarthour: startTime[2],
                shiftendhour: endTime[2],
            },
        },
        {
            shiftid: 4,
            shiftdate: new Date(),
            shift: {
                shiftid: 4,
                shiftstarthour: startTime[3],
                shiftendhour: endTime[3],
            },
        },
        {
            shiftid: 5,
            shiftdate: new Date(),
            shift: {
                shiftid: 5,
                shiftstarthour: startTime[4],
                shiftendhour: endTime[4],
            },
        },
        {
            shiftid: 6,
            shiftdate: new Date(),
            shift: {
                shiftid: 6,
                shiftstarthour: startTime[5],
                shiftendhour: endTime[5],
            },
        }
    ];

    const tmpUserShiftEnrollment: ShiftEnrollment[] = [
        {
            shiftid: 4,
            shiftdate: new Date(),
            employeeid: 1,
            shift_date: {
                shiftid: 4,
                shiftdate: new Date(),
                shift: {
                    shiftid: 4,
                    shiftstarthour: startTime[3],
                    shiftendhour: endTime[3],
                }
            },
        },
        {
            shiftid: 5,
            shiftdate: new Date(),
            employeeid: 1,
            shift_date: {
                shiftid: 5,
                shiftdate: new Date(),
                shift: {
                    shiftid: 5,
                    shiftstarthour: startTime[4],
                    shiftendhour: endTime[4],
                }
            },
        }
    ];


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
                    role={user?.employees?.role}
                    type={type as "enrollments" | "assignments"}
                />
                <PersonalShift
                    role={user?.employees?.role}
                    type={type as "enrollments" | "assignments"}
                    personalShift={personalShift}
                />
            </div>
            <AssignmentCalendar
                selectedWeek={selectedWeek}
                weekNumber={weekNumber}
                year={year}
                selectedRadio={selectedRadio}
                role={user?.employees?.role}
                type={type as "enrollments" | "assignments"}
                shiftData={shiftData}
            />
        </div>
    );
}

export default ShiftAssignmentPage;