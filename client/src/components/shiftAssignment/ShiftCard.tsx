import { ShiftDate, ShiftAssignment } from "@/types/types";
import { getDay } from "date-fns";

const colorIndex = [
    "bg-yellow-500",
    "bg-[#008CFF]",
    "bg-yellow-500",
    "bg-primary",
    "bg-[#008CFF]",
    "bg-[#746C82]"
];
const borderColorIndex = [
    "border-yellow-500 group-hover:border-yellow-500",
    "border-[#008CFF] group-hover:border-[#008CFF]",
    "border-yellow-500 group-hover:border-yellow-500",
    "border-primary group-hover:border-primary",
    "border-[#008CFF] group-hover:border-[#008CFF]",
    "border-[#746C82] group-hover:border-[#746C82]"
];
const pixelsPerHourH = 44;
const pixelsPerParttimeShiftH = pixelsPerHourH * 4;
const pixelsPerFulltimeShiftH = pixelsPerHourH * 8;

const getHeight = (shiftDate: ShiftDate) => {
    if (shiftDate.shiftid < 3) {
        return pixelsPerFulltimeShiftH;
    }
    else {
        return pixelsPerParttimeShiftH;
    }
}

interface ShiftCardProps {
    shiftDate: ShiftDate;
    shiftAssignments: ShiftAssignment[];
}

const ShiftCard: React.FC<ShiftCardProps> = ({
    shiftDate,
    shiftAssignments,
}) => {
    return (
        <div
            className={`group flex flex-col z-2 cursor-pointer`}
            style={{
                height: `${getHeight(shiftDate)}px`,
            }}
        >
            <div
                className={`text-center text-sm font-semibold text-white ${colorIndex[shiftDate.shiftid - 1]} rounded-t-lg p-1 h-fit`}
            >
                {`${shiftDate.shift?.shiftstarthour} - ${shiftDate.shift?.shiftendhour}`}
            </div>
            <div
                className={`flex flex-col gap-2 p-2 rounded-b-lg h-full border-l-2 border-b-2 border-r-2 bg-white z-2 hover:${borderColorIndex[shiftDate.shiftid - 1]}`}>
                {shiftAssignments.length > 0 ? (
                    <>
                    </>
                ) : (
                    <div className="h-full flex justify-center text-sm text-red-500 p-2">
                        Chưa có phân công
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShiftCard;