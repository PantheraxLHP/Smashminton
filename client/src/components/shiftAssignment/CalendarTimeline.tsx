import { useEffect, useState, Fragment } from "react";

const CalendarTimeline = () => {
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
        const interval = setInterval(updateOffset, 60000); // update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            {/*Time indicator line*/}
            {topOffset >= 0 && (
                <div
                    className="absolute left-0 right-0 h-[2px] bg-primary z-50"
                    style={{ top: `${topOffset}px` }}
                />
            )}

            <div className="grid grid-cols-[100px_repeat(7,minmax(0px,_1fr))] border-b border-l border-r rounded-b-lg">
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
        </div>
    );
};

export default CalendarTimeline;
