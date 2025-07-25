import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEmployeeSearch } from '@/hooks/useEmployeeSearch';
import { cn, formatPrice } from '@/lib/utils';
import { getRewardRules, postRewardRecord } from '@/services/rewards.service';
import { Employees, EmployeeSearchResult, RewardRules } from '@/types/types';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
    setRewardNote?: (note: string) => void;
    setIsAddDialogOpen?: (open: boolean) => void;
    onAddSuccess?: () => void;
}

const ApprovalAddForm: React.FC<ApprovalAddFormProps> = ({
    employees,
    rewardNote,
    setRewardNote,
    setIsAddDialogOpen,
    onAddSuccess,
}) => {
    const [rewardRules, setRewardRules] = useState<RewardRules[]>([]);
    const [rewardValue, setRewardValue] = useState<number>(0);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSearchResult | null>(null);
    const { searchResults, isSearching, searchError, handleSearch, clearSearch } = useEmployeeSearch(300);

    useEffect(() => {
        const fetchRewardRules = async () => {
            const result = await getRewardRules();
            setRewardRules(result.data);
        };

        fetchRewardRules();
    }, []);

    // Use only search results from API
    const uniqueEmployees = searchResults.filter(
        (employee, index, self) => index === self.findIndex((t) => t.search === employee.search),
    );

    const cbItems: ComboboxItem[] = uniqueEmployees.map((employee) => ({
        cblabel: employee.search,
        cbvalue: employee.search,
    }));

    const [formData, setFormData] = useState<ApprovalFormData>({
        employeeId: 0,
        rewardType: '',
        rewardAmount: 0,
        rewardNote: rewardNote || '',
    });

    // Update reward amount when reward type changes
    useEffect(() => {
        if (formData.rewardType && rewardRules.length > 0) {
            const selectedRule = rewardRules.find((rule) => rule.rewardruleid.toString() === formData.rewardType);
            if (selectedRule && selectedRule.rewardvalue !== undefined) {
                // Get the base reward value from the rule
                const baseRewardValue = selectedRule.rewardvalue || 0;

                // If an employee is selected, multiply by their salary
                if (selectedEmployee && selectedEmployee.salary) {
                    const employeeSalary = parseFloat(selectedEmployee.salary.toString()) || 0;
                    const calculatedAmount = baseRewardValue * employeeSalary;
                    setFormData((prev) => ({ ...prev, rewardAmount: calculatedAmount }));
                } else {
                    // If no employee selected, just show the base reward value
                    setFormData((prev) => ({ ...prev, rewardAmount: baseRewardValue }));
                }
                setRewardValue(baseRewardValue);
            }
        } else {
            setFormData((prev) => ({ ...prev, rewardAmount: 0 }));
            setRewardValue(0);
        }
    }, [formData.rewardType, rewardRules, selectedEmployee]);

    // Recalculate reward amount when employee selection changes
    useEffect(() => {
        if (formData.rewardType && rewardRules.length > 0 && selectedEmployee) {
            const selectedRule = rewardRules.find((rule) => rule.rewardruleid.toString() === formData.rewardType);
            if (selectedRule && selectedRule.rewardvalue !== undefined && selectedEmployee.salary) {
                const baseRewardValue = selectedRule.rewardvalue || 0;
                const employeeSalary = parseFloat(selectedEmployee.salary.toString()) || 0;
                const calculatedAmount = baseRewardValue * employeeSalary;
                setFormData((prev) => ({ ...prev, rewardAmount: calculatedAmount }));
            }
        }
    }, [selectedEmployee, formData.rewardType, rewardRules]);

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

        const apiData = {
            finalrewardamount: formData.rewardAmount,
            rewardnote: formData.rewardNote,
            rewardrecordstatus: 'approved',
            rewardapplieddate: new Date().toISOString(),
            rewardruleid: parseInt(formData.rewardType),
            employeeid: formData.employeeId,
        };

        const result = await postRewardRecord(apiData);
        if (result.ok) {
            toast.success('Đã thêm đề xuất thưởng thành công!');
            setFormData({
                employeeId: 0,
                rewardType: '',
                rewardAmount: 0,
                rewardNote: rewardNote || '',
            });
            setSelectedEmployee(null);
            setRewardValue(0);
            clearSearch();
            
            // Refetch data after successful creation
            if (onAddSuccess) {
                onAddSuccess();
            }
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
                        {selectedEmployee ? selectedEmployee.search : 'Chọn mã - tên nhân viên ...'}
                    </div>
                </div>
                <Command className="rounded-lg border-2">
                    <CommandInput placeholder={`Tìm kiếm mã - tên nhân viên ...`} onValueChange={handleSearch} />
                    <CommandList>
                        <CommandEmpty>
                            {isSearching ? (
                                <div className="flex items-center justify-center gap-2 py-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Đang tìm kiếm...</span>
                                </div>
                            ) : searchError ? (
                                <span className="text-red-500">{searchError}</span>
                            ) : searchResults.length === 0 && cbItems.length === 0 ? (
                                'Nhập tên hoặc mã nhân viên để tìm kiếm...'
                            ) : (
                                'Không tìm thấy mã - tên nhân viên'
                            )}
                        </CommandEmpty>
                        <CommandGroup className="max-h-40 overflow-y-auto">
                            {cbItems.map((item, index) => {
                                const employeeId = Number(item.cbvalue.toString().split('-')[0]);
                                const isSelected = formData.employeeId === employeeId;

                                return (
                                    <CommandItem
                                        key={`${item.cbvalue}-${index}`}
                                        value={item.cbvalue.toString()}
                                        onSelect={(newValue) => {
                                            const idString = newValue.split('-')[0];
                                            const selectedEmployeeId = Number(idString);
                                            const employee = uniqueEmployees.find((emp) => emp.search === newValue);

                                            setFormData((prev) => ({ ...prev, employeeId: selectedEmployeeId }));
                                            setSelectedEmployee(employee || null);
                                            clearSearch();
                                        }}
                                    >
                                        {item.cblabel}
                                        <Check className={cn('ml-auto', isSelected ? 'opacity-100' : 'opacity-0')} />
                                    </CommandItem>
                                );
                            })}
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
                                        {rule.rewardname} - x{rule.rewardvalue}
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
                <Button type="submit" variant="outline">
                    Lưu
                </Button>
            </div>
        </form>
    );
};

export default ApprovalAddForm;
