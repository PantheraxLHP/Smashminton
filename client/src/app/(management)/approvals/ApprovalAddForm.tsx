import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Employees } from "@/types/types";
import { formatPrice } from '@/lib/utils';
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ComboboxItem {
    cblabel: string,
    cbvalue: string | number,
}

interface ApprovalAddFormProps {
    employees: Employees[]
    rewardRules?: any[];
    rewardNote?: string;
    setRewardNote?: React.Dispatch<React.SetStateAction<string>>;
}

const ApprovalAddForm: React.FC<ApprovalAddFormProps> = ({
    employees,
    rewardRules,
    rewardNote,
    setRewardNote,
}) => {
    const cbItems: ComboboxItem[] = employees.map((employee) => ({
        cblabel: `${employee.employeeid} - ${employee.accounts?.fullname}`,
        cbvalue: `${employee.employeeid} - ${employee.accounts?.fullname}`
    }));

    const [selectedValue, setSelectedValue] = useState<string | number | null | undefined>(null);

    return (
        <div className="flex flex-col h-full gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-end gap-5 w-full">
                    <span className="text-xs font-semibold flex-shrink-0">
                        Mã - Tên nhân viên
                    </span>
                    <div className="w-full px-3 py-2 h-full border rounded-lg">
                        {selectedValue || "Chọn mã - tên nhân viên ..."}
                    </div>
                </div>
                <Command className="border-2 rounded-lg">
                    <CommandInput placeholder={`Tìm kiếm mã - tên nhân viên ...`} />
                    <CommandList>
                        <CommandEmpty>{`Không tìm thấy mã - tên nhân viên`}</CommandEmpty>
                        <CommandGroup className="max-h-40 overflow-y-auto ">
                            {cbItems.map((item) => (
                                <CommandItem
                                    key={item.cbvalue}
                                    value={(item.cbvalue).toString()}
                                    onSelect={(newValue) => {
                                        setSelectedValue(newValue === selectedValue ? undefined : newValue)
                                    }}
                                >
                                    {item.cblabel}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            selectedValue === item.cbvalue ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
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
                    htmlFor="new-rewardnote"
                >
                    Ghi chú
                </Label>
                <Textarea
                    id="new-rewardnote"
                    placeholder="Nhập ghi chú tại đây..."
                    value={rewardNote || ''}
                    onChange={(e) => {
                        setRewardNote && setRewardNote(e.target.value);
                    }}
                    className="h-full border-2 border-gray-400"
                />
            </div>
        </div>
    )
}

export default ApprovalAddForm;