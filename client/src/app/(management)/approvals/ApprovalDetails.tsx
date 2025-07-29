import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatMonthYear, formatPrice } from '@/lib/utils';
import { RewardRecords } from '@/types/types';
import { formatApprovalStatus, formatButtonVariant } from './ApprovalList';
import { toast } from 'sonner';
import { patchRewardNote } from '@/services/rewards.service';
import { useState } from 'react';

interface ApprovalDetailsProps {
    record: RewardRecords;
    onSaveSuccess?: () => void;
}

const ApprovalDetails = ({ record, onSaveSuccess }: ApprovalDetailsProps) => {
    const [rewardNote, setRewardNote] = useState(record.rewardnote || '');
    const handleSaveNote = async () => {
        const response = await patchRewardNote(record.rewardrecordid, rewardNote);
        if (response.ok) {
            toast.success('Ghi chú đã được lưu');
            // Refetch data after successful save
            if (onSaveSuccess) {
                onSaveSuccess();
            }
        } else {
            toast.error('Có lỗi xảy ra khi lưu ghi chú');
        }
    };

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
                    disabled={record.rewardrecordstatus?.toLocaleLowerCase() !== 'pending'}
                    id="note"
                    placeholder="Nhập ghi chú tại đây..."
                    value={rewardNote}
                    onChange={(e) => setRewardNote(e.target.value)}
                    className="h-full border-2 border-gray-400"
                />
            </div>
            {record.rewardrecordstatus === 'pending' && (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleSaveNote}>
                        Lưu
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ApprovalDetails;
