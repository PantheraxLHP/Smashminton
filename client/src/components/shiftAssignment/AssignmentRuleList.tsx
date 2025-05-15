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
import AssignmentRuleDetail from "./AssignRuleDetail";

interface CustomRuleList {
    ruleid: number;
    rulename: string;
    applyto: string;
    priority: number;
    lastmodified: Date;
}

const AssignmentRuleList = () => {
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
        <div className="flex flex-col gap-4">
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
                        </DialogHeader>
                        <AssignmentRuleDetail />
                        <DialogFooter>
                            <DialogTrigger asChild>
                                <Button variant="secondary">
                                    <Icon icon="material-symbols:arrow-back-rounded" />
                                    Quay về
                                </Button>
                            </DialogTrigger>
                            <Button variant="outline">
                                Lưu
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button variant="outline">
                    <Icon icon="vscode-icons:file-type-excel2" className="" />
                    Xuất file Excel (.drl.xlsx)
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
            <div className="flex flex-col max-w-full overflow-x-auto">
                <div className="grid grid-cols-[repeat(5,minmax(165px,_1fr))]">
                    <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">Tên quy tắc</div>
                    <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">Đối tượng áp dụng</div>
                    <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">Độ ưu tiên</div>
                    <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">Chỉnh sửa lần cuối</div>
                    <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">Thao tác</div>
                </div>
                <div className="grid grid-cols-[repeat(5,minmax(165px,_1fr))] items-center max-h-[40vh] overflow-y-auto overflow-x-hidden">
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
                            <div className="border-b p-2 w-full flex flex-wrap gap-2 items-center h-full">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="group">
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
                                        </DialogHeader>
                                        <AssignmentRuleDetail />
                                        <DialogFooter>
                                            <DialogTrigger asChild>
                                                <Button variant="secondary">
                                                    <Icon icon="material-symbols:arrow-back-rounded" />
                                                    Quay về
                                                </Button>
                                            </DialogTrigger>
                                            <Button variant="outline">
                                                Lưu
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="outline_destructive" className="group">
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
        </div>
    );
}

export default AssignmentRuleList;