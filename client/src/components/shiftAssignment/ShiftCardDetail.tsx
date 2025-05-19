import { ShiftDate, ShiftAssignment } from "@/types/types";
import { getWeek } from "date-fns";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";

interface ShiftCardDetailProps {
    shiftDate: ShiftDate;
    shiftAssignments: ShiftAssignment[];
}

const getDateString = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `Ngày ${day}, Tháng ${month}, Năm ${year}`;
}

const ShiftCardDetail: React.FC<ShiftCardDetailProps> = ({
    shiftDate,
    shiftAssignments,
}) => {
    const weekNumber = getWeek(shiftDate.shiftdate, { weekStartsOn: 1 });

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center w-full border-b-2 pb-2 border-b-gray-500">
                <div className="text-lg ">
                    {`Chi tiết phân công cho nhân viên ${shiftDate.shiftid < 3 ? "toàn thời gian" : "bán thời gian"}`}
                </div>
                <div className="text-sm">
                    {`Tuần ${weekNumber}, ${getDateString(shiftDate.shiftdate)}, Ca ${shiftDate.shiftid}: ${shiftDate.shift?.shiftstarthour} - ${shiftDate.shift?.shiftendhour}`}
                </div>
            </div>
            <div className="flex gap-2 h-full">
                <div className="flex flex-col gap-1 w-full h-full">
                    <span className="text-xs font-semibold">
                        Danh sách nhân viên được phân công
                    </span>
                    <div className="flex flex-col">
                        <div>
                            Item1
                        </div>
                        <div>
                            Item2
                        </div>
                        <div>
                            Item3
                        </div>
                        <div>
                            Item4
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1 w-full h-full">
                    <span className="text-xs font-semibold">
                        Danh sách nhân viên có thể phân công
                    </span>
                    <div className="relative w-full">
                        <Icon
                            icon="material-symbols:search-rounded"
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-5"
                        />
                        <Input
                            name="search_rulename"
                            type="text"
                            placeholder="Tìm kiếm tên hoặc mã nhân viên"
                            defaultValue={""}
                            className="pl-10 w-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <div>
                            Item1
                        </div>
                        <div>
                            Item2
                        </div>
                        <div>
                            Item3
                        </div>
                        <div>
                            Item4
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShiftCardDetail;