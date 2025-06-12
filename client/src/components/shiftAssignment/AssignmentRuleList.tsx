import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState, Fragment } from "react";
import AssignmentRuleDetail from "./AssignmentRuleDetail";

interface CustomRuleList {
    ruleid: number;
    rulename: string;
    applyto: string;
    priority: number;
    lastmodified: Date;
}

interface AssignmentRuleListProps {
    fullTimeOption?: string;
    setFullTimeOption?: (value: string) => void;
    partTimeOption?: string;
    setPartTimeOption?: (value: string) => void;
}

const AssignmentRuleList: React.FC<AssignmentRuleListProps> = ({
    fullTimeOption,
    setFullTimeOption,
    partTimeOption,
    setPartTimeOption,
}) => {
    const [ruleList, setRuleList] = useState<CustomRuleList[]>([
        {
            ruleid: 1,
            rulename: "Quy tắc 1",
            applyto: "Nhân viên",
            priority: 100,
            lastmodified: new Date(),
        },
        {
            ruleid: 2,
            rulename: "Quy tắc 2",
            applyto: "Ca làm việc",
            priority: 90,
            lastmodified: new Date(),
        },
        {
            ruleid: 3,
            rulename: "Quy tắc 3",
            applyto: "Nhân viên",
            priority: 80,
            lastmodified: new Date(),
        },
        {
            ruleid: 4,
            rulename: "Quy tắc 4",
            applyto: "Ca làm việc",
            priority: 70,
            lastmodified: new Date(),
        },
        {
            ruleid: 5,
            rulename: "Quy tắc 5",
            applyto: "Nhân viên",
            priority: 60,
            lastmodified: new Date(),
        },
        {
            ruleid: 6,
            rulename: "Quy tắc 6",
            applyto: "Ca làm việc",
            priority: 50,
            lastmodified: new Date(),
        },
    ]);

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-end gap-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Icon icon="ic:baseline-plus" className="" />
                            Thêm quy tắc
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="!max-w-[600px] overflow-y-auto max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle>
                                Thêm quy tắc phân công mới
                            </DialogTitle>
                            <DialogDescription>
                            </DialogDescription>
                        </DialogHeader>
                        <AssignmentRuleDetail />
                        <DialogFooter>
                            <DialogTrigger asChild>
                                <Button variant="secondary">
                                    <Icon icon="material-symbols:arrow-back-rounded" />
                                    Quay về
                                </Button>
                            </DialogTrigger>
                            <Button>
                                Lưu
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button variant="outline">
                    <Icon icon="vscode-icons:file-type-excel2" className="" />
                    {"Xuất file Excel (.drl.xlsx)"}
                </Button>
            </div>
            <div className="w-full flex items-end gap-10">
                <div className="relative w-100">
                    <Icon
                        icon="material-symbols:search-rounded"
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-5"
                    />
                    <Input
                        name="search_rulename"
                        type="text"
                        placeholder="Tìm kiếm tên quy tắc"
                        defaultValue={""}
                        className="pl-10 w-full"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs">Đối tượng áp dụng</span>
                    <Select defaultValue="all">
                        <SelectTrigger>
                            <SelectValue placeholder="Tất cả" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="employee">Nhân viên</SelectItem>
                            <SelectItem value="shift">Ca làm việc</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex w-full gap-4">
                <div className="flex flex-col w-full max-w-full overflow-x-auto">
                    <div className="grid grid-cols-[repeat(5,minmax(100px,200px))]">
                        <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">Tên quy tắc</div>
                        <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">Đối tượng áp dụng</div>
                        <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">Độ ưu tiên</div>
                        <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">Chỉnh sửa lần cuối</div>
                        <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">Thao tác</div>
                    </div>
                    <div className="grid grid-cols-[repeat(5,minmax(150px,200px))] items-center max-h-[40vh] overflow-auto">
                        {ruleList.map((rule) => (
                            <Fragment key={`rule-${rule.ruleid}`}>
                                <div className="w-full flex items-center text-sm p-2 border-b h-full">
                                    {rule.rulename}
                                </div>
                                <div className="w-full flex items-center text-sm p-2 border-b h-full">
                                    {rule.applyto}
                                </div>
                                <div className="w-full flex items-center text-sm p-2 border-b h-full">
                                    {rule.priority}
                                </div>
                                <div className="w-full flex items-center text-sm p-2 border-b h-full">
                                    {rule.lastmodified.toLocaleTimeString("vi-VN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    })}
                                </div>
                                <div className="border-b p-2 w-full flex flex-wrap gap-2 items-center justify-center h-full">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="group w-full">
                                                <Icon
                                                    icon="uil:setting"
                                                    className="size-5 transition-all duration-300 group-hover:rotate-180 group-hover:size-6 " />
                                                <span className="group-hover:font-semibold">Chỉnh sửa</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="!max-w-[600px] overflow-y-auto max-h-[80vh]">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Chỉnh sửa quy tắc phân công
                                                </DialogTitle>
                                                <DialogDescription>
                                                </DialogDescription>
                                            </DialogHeader>
                                            <AssignmentRuleDetail />
                                            <DialogFooter>
                                                <DialogTrigger asChild>
                                                    <Button variant="secondary">
                                                        <Icon icon="material-symbols:arrow-back-rounded" />
                                                        Quay về
                                                    </Button>
                                                </DialogTrigger>
                                                <Button>
                                                    Lưu
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="outline_destructive" className="group w-full">
                                        <Icon
                                            icon="material-symbols:delete-outline-rounded"
                                            className="size-5 transition-all duration-300 group-hover:size-6" />
                                        <span className="group-hover:font-semibold">Xóa</span>
                                    </Button>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 border-2 rounded-lg p-4 w-80">
                    <div className="flex flex-col items-center gap-5 justify-between w-full">
                        <div className="flex flex-col gap-1 w-full">
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
                        <div className="flex flex-col gap-1 w-full">
                            <span className="text-sm font-semibold">Ưu tiên phân công cho nhân viên bán thời gian theo</span>
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
}

export default AssignmentRuleList;