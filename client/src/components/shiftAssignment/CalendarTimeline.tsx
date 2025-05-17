import { useEffect, useState, Fragment } from "react";
import { ShiftDate, ShiftAssignment } from "@/types/types";
import { getDay, addDays } from "date-fns";
import ShiftCard from "./ShiftCard";

interface CalendarTimelineProps {
    selectedRadio: string;
}

const CalendarTimeline: React.FC<CalendarTimelineProps> = ({
    selectedRadio,
}) => {
    const today = getDay(new Date());
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
        const interval = setInterval(updateOffset, 60000); // update every minute
        return () => clearInterval(interval);
    }, []);

    const nextWeekStart = addDays(new Date(), 7 - todayIndex);

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
                }
            });
        }
    }

    const tmpShiftAssignments: ShiftAssignment[] = [];
    for (let i = 0; i < 28; i++) {
        tmpShiftAssignments.push({
            shiftid: Math.floor(Math.random() * 6 + 1),
            shiftdate: addDays(nextWeekStart, i % 7),
            employeeid: i,
        });
    }

    const fulltimeShiftDates = tmpShiftDates.filter((shiftDate) => {
        return shiftDate.shiftid < 3;
    });

    const parttimeShiftDates = tmpShiftDates.filter((shiftDate) => {
        return shiftDate.shiftid >= 3;
    });

    return (
        <div className="relative min-w-max">
            {/*Time indicator line*/}
            {topOffset >= 0 && (
                <div
                    className="absolute left-0 right-0 h-[4px] bg-primary z-1"
                    style={{ top: `${topOffset}px` }}
                />
            )}

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

            {/* Shift cards */}
            <div className="absolute top-[44px] left-0 grid grid-cols-[100px_repeat(7,minmax(165px,_1fr))] w-full">
                {selectedRadio === "parttime" && parttimeShiftDates.map((shiftDate, index) => (
                    <Fragment key={`parttimeshift-${index}`}>
                        <ShiftCard
                            shiftDate={shiftDate}
                            shiftAssignments={[]}
                        />
                    </Fragment>
                ))}
                {selectedRadio === "fulltime" && fulltimeShiftDates.map((shiftDate, index) => (
                    <Fragment key={`fulltimeshift-${index}`}>
                        <ShiftCard
                            shiftDate={shiftDate}
                            shiftAssignments={[]}
                        />
                    </Fragment>
                ))}
            </div>

        </div>
    );
};

export default CalendarTimeline;
