import { useEffect, useState, Fragment } from "react";
import { ShiftAssignment, ShiftEnrollment, ShiftDate } from "@/types/types";
import ShiftCardDialog from "./ShiftCardDialog";
import ShiftCard from "./ShiftCard";

interface CalendarTimelineProps {
    selectedRadio: string;
    role?: string;
    type: "enrollments" | "assignments";
    shiftData: ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[];
}

const shiftCardColPos = ["2", "3", "4", "5", "6", "7", "8"];
const shiftCardRowPos = ["1", "2", "1", "2", "3", "4"];

const getColPos = (shiftDataSingle: ShiftDate | ShiftAssignment | ShiftEnrollment) => {
    const tmp = shiftDataSingle.shiftdate.getDay();
    const index = tmp === 0 ? 6 : tmp - 1;
    return shiftCardColPos[index];
}

const getRowPos = (shiftDataSingle: ShiftDate | ShiftAssignment | ShiftEnrollment) => {
    return shiftCardRowPos[shiftDataSingle.shiftid - 1];
}

const getGridRowNum = (type: "assignments" | "enrollments", role: string, selectedRadio: string) => {
    if (type === "assignments") {
        if (role === "hr_manager") {
            return selectedRadio === "parttime" ? 4 : 2;
        } else if (role === "employee") {
            return 4;
        } else if (role === "wh_manager") {
            return 2;
        }
    } else if (type === "enrollments") {
        return 4;
    }
    return 0;
}

const CalendarTimeline: React.FC<CalendarTimelineProps> = ({
    selectedRadio,
    role,
    type,
    shiftData,
}) => {
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;
    const timesInDay = Array.from({ length: 17 }, (_, i) => `${6 + i}:00`);
    const [topOffset, setTopOffset] = useState(0);

    useEffect(() => {
        const updateOffset = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            const startHour = 6;
            const endHour = 22;

            if (hours < startHour || hours >= endHour) {
                setTopOffset(-1);
                return;
            }

            const passedHours = 1 + hours + minutes / 60 - startHour;
            const pixelsPerHour = 44; // h-11 = 44px
            setTopOffset(passedHours * pixelsPerHour);
        };

        updateOffset();
        const interval = setInterval(updateOffset, 60000);
        return () => clearInterval(interval);
    }, []);

    const fulltimeShiftDates = shiftData.filter((shiftDate) => {
        return shiftDate.shiftid < 3;
    });

    const parttimeShiftDates = shiftData.filter((shiftDate) => {
        return shiftDate.shiftid >= 3;
    });

    return (
        <div className="relative min-w-max">
            {/*Đường thể hiện thời gian hiện tại trong khoảng 6h-22h*/}
            {topOffset >= 0 && (
                <div
                    className="absolute left-0 right-0 h-[4px] bg-primary z-1"
                    style={{ top: `${topOffset}px` }}
                />
            )}

            {/*Table thể hiện các ô giờ*/}
            <div className="grid grid-cols-[100px_repeat(7,minmax(165px,_1fr))] border-b border-l border-r rounded-b-lg">
                {timesInDay.map((time, index) => (
                    <Fragment key={`time-${index}`}>
                        <div className="text-sm pt-2 pl-2 pr-1 flex items-end justify-end border-b border-r h-11">
                            {time}
                        </div>
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div
                                key={`cell-${index}-${i}`}
                                className={`h-11 border-b ${i !== 6 ? "border-r" : ""} ${todayIndex === i ? "bg-primary-50" : ""}`}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>

            {/*Table chứa nội dụng của tuần được chọn*/}
            <div
                className="absolute top-[44px] left-0 grid grid-cols-[100px_repeat(7,minmax(165px,_1fr))] w-full"
                style={{
                    gridTemplateRows: `repeat(${getGridRowNum(type as "assignments" | "enrollments", role as string, selectedRadio)}, minmax(0, 1fr))`,
                }}
            >
                {/*Hiện thị 2 loại: ShiftCard (không click được), ShiftCardDialog (click được và hiện Dialog)*/}
                {type as string === "assignments" && role === "hr_manager" && selectedRadio === "parttime" && (parttimeShiftDates as ShiftDate[]).map((shiftDate: ShiftDate, index) => (
                    <Fragment key={`assignment-parttimeshift-${index}`}>
                        <ShiftCardDialog
                            shiftDataSingle={shiftDate}
                            role={role}
                            type={type as "enrollments" | "assignments"}
                        />
                    </Fragment>
                ))}
                {type as string === "assignments" && role === "hr_manager" && selectedRadio === "fulltime" && (fulltimeShiftDates as ShiftDate[]).map((shiftDate: ShiftDate, index) => (
                    <Fragment key={`assignment-fulltimeshift-${index}`}>
                        <ShiftCardDialog
                            shiftDataSingle={shiftDate}
                            role={role}
                            type={type as "enrollments" | "assignments"}
                        />
                    </Fragment>
                ))}
                {type as string === "enrollments" && role === "employee" && selectedRadio === "assignable" && (
                    (shiftData as ShiftDate[]).map((shiftDate: ShiftDate, index) => (
                        <Fragment key={`enrollment-assignable-${index}`}>
                            <div
                                className={`mx-2`}
                                style={{
                                    gridColumn: getColPos(shiftDate),
                                    gridRow: getRowPos(shiftDate),
                                }}
                            >
                                <ShiftCard
                                    shiftDataSingle={shiftDate}
                                    role={role}
                                    type={type as "enrollments" | "assignments"}
                                    selectedRadio={selectedRadio}
                                />
                            </div>
                        </Fragment>
                    ))
                )}
                {type as string === "enrollments" && role === "employee" && selectedRadio === "assigned" && (
                    (shiftData as ShiftEnrollment[]).map((enrollment: ShiftEnrollment, index) => (
                        <Fragment key={`enrollment-assigned-${index}`}>
                            <div
                                className={`mx-2`}
                                style={{
                                    gridColumn: getColPos(enrollment),
                                    gridRow: getRowPos(enrollment),
                                }}
                            >
                                <ShiftCard
                                    shiftDataSingle={enrollment}
                                    role={role}
                                    type={type as "enrollments" | "assignments"}
                                    selectedRadio={selectedRadio}
                                />
                            </div>
                        </Fragment>
                    ))
                )}
                {type as string === "assignments" && (role === "employee" || role === "wh_manager") && (
                    (shiftData as ShiftAssignment[]).map((assignment: ShiftAssignment, index) => (
                        <Fragment key={`assignment-${index}`}>
                            <div
                                className={`mx-2`}
                                style={{
                                    gridColumn: getColPos(assignment),
                                    gridRow: getRowPos(assignment),
                                }}
                            >
                                <ShiftCard
                                    shiftDataSingle={assignment}
                                    role={role}
                                    type={type as "enrollments" | "assignments"}
                                    selectedRadio={selectedRadio}
                                />
                            </div>
                        </Fragment>
                    ))
                )}
            </div>
        </div>
    );
};

export default CalendarTimeline;
