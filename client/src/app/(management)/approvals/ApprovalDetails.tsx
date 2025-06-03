import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RewardRecords } from "@/types/types";
import { getStatusText, getButtonVariant } from "./ApprovalList";
import { formatPrice } from '@/lib/utils';

interface ApprovalDetailsProps {
    record: RewardRecords;
}

const ApprovalDetails: React.FC<ApprovalDetailsProps> = ({
    record,
}) => {
    return (
        <div className="flex flex-col h-full gap-4 w-full">
            <div className="flex items-center justify-between gap-10">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Mã nhân viên</span>
                    <span className="">{record.employeeid}</span>
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Họ tên</span>
                    <span className="">{record.employees?.accounts?.fullname}</span>
                </div>
            </div>
            <div className="flex items-center justify-between gap-10">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Tháng - Năm</span>
                    <span className="">
                        {(record.rewarddate)?.toLocaleDateString("vi-VN", {
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Trạng thái</span>
                    <Button
                        variant={getButtonVariant(record)}
                        disabled
                        className="w-fit disabled:opacity-100"
                    >
                        {getStatusText(record)}
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-between gap-10">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Loại thưởng</span>
                    <span className="">Thưởng hiệu suất</span>
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Số tiền thưởng</span>
                    <span className="">
                        + {formatPrice(record.finalrewardamount || 0)}
                    </span>
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
                    disabled={record.rewardrecordstatus !== "pending"}
                    id="note"
                    placeholder="Nhập ghi chú tại đây..."
                    value={record.rewardnote || ""}
                    onChange={(e) => {
                        record.rewardnote = e.target.value;
                    }}
                    className="h-full border-2 border-gray-400"
                />
            </div>
        </div>
    )
}

export default ApprovalDetails;