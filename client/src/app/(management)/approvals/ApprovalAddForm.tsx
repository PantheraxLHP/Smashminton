import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Employees, RewardRules } from '@/types/types';
import { formatPrice } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getRewardRules, postRewardRecord } from '@/services/rewards.service';

export interface ComboboxItem {
    cblabel: string;
    cbvalue: string | number;
}

interface ApprovalFormData {
    employeeId: number;
    rewardType: string;
    rewardAmount: number;
    rewardNote: string;
}

interface ApprovalAddFormProps {
    employees: Employees[];
    rewardNote?: string;
    setRewardNote?: React.Dispatch<React.SetStateAction<string>>;
    setIsAddDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApprovalAddForm: React.FC<ApprovalAddFormProps> = ({
    employees,
    rewardNote,
    setRewardNote,
    setIsAddDialogOpen,
}) => {
    const [rewardRules, setRewardRules] = useState<RewardRules[]>([]);

    useEffect(() => {
        const fetchRewardRules = async () => {
            const result = await getRewardRules();
            setRewardRules(result.data);
        };

        fetchRewardRules();
    }, []);

    const uniqueEmployees = employees.filter(
        (employee, index, self) => index === self.findIndex((t) => t.employeeid === employee.employeeid),
    );

    const cbItems: ComboboxItem[] = uniqueEmployees.map((employee) => ({
        cblabel: `${employee.employeeid} - ${employee.accounts?.fullname}`,
        cbvalue: `${employee.employeeid} - ${employee.accounts?.fullname}`,
    }));

    const [formData, setFormData] = useState<ApprovalFormData>({
        employeeId: 0,
        rewardType: '',
        rewardAmount: 0,
        rewardNote: rewardNote || '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.employeeId) {
            toast.error('Vui lòng chọn nhân viên!');
            return;
        }

        if (!formData.rewardType) {
            toast.error('Vui lòng chọn loại thưởng!');
            return;
        }

        if (!formData.rewardNote.trim()) {
            toast.error('Vui lòng nhập ghi chú!');
            return;
        }

        const result = await postRewardRecord(formData);
        if (result.ok) {
            toast.success('Đã thêm đề xuất thưởng thành công!');
        } else {
            toast.error('Đã thêm đề xuất thưởng thất bại!');
        }

        if (setIsAddDialogOpen) {
            setIsAddDialogOpen(false);
        }
    };

    const handleCancel = () => {
        if (setIsAddDialogOpen) {
            setIsAddDialogOpen(false);
        }
    };

    const handleRewardNoteChange = (value: string) => {
        setFormData((prev) => ({ ...prev, rewardNote: value }));
        if (setRewardNote) {
            setRewardNote(value);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex h-full w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-end gap-5">
                    <span className="flex-shrink-0 text-xs font-semibold">Mã - Tên nhân viên</span>
                    <div className="h-full w-full rounded-lg border px-3 py-2">
                        {formData.employeeId || 'Chọn mã - tên nhân viên ...'}
                    </div>
                </div>
                <Command className="rounded-lg border-2">
                    <CommandInput placeholder={`Tìm kiếm mã - tên nhân viên ...`} />
                    <CommandList>
                        <CommandEmpty>{`Không tìm thấy mã - tên nhân viên`}</CommandEmpty>
                        <CommandGroup className="max-h-40 overflow-y-auto">
                            {cbItems.map((item, index) => (
                                <CommandItem
                                    key={`${item.cbvalue}-${index}`}
                                    value={item.cbvalue.toString()}
                                    onSelect={(newValue) => {
                                        const idString = newValue.split(' - ')[0];
                                        const selectedEmployeeId = Number(idString);
                                        setFormData((prev) => ({ ...prev, employeeId: selectedEmployeeId }));
                                    }}
                                >
                                    {item.cblabel}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            formData.employeeId === item.cbvalue ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>
            <div className="flex items-center justify-between gap-10">
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Tháng - Năm</span>
                    <span className="">
                        {new Date().toLocaleDateString('vi-VN', {
                            month: '2-digit',
                            year: 'numeric',
                        })}
                    </span>
                </div>
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Trạng thái</span>
                    <Button variant="secondary" disabled className="w-fit disabled:opacity-100">
                        Chờ phê duyệt
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-between gap-10">
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Loại thưởng</span>
                    <Select
                        value={formData.rewardType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, rewardType: value }))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn loại thưởng" />
                        </SelectTrigger>
                        <SelectContent>
                            {rewardRules && rewardRules.length > 0 ? (
                                rewardRules.map((rule) => (
                                    <SelectItem key={rule.rewardruleid} value={rule.rewardruleid.toString()}>
                                        {rule.rewardname}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="loading" disabled>
                                    Đang tải loại thưởng...
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-full flex-col gap-1">
                    <span className="text-xs font-semibold">Số tiền thưởng</span>
                    <span className="">+ {formatPrice(formData.rewardAmount)}</span>
                </div>
            </div>
            <div className="flex h-full flex-col gap-1">
                <Label className="text-xs font-semibold" htmlFor="new-rewardnote">
                    Ghi chú
                </Label>
                <Textarea
                    id="new-rewardnote"
                    placeholder="Nhập ghi chú tại đây..."
                    value={formData.rewardNote}
                    onChange={(e) => handleRewardNoteChange(e.target.value)}
                    className="h-full border-2 border-gray-400"
                    required
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={handleCancel}>
                    Hủy
                </Button>
                <Button type="submit" variant="outline">
                    Lưu
                </Button>
            </div>
        </form>
    );
};

export default ApprovalAddForm;
