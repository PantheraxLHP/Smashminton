import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState, Fragment, useEffect } from 'react';
import AssignmentRuleDetail from './AssignmentRuleDetail';
import { getAutoAssignment, updateAutoAssignment } from '@/services/shiftdate.service';
import { toast } from 'sonner';

export interface RuleCondition {
    conditionName: string;
    conditionValue: string;
}

export interface RuleAction {
    actionName: string;
    actionValue: string;
}

export interface AssignmentRule {
    ruleName: string;
    ruleType: string;
    ruleDescription: string;
    subObj: any[];
    conditions: RuleCondition[];
    actions: RuleAction[];
}

interface AssignmentRuleListProps {
    fullTimeOption?: string;
    setFullTimeOption?: (value: string) => void;
    partTimeOption?: string;
    setPartTimeOption?: (value: string) => void;
}

function formatRuleType(ruleType: string) {
    switch (ruleType) {
        case 'employee':
            return 'Nhân viên';
        case 'enrollmentEmployee':
            return 'Nhân viên (Có đăng ký ca làm)';
        case 'shift':
            return 'Ca làm việc';
        case 'enrollmentShift':
            return 'Ca làm việc (Đã có người đăng ký)';
        default:
            return 'Không xác định';
    }
}

const AssignmentRuleList: React.FC<AssignmentRuleListProps> = ({
    fullTimeOption,
    setFullTimeOption,
    partTimeOption,
    setPartTimeOption,
}) => {
    const [ruleList, setRuleList] = useState<AssignmentRule[]>([]);

    useEffect(() => {
        const fetchAutoAssignment = async () => {
            const response = await getAutoAssignment();
            if (response.ok) {
                setRuleList(response.data);
            } else {
                setRuleList([]);
            }
        };
        fetchAutoAssignment();
    }, []);

    const handleRemoveRule = async (ruleName: string) => {
        if (ruleList.length === 1) {
            toast.error('Không thể xóa quy tắc cuối cùng');
            return;
        }
        const response = await updateAutoAssignment(ruleList.filter((r) => r.ruleName !== ruleName));
        if (response.ok) {
            toast.success('Xóa quy tắc thành công');
            setRuleList(ruleList.filter((r) => r.ruleName !== ruleName));
        } else {
            toast.error(response.message || 'Xóa quy tắc thất bại');
        }
    };
    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-end gap-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Icon icon="ic:baseline-plus" className="" />
                            Thêm quy tắc
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        className="max-h-[80vh] !max-w-[600px] overflow-y-auto"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        <DialogHeader>
                            <DialogTitle>Thêm quy tắc phân công mới</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <AssignmentRuleDetail ruleList={ruleList} setRuleList={setRuleList} />
                    </DialogContent>
                </Dialog>
                <Button variant="outline">
                    <Icon icon="vscode-icons:file-type-excel2" className="" />
                    {'Xuất file Excel (.drl.xlsx)'}
                </Button>
            </div>
            <div className="flex w-full gap-4">
                <div className="flex w-full max-w-full flex-col overflow-x-auto">
                    <div className="grid grid-cols-[repeat(4,minmax(150px,250px))]">
                        <div className="w-full border-b-1 border-b-gray-500 p-2 text-sm font-semibold">Tên quy tắc</div>
                        <div className="w-full border-b-1 border-b-gray-500 p-2 text-sm font-semibold">
                            Đối tượng áp dụng
                        </div>
                        <div className="w-full border-b-1 border-b-gray-500 p-2 text-sm font-semibold">Mô tả</div>
                        <div className="w-full border-b-1 border-b-gray-500 p-2 text-sm font-semibold">Thao tác</div>
                    </div>
                    <div className="grid max-h-[40vh] grid-cols-[repeat(4,minmax(150px,250px))] items-center overflow-auto">
                        {ruleList?.map((rule) => (
                            <Fragment key={`rule-${rule.ruleName}`}>
                                <div className="flex h-full w-full items-center border-b p-2 text-sm break-all">
                                    {rule.ruleName}
                                </div>
                                <div className="flex h-full w-full items-center border-b p-2 text-sm">
                                    {formatRuleType(rule.ruleType)}
                                </div>
                                <div className="flex h-full w-full items-center border-b p-2 text-sm">
                                    {rule.ruleDescription}
                                </div>
                                <div className="flex h-full w-full flex-wrap items-center justify-center gap-2 border-b p-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="group w-full">
                                                <Icon
                                                    icon="uil:setting"
                                                    className="size-5 transition-all duration-300 group-hover:size-6 group-hover:rotate-180"
                                                />
                                                <span className="group-hover:font-semibold">Chỉnh sửa</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent
                                            className="max-h-[80vh] !max-w-[600px] overflow-y-auto"
                                            onOpenAutoFocus={(e) => e.preventDefault()}
                                        >
                                            <DialogHeader>
                                                <DialogTitle>Chỉnh sửa quy tắc phân công</DialogTitle>
                                                <DialogDescription></DialogDescription>
                                            </DialogHeader>
                                            <AssignmentRuleDetail
                                                AssignmentRule={rule}
                                                ruleList={ruleList}
                                                setRuleList={setRuleList}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        variant="outline_destructive"
                                        className="group w-full"
                                        onClick={() => {
                                            handleRemoveRule(rule.ruleName);
                                        }}
                                    >
                                        <Icon
                                            icon="material-symbols:delete-outline-rounded"
                                            className="size-5 transition-all duration-300 group-hover:size-6"
                                        />
                                        <span className="group-hover:font-semibold">Xóa</span>
                                    </Button>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </div>
                <div className="flex w-80 flex-col gap-2 rounded-lg border-2 p-4">
                    <div className="flex w-full flex-col items-center justify-between gap-5">
                        <div className="flex w-full flex-col gap-1">
                            <span className="text-sm font-semibold">Chế độ phân công cho nhân viên toàn thời gian</span>
                            <Select value={fullTimeOption} onValueChange={setFullTimeOption}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn chế độ phân công" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="same">Như tuần trước</SelectItem>
                                    <SelectItem value="rotate">Xoay tua buổi</SelectItem>
                                    <SelectItem value="random">Ngẫu nhiên</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-full flex-col gap-1">
                            <span className="text-sm font-semibold">
                                Ưu tiên phân công cho nhân viên bán thời gian theo
                            </span>
                            <Select value={partTimeOption} onValueChange={setPartTimeOption}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại ưu tiên" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="0">Không ưu tiên</SelectItem>
                                    <SelectItem value="1">Số ca được phân công ít nhất</SelectItem>
                                    <SelectItem value="2">Điểm ưu tiên của nhân viên cao nhất</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentRuleList;
