import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Employees } from "@/types/types";
import Combobox, { ComboboxItem } from "@/components/atomic/Combobox";
import { formatPrice } from '@/lib/utils';
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { set } from "date-fns";

interface ApprovalAddFormProps {
    employees: Employees[]
    rewardRules?: any[];
    noteContent?: string;
    setNoteContent?: React.Dispatch<React.SetStateAction<string>>;
}

const ApprovalAddForm: React.FC<ApprovalAddFormProps> = ({
    employees,
    rewardRules,
    noteContent,
    setNoteContent,
}) => {
    const cbItems: ComboboxItem[] = employees.map((employee) => ({
        cblabel: `${employee.employeeid} - ${employee.accounts?.fullname}`,
        cbvalue: `${employee.employeeid} - ${employee.accounts?.fullname}`
    }));

    const [selectedValue, setSelectedValue] = useState<string | number | null | undefined>(null);

    return (
        <div className="flex flex-col h-full gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
                <span className="text-xs font-semibold">Mã - Tên nhân viên</span>
                <Combobox
                    cbSearchLabel="mã - tên nhân viên"
                    items={cbItems}
                    selectedValue={selectedValue}
                    onSelect={setSelectedValue}
                />
            </div>
            <div className="flex items-center justify-between gap-10">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Tháng - Năm</span>
                    <span className="">
                        {(new Date()).toLocaleDateString("vi-VN", {
                            month: '2-digit',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Trạng thái</span>
                    <Button
                        variant="secondary"
                        disabled
                        className="w-fit disabled:opacity-100"
                    >
                        Chờ phê duyệt
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-between gap-10">
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Loại thưởng</span>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn loại thưởng" />
                        </SelectTrigger>
                        <SelectContent>
                            {/*Cần map ở đây*/}
                            <SelectItem value="performance-bonus">Thưởng hiệu suất</SelectItem>
                            <SelectItem value="periodic-bonus">Thưởng định kỳ</SelectItem>
                            <SelectItem value="event-bonus">Thưởng sự kiện</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs font-semibold">Số tiền thưởng</span>
                    <span className="">
                        + {formatPrice(1000000)}
                    </span>
                </div>
            </div>
            <div className="flex flex-col h-full gap-1">
                <Label
                    className="text-xs font-semibold"
                    htmlFor="new-monthlynote"
                >
                    Ghi chú
                </Label>
                <Textarea
                    id="new-monthlynote"
                    placeholder="Nhập ghi chú tại đây..."
                    value={noteContent || ''}
                    onChange={(e) => {
                        setNoteContent && setNoteContent(e.target.value);
                    }}
                    className="h-full border-2 border-gray-400"
                />
            </div>
        </div>
    )
}

export default ApprovalAddForm;