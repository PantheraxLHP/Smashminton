import { ShiftEnrollment, ShiftAssignment, Shift } from "@/types/types";

interface PersonalShiftProps {
    role?: string;
    type: "enrollments" | "assignments";
    shiftData: ShiftEnrollment[] | ShiftAssignment[];
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

const PersonalShift: React.FC<PersonalShiftProps> = ({
    role,
    type,
    shiftData,
}) => {
    const shiftDataGroupedByDate = shiftData.reduce((acc: { [key: string]: ShiftEnrollment[] | ShiftAssignment[] }, shift) => {
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
            {role === "employee" && type === "enrollments" && (
                <div className="flex flex-col items-center w-full h-full rounded-lg border p-2">
                    <div className="text-primary">
                        Đã đăng ký: <span className="text-2xl font-bold">{shiftData.length}</span> ca làm việc
                    </div>
                    {Object.values(shiftDataGroupedByDate).map((shiftDate: ShiftEnrollment[]) =>
                        shiftDate.map((shift) => {
                            const date = shift.shiftdate.toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            });

                            const dateIndex = shift.shiftdate.getDay() === 0 ? 6 : shift.shiftdate.getDay() - 1;

                            return (
                                <div key={`shift-${shift.shiftid}-emp-${shift.employeeid}`} className="flex flex-col items-center gap-1">
                                    <span className="text-2xl font-bold">{`${weekDayNames[dateIndex]}-${date}`}</span>
                                    <div className={`${colorIndex[shift.shiftid - 1]} rounded-lg w-full`}>
                                        {`${shift.shift_date?.shift?.shiftstarthour} - ${shift.shift_date?.shift?.shiftendhour}`}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
            {(role === "employee" || role === "wh_manager") && type === "assignments" && (
                <div className="flex flex-col items-center w-full h-full rounded-lg border p-2">
                    {role === "employee" && (
                        <div className="text-primary">
                            Xác nhận: <span className="text-2xl font-bold">0</span>/<span className="font-bold">{shiftData.length}</span> ca làm việc
                        </div>
                    )}
                    {Object.values(shiftDataGroupedByDate).map((shiftDate: ShiftAssignment[]) => 
                        shiftDate.map((shift) => {
                            const date = shift.shiftdate.toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            });

                            const dateIndex = shift.shiftdate.getDay() === 0 ? 6 : shift.shiftdate.getDay() - 1;

                            return (
                                <div key={`shift-${shift.shiftid}-emp-${shift.employeeid}`} className="flex flex-col items-center gap-1">
                                    <span className="text-2xl font-bold">{`${weekDayNames[dateIndex]}-${date}`}</span>
                                    <div className={`${colorIndex[shift.shiftid - 1]} rounded-lg w-full`}>
                                        {`${shift.shift_date?.shift?.shiftstarthour} - ${shift.shift_date?.shift?.shiftendhour}`}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </>
    );
};

export default PersonalShift;