import { useEffect, useState, Fragment } from 'react';
import { ShiftAssignment, ShiftEnrollment, ShiftDate } from '@/types/types';
import ShiftCardDialog from './ShiftCardDialog';
import ShiftCard from './ShiftCard';

interface CalendarTimelineProps {
    selectedRadio: string;
    role?: string;
    type: 'enrollments' | 'assignments';
    shiftData: ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[];
    onDataChanged?: () => void;
}

const shiftCardColPos = ['2', '3', '4', '5', '6', '7', '8'];
const shiftCardRowPos = ['1', '2', '1', '2', '3', '4'];

const getColPos = (shiftDataSingle: ShiftDate | ShiftAssignment | ShiftEnrollment) => {
    // Convert string date to Date object if needed
    const shiftDate =
        shiftDataSingle.shiftdate instanceof Date ? shiftDataSingle.shiftdate : new Date(shiftDataSingle.shiftdate);
    const tmp = shiftDate.getDay();
    const index = tmp === 0 ? 6 : tmp - 1;
    return shiftCardColPos[index];
};

const getRowPos = (shiftDataSingle: ShiftDate | ShiftAssignment | ShiftEnrollment) => {
    return shiftCardRowPos[shiftDataSingle.shiftid - 1];
};

const getGridRowNum = (type: 'assignments' | 'enrollments', role: string, selectedRadio: string) => {
    if (type === 'assignments') {
        if (role === 'hr_manager') {
            return selectedRadio === 'parttime' ? 4 : 2;
        } else if (role === 'employee') {
            return 4;
        } else if (role === 'wh_manager') {
            return 2;
        }
    } else if (type === 'enrollments') {
        return 4;
    }
    return 0;
};

const CalendarTimeline: React.FC<CalendarTimelineProps> = ({ selectedRadio, role, type, shiftData, onDataChanged }) => {
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
                <div className="bg-primary absolute right-0 left-0 z-1 h-[4px]" style={{ top: `${topOffset}px` }} />
            )}

            {/*Table thể hiện các ô giờ*/}
            <div className="grid grid-cols-[100px_repeat(7,minmax(165px,_1fr))] rounded-b-lg border-r border-b border-l">
                {timesInDay.map((time, index) => (
                    <Fragment key={`time-${index}`}>
                        <div className="flex h-11 items-end justify-end border-r border-b pt-2 pr-1 pl-2 text-sm">
                            {time}
                        </div>
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div
                                key={`cell-${index}-${i}`}
                                className={`h-11 border-b ${i !== 6 ? 'border-r' : ''} ${todayIndex === i ? 'bg-primary-50' : ''}`}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>

            {/*Table chứa nội dụng của tuần được chọn*/}
            <div
                className="absolute top-[44px] left-0 grid w-full grid-cols-[100px_repeat(7,minmax(165px,_1fr))]"
                style={{
                    gridTemplateRows: `repeat(${getGridRowNum(type as 'assignments' | 'enrollments', role as string, selectedRadio)}, minmax(0, 1fr))`,
                }}
            >
                {/*Hiện thị 2 loại: ShiftCard (không click được), ShiftCardDialog (click được và hiện Dialog)*/}
                {(type as string) === 'assignments' &&
                    role === 'hr_manager' &&
                    selectedRadio === 'parttime' &&
                    (parttimeShiftDates as ShiftDate[]).map((shiftDate: ShiftDate, index) => (
                        <Fragment key={`assignment-parttimeshift-${index}`}>
                            <ShiftCardDialog
                                shiftDataSingle={shiftDate}
                                role={role}
                                type={type as 'enrollments' | 'assignments'}
                                onDataChanged={onDataChanged}
                            />
                        </Fragment>
                    ))}
                {(type as string) === 'assignments' &&
                    role === 'hr_manager' &&
                    selectedRadio === 'fulltime' &&
                    (fulltimeShiftDates as ShiftDate[]).map((shiftDate: ShiftDate, index) => (
                        <Fragment key={`assignment-fulltimeshift-${index}`}>
                            <ShiftCardDialog
                                shiftDataSingle={shiftDate}
                                role={role}
                                type={type as 'enrollments' | 'assignments'}
                                onDataChanged={onDataChanged}
                            />
                        </Fragment>
                    ))}
                {(type as string) === 'enrollments' &&
                    role === 'employee' &&
                    selectedRadio === 'assignable' &&
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
                                    type={type as 'enrollments' | 'assignments'}
                                    selectedRadio={selectedRadio}
                                    onDataChanged={onDataChanged}
                                />
                            </div>
                        </Fragment>
                    ))}
                {(type as string) === 'enrollments' &&
                    role === 'employee' &&
                    selectedRadio === 'assigned' &&
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
                                    type={type as 'enrollments' | 'assignments'}
                                    selectedRadio={selectedRadio}
                                    onDataChanged={onDataChanged}
                                />
                            </div>
                        </Fragment>
                    ))}
                {(type as string) === 'enrollments' &&
                    role === 'employee' &&
                    selectedRadio === 'enrolled' &&
                    (shiftData as ShiftDate[]).map((shiftDate: ShiftDate, index) => (
                        <Fragment key={`enrollment-enrolled-${index}`}>
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
                                    type={type as 'enrollments' | 'assignments'}
                                    selectedRadio={selectedRadio}
                                    onDataChanged={onDataChanged}
                                />
                            </div>
                        </Fragment>
                    ))}
                {(type as string) === 'enrollments' &&
                    role === 'employee' &&
                    selectedRadio === 'unenrolled' &&
                    (shiftData as ShiftDate[]).map((shiftDate: ShiftDate, index) => (
                        <Fragment key={`enrollment-unenrolled-${index}`}>
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
                                    type={type as 'enrollments' | 'assignments'}
                                    selectedRadio={selectedRadio}
                                    onDataChanged={onDataChanged}
                                />
                            </div>
                        </Fragment>
                    ))}
                {(type as string) === 'assignments' &&
                    (role === 'employee' || role === 'wh_manager') &&
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
                                    type={type as 'enrollments' | 'assignments'}
                                    selectedRadio={selectedRadio}
                                    onDataChanged={onDataChanged}
                                />
                            </div>
                        </Fragment>
                    ))}
            </div>
        </div>
    );
};

export default CalendarTimeline;
