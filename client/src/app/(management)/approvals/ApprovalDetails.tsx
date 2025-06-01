import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MonthlyNote } from "@/types/types";
import { getStatusText, getButtonVariant } from "./ApprovalList";
import { formatPrice } from '@/lib/utils';

interface ApprovalDetailsProps {
    note: MonthlyNote;
}

const ApprovalDetails: React.FC<ApprovalDetailsProps> = ({
    note,
}) => {
    return (
        <div className="flex flex-col h-full gap-4 w-full">
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Mã nhân viên</span>
                    <span className="">{note.employeeid}</span>
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Họ tên</span>
                    <span className="">{note.employees?.accounts?.fullname}</span>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Loại thưởng</span>
                    <span className="">Thưởng hiệu suất</span>
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Số tiền thưởng</span>
                    <span className="">
                        + {formatPrice(note.noterewardamount || 0)}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Tháng - Năm</span>
                    <span className="">
                        {(note.createdat)?.toLocaleDateString("vi-VN", {
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Trạng thái</span>
                    <Button
                        variant={getButtonVariant(note)}
                        disabled
                        className="w-fit disabled:opacity-100"
                    >
                        {getStatusText(note)}
                    </Button>
                </div>
            </div>
            <div className="flex flex-col h-full gap-1">
                <Label
                    className="text-xs font-semibold"
                    htmlFor="note"
                >
                    Ghi chú
                </Label>
                <Textarea
                    id="note"
                    placeholder="Nhập ghi chú tại đây..."
                    value={note.notecontent}
                    onChange={(e) => {
                        note.notecontent = e.target.value;
                    }}
                    className="h-full border-2 border-gray-400"
                />
            </div>
        </div>
    )
}

export default ApprovalDetails;