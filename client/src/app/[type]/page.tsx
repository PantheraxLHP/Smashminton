'use client'

import { useParams, notFound, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { startOfWeek, endOfWeek, getWeek, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import ShiftFilter from "@/components/shiftAssignment/ShiftFilter";
import AssignmentCalendar from "@/components/shiftAssignment/AssignmentCalendar";
import PersonalShift from "@/components/shiftAssignment/PersonalShift";
import { useAuth } from "@/context/AuthContext";
import { ShiftAssignment, ShiftEnrollment, ShiftDate } from "@/types/types";


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
    const [shiftData, setShiftData] = useState<ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[]>([]);
    const [personalShift, setPersonalShift] = useState<ShiftAssignment[] | ShiftEnrollment[]>([]);

    useEffect(() => {
        if (!user) {
            const localUser = {
                sub: 9999,
                username: "testing",
                accounttype: "testing",
                role: "hr_manager",
            };
            setUser(localUser);
            // ! router.push("/singin");
        }
        else if (type as string === "enrollments" && (user.role === "wh_manager" || user.role === "hr_manager")) {
            console.log("HR Manager or WH Manager cannot access enrollments page");
            router.push("/assignments");
        }

        const fetchEnrollableShift = async () => {
            // ! setShiftData(data);
            // --> Data được lấy từ API được dùng cho trang đăng ký (Enrollment)
            // của role employee với chế độ hiển thị các ca làm có thể đăng ký
            setShiftData(tmpEnrollableShift);
        }

        const fetchShiftDateWithAssignment = async () => {
            // ! setShiftData(data);
            // --> Data được lấy từ API được dùng cho trang phân công (Assignment)
            // của role hr_manager hiển thị danh sách ca làm trong tuần
            // và các nhân viên đã được phân công trong ca làm đó
            setShiftData(tmpShiftDates);
        }

        const fetchShiftEnrollment = async () => {
            // ! setPersonalShift(data);
            // --> Data được lấy từ API được dùng cho trang đăng ký (Enrollment)
            // của role employee với chế độ hiện thị các ca làm đã đăng ký
            // và phần PersonalShift ở dưới
            setPersonalShift(tmpUserShiftEnrollment);
        }

        const fetchShiftAssignment = async () => {
            // ! setPersonalShift(data);
            // --> Data được lấy từ API được dùng cho trang phân công (Assignment)
            // của role employee, wh_manager để hiện thị các ca làm được phân công
            // cho nhân viên
            setPersonalShift(tmpUserShiftAssignment);
            setShiftData(tmpUserShiftAssignment)
            console.log(shiftData);
        }

        if (type as string === "enrollments" && user?.role === "employee") {
            setSelectedRadio("assignable");
            fetchEnrollableShift();
            fetchShiftEnrollment();
            console.log("fetchEnrollableShift and fetchShiftEnrollment for employee in enrollments");
        }
        else if (type as string === "assignments" && (user?.role === "employee" || user?.role === "wh_manager")) {
            fetchShiftAssignment();
            console.log("fetchShiftAssignment for employee or wh_manager in assignments");
        }
        else if (type as string === "assignments" && user?.role === "hr_manager") {
            setSelectedRadio("fulltime");
            fetchShiftDateWithAssignment();
            console.log("fetchShiftDateWithAssignment for hr_manager in assignments");
        }

        console.log("TEST USEEFFECT: ", type as string, user?.role);
    }, [user, setUser, type, router]);

    useEffect(() => {
        if (type as string === "enrollments" && selectedRadio === "assignable") {
            setShiftData(tmpEnrollableShift);
        }
        else if (type as string === "enrollments" && selectedRadio === "assigned") {
            setShiftData(tmpUserShiftEnrollment);
        }
    }, [selectedRadio])

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

    const tmpUserShiftAssignment: ShiftAssignment[] = [
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
        {
            shiftid: 3,
            shiftdate: addDays(new Date(), 1),
            employeeid: 1,
            status: "pending",
            shift_date: {
                shiftid: 3,
                shiftdate: addDays(new Date(), 1),
                shift: {
                    shiftid: 3,
                    shiftstarthour: startTime[2],
                    shiftendhour: endTime[2],
                }
            },
        }
    ];

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
                    role={user?.role}
                    type={type as "enrollments" | "assignments"}
                />
                <PersonalShift
                    role={user?.role}
                    type={type as "enrollments" | "assignments"}
                    personalShift={personalShift}
                />
            </div>
            <AssignmentCalendar
                selectedWeek={selectedWeek}
                weekNumber={weekNumber}
                year={year}
                selectedRadio={selectedRadio}
                role={user?.role}
                type={type as "enrollments" | "assignments"}
                shiftData={shiftData}
            />
        </div>
    );
}

export default ShiftAssignmentPage;