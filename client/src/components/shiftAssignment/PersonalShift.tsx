import { ShiftEnrollment, ShiftAssignment, Shift } from "@/types/types";
import { Fragment } from "react";

interface PersonalShiftProps {
    role?: string;
    type: "enrollments" | "assignments";
    personalShift: ShiftEnrollment[] | ShiftAssignment[];
}

const colorIndex = [
    "bg-yellow-500",
    "bg-[#008CFF]",
    "bg-yellow-500",
    "bg-primary",
    "bg-[#008CFF]",
    "bg-[#746C82]"
];

const weekDayNames = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

const localDateStringToISODateString = (date: string) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
}

const PersonalShift: React.FC<PersonalShiftProps> = ({
    role,
    type,
    personalShift,
}) => {
    const confirmCount = (personalShift as ShiftAssignment[]).filter((assignment: ShiftAssignment) => {
        return assignment.assignmentstatus === "Confirmed";
    }).length || 0;

    const shiftDataGroupedByDate = personalShift.reduce((acc: { [key: string]: ShiftEnrollment[] | ShiftAssignment[] }, shift) => {
        const date = shift.shiftdate.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(shift);
        return acc;
    }, {});

    return (
        <>
            {(role === "employee" || role === "wh_manager") && (
                <div className="flex flex-col items-center w-full h-full rounded-lg border p-2 gap-5">
                    {role === "employee" && type === "assignments" && (
                        <div className="text-primary">
                            Xác nhận: <span className="text-2xl font-semibold">{confirmCount}</span>/<span className="font-bold">{personalShift.length}</span> ca làm việc
                        </div>
                    )}
                    {role === "employee" && type === "enrollments" && (
                        <div className="text-primary">
                            Đã đăng ký: <span className="text-2xl font-semibold">{personalShift.length}</span> ca làm việc
                        </div>
                    )}
                    {Object.keys(shiftDataGroupedByDate).map((date) => {
                        const ISODate = localDateStringToISODateString(date);
                        const dateIndex = new Date(ISODate).getDay() === 0 ? 6 : new Date(ISODate).getDay() - 1;

                        return (
                            <div
                                key={`shiftDate-${date}`}
                                className="flex flex-col w-full gap-1"
                            >
                                <span className="text-sm">{`${weekDayNames[dateIndex]} - ${date}`}</span>
                                {shiftDataGroupedByDate[date].map((shift) => (
                                    <Fragment
                                        key={`shift-${shift.shiftid}-emp-${shift.employeeid}`}
                                    >
                                        <div
                                            className={`${colorIndex[shift.shiftid - 1]} rounded-sm w-full flex justify-center text-white p-1`}
                                        >
                                            {`${shift.shift_date?.shift?.shiftstarthour} - ${shift.shift_date?.shift?.shiftendhour}`}
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default PersonalShift;