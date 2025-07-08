import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RewardRecords } from '@/types/types';
import { formatApprovalStatus, formatButtonVariant } from './ApprovalList';
import { formatMonthYear, formatPrice } from '@/lib/utils';
import { DialogFooter, DialogTrigger } from '@/components/ui/dialog';

interface ApprovalDetailsProps {
    record: RewardRecords;
}

const ApprovalDetails = ({ record }: ApprovalDetailsProps) => {
    return (
        <div className="flex h-full w-full flex-col gap-4">
            <div className="flex items-center justify-between gap-10">
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Mã nhân viên</span>
                    <span className="">{record.employeeid}</span>
                </div>
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Họ tên</span>
                    <span className="">{record.employees?.accounts?.fullname}</span>
                </div>
            </div>
            <div className="flex items-center justify-between gap-10">
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Tháng - Năm</span>
                    <span className="">
                        {record.rewardapplieddate ? formatMonthYear(record.rewardapplieddate) : ''}
                    </span>
                </div>
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Trạng thái</span>
                    <Button variant={formatButtonVariant(record)} disabled className="w-fit disabled:opacity-100">
                        {record.rewardrecordstatus ? formatApprovalStatus(record.rewardrecordstatus) : ''}
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-between gap-10">
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Loại thưởng</span>
                    <span className="">{record.reward_rules?.rewardname || ''}</span>
                </div>
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Số tiền thưởng</span>
                    <span className="">+ {formatPrice(record.finalrewardamount || 0)}</span>
                </div>
            </div>
            <div className="flex h-full flex-col gap-1">
                <Label className="text-xs font-semibold" htmlFor="note">
                    Ghi chú
                </Label>
                <Textarea
                    disabled={record.rewardrecordstatus?.toLocaleLowerCase() === 'approved'}
                    id="note"
                    placeholder="Nhập ghi chú tại đây..."
                    value={record.rewardnote || ''}
                    onChange={(e) => {
                        record.rewardnote = e.target.value;
                    }}
                    className="h-full border-2 border-gray-400"
                />
            </div>
            {record.rewardrecordstatus === 'pending' && (
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => {}}>
                        Thoát
                    </Button>
                    <Button variant="outline" onClick={() => {}}>
                        Lưu
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ApprovalDetails;
