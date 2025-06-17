import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@iconify/react';
import AssignmentRuleList from './AssignmentRuleList';
import WeekPicker, { WeekPickerProps } from './WeekPicker';
import { autoAssignShift } from '@/services/shiftdate.service';
import { toast } from 'sonner';

interface ShiftFilterProps extends WeekPickerProps {
    selectedRadio: string;
    onRadioChange: (value: string) => void;
    role?: string;
    type: 'enrollments' | 'assignments';
    fullTimeOption?: string;
    setFullTimeOption?: (value: string) => void;
    partTimeOption?: string;
    setPartTimeOption?: (value: string) => void;
}

const ShiftFilter: React.FC<ShiftFilterProps> = ({
    selectedWeek,
    setSelectedWeek,
    weekNumber,
    setWeekNumber,
    year,
    setYear,
    selectedRadio,
    onRadioChange,
    role,
    type,
    fullTimeOption,
    setFullTimeOption,
    partTimeOption,
    setPartTimeOption,
}) => {
    const handleAutoAssign = async () => {
        console.log(fullTimeOption, partTimeOption);
        const response = await autoAssignShift(fullTimeOption || '', partTimeOption || '');
        if (response.ok) {
            toast.success('Phân công tự động thành công');
        } else {
            toast.error(response.message || 'Phân công tự động thất bại');
        }
    };

    return (
        <div className="flex w-fit flex-col gap-4 rounded-lg border p-4">
            <WeekPicker
                selectedWeek={selectedWeek}
                setSelectedWeek={setSelectedWeek}
                weekNumber={weekNumber}
                setWeekNumber={setWeekNumber}
                year={year}
                setYear={setYear}
            />

            {/*Phần radio button để chọn loại nhân viên hoặc chế độ hiển thị*/}
            {role === 'hr_manager' && (
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold">Loại nhân viên</span>
                    <RadioGroup value={selectedRadio} onValueChange={onRadioChange}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem className="cursor-pointer" value="fulltime" id="fulltime" />
                            <Label className="cursor-pointer" htmlFor="fulltime">
                                Toàn thời gian
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem className="cursor-pointer" value="parttime" id="parttime" />
                            <Label className="cursor-pointer" htmlFor="parttime">
                                Bán thời gian
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            )}
            {role === 'employee' && type === 'enrollments' && (
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold">Chế độ hiển thị</span>
                    <RadioGroup value={selectedRadio} onValueChange={onRadioChange}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem className="cursor-pointer" value="unenrolled" id="unenrolled" />
                            <Label className="cursor-pointer" htmlFor="unenrolled">
                                Chưa đăng ký
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem className="cursor-pointer" value="enrolled" id="enrolled" />
                            <Label className="cursor-pointer" htmlFor="enrolled">
                                Đã đăng ký
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            )}

            <div className="border border-gray-500"></div>

            {/* Phần chú thích thời gian của ca làm việc */}
            {((role === 'hr_manager' && selectedRadio === 'parttime') || role === 'employee') && (
                <div className="justify-left flex flex-col">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="h-3.5 w-3.5 rounded-xs bg-yellow-500"></div>
                        Ca sáng: 06:00 - 10:00
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="bg-primary h-3.5 w-3.5 rounded-xs"></div>
                        Ca trưa: 10:00 - 14:00
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="h-3.5 w-3.5 rounded-xs bg-[#008CFF]"></div>
                        Ca chiều: 14:00 - 18:00
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="h-3.5 w-3.5 rounded-xs bg-[#746C82]"></div>
                        Ca tối: 18:00 - 22:00
                    </div>
                </div>
            )}
            {((role === 'hr_manager' && selectedRadio === 'fulltime') || role === 'wh_manager') && (
                <div className="justify-left flex flex-col">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="h-3.5 w-3.5 rounded-xs bg-yellow-500"></div>
                        Ca sáng: 06:00 - 14:00
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="h-3.5 w-3.5 rounded-xs bg-[#008CFF]"></div>
                        Ca chiều: 14:00 - 22:00
                    </div>
                </div>
            )}

            {/*2 Nút phân công và tùy chỉnh phân công*/}
            {role === 'hr_manager' && (
                <>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="text-md">
                                Phân công tự động
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[80vh]">
                            <DialogHeader>
                                <DialogTitle>Phân công tự động</DialogTitle>
                                <DialogDescription>
                                    Thực hiện phân công tự động cho nhân viên trong tuần tiếp theo
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex w-full items-center justify-between gap-5">
                                <div className="flex w-full flex-col gap-1">
                                    <span className="text-sm font-semibold">
                                        Chế độ phân công cho nhân viên toàn thời gian
                                    </span>
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
                            <DialogFooter>
                                <DialogTrigger asChild>
                                    <Button variant="secondary">Thoát</Button>
                                </DialogTrigger>
                                <Button onClick={handleAutoAssign}>Thực hiện phân công</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="text-md">
                                <Icon icon="uil:setting" className="size-4" />
                                Tùy chỉnh
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] !max-w-[70vw] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Tùy chỉnh quy tắc phân công tự động</DialogTitle>
                                <DialogDescription>
                                    Bạn có thể tùy chỉnh quy tắc phân công ca làm việc tự động cho nhân viên bán thời
                                    gian tại đây
                                </DialogDescription>
                            </DialogHeader>
                            <AssignmentRuleList
                                fullTimeOption={fullTimeOption}
                                setFullTimeOption={setFullTimeOption}
                                partTimeOption={partTimeOption}
                                setPartTimeOption={setPartTimeOption}
                            />
                            <DialogFooter>
                                <DialogTrigger asChild>
                                    <Button variant="secondary">
                                        <Icon icon="material-symbols:arrow-back-rounded" />
                                        Quay về
                                    </Button>
                                </DialogTrigger>
                                <Button>Thực hiện phân công</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default ShiftFilter;
