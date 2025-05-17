import { useState } from 'react';
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

enum CompareOperator {
    LessThan = "<",
    GreaterThan = ">",
    EqualTo = "==",
    NotEqualTo = "!=",
    LessThanOrEqualTo = "<=",
    GreaterThanOrEqualTo = ">=",
}

enum ActionType {
    SetEligible = "eligible",
    SetDeletable = "deletable",
}

interface CustomRuleDetailCondition {
    ruleconditionid: number;
    ruleconditionname: string;
    ruleconditioncompareoperator: CompareOperator;
    ruleconditioncomparevalue: number;
}

interface CustomRuleDetailAction {
    ruleactionid: number;
    ruleactionname: string;
    ruleactiontype: ActionType;
    ruleactionvalue: string;
}

const AssignmentRuleDetail = () => {
    const tabs = ["Thông tin cơ bản", "Điều kiện", "Hành động"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);
    const [ruleConditions, setRuleConditions] = useState<CustomRuleDetailCondition[]>([
        {
            ruleconditionid: 1,
            ruleconditionname: "Số ca làm việc trong tuần",
            ruleconditioncompareoperator: CompareOperator.LessThan,
            ruleconditioncomparevalue: 12,
        },
        {
            ruleconditionid: 2,
            ruleconditionname: "Số ca làm việc trong ngày",
            ruleconditioncompareoperator: CompareOperator.LessThan,
            ruleconditioncomparevalue: 2,
        },
    ]);

    const [ruleActions, setRuleActions] = useState<CustomRuleDetailAction[]>([
        {
            ruleactionid: 1,
            ruleactionname: "Có thể phân công",
            ruleactiontype: ActionType.SetEligible,
            ruleactionvalue: "true",
        },
        {
            ruleactionid: 2,
            ruleactionname: "Xóa khỏi danh sách được xem xét phân công",
            ruleactiontype: ActionType.SetDeletable,
            ruleactionvalue: "false",
        },
    ]);

    const [nonScRuleConditions, setNonScRuleConditions] = useState<CustomRuleDetailCondition[]>([
        {
            ruleconditionid: 3,
            ruleconditionname: "Điểm ưu tiên của nhân viên trong tháng",
            ruleconditioncompareoperator: CompareOperator.GreaterThanOrEqualTo,
            ruleconditioncomparevalue: 20,
        },
        {
            ruleconditionid: 4,
            ruleconditionname: "Điểm ABC XYZ",
            ruleconditioncompareoperator: CompareOperator.NotEqualTo,
            ruleconditioncomparevalue: 0,
        },
    ]);

    return (
        <div className="flex flex-col w-full h-[60vh]">
            <div className="flex items-center">
                {tabs.map((tab, index) => (
                    <div
                        key={`tab-${index}`}
                        className={`w-40 flex justify-center items-center p-4 rounded-t-lg cursor-pointer z-2 ${selectedTab === tab ? "border-primary border-t-2 border-l-2 border-r-2 bg-white" : ""}`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            <div
                className="flex flex-col p-4 border-primary border-l-2 border-r-2 border-b-2 rounded-b-lg border-t-2 z-1 -mt-0.5 bg-white h-full"
            >
                {selectedTab === "Thông tin cơ bản" && (
                    <div className="flex flex-col gap-4 w-full h-full">
                        <span className="text-lg">Thông tin cơ bản quy tắc</span>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs">Tên quy tắc</span>
                            <Input
                                name="input_rulename"
                                type="text"
                                placeholder="VD: Quy tắc A"
                                defaultValue={""}
                                className="w-full border-gray-500 focus-visible:border-primary focus-visible:ring-primary/50"
                            />
                        </div>
                        <div className="flex gap-4 w-full">
                            <div className="flex flex-col gap-1 w-2/3">
                                <span className="text-xs">Đối tượng áp dụng</span>
                                <Select>
                                    <SelectTrigger className="border-gray-500 focus-visible:border-primary focus-visible:ring-primary/50">
                                        <SelectValue placeholder="Chọn đối tượng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employee">Nhân viên</SelectItem>
                                        <SelectItem value="shift">Ca làm việc</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <span className="text-xs">Độ ưu tiên (Tối đa 100, ưu tiên từ cao đến thấp)</span>
                                <Input
                                    name="input_priority"
                                    type="number"
                                    placeholder="VD: 100"
                                    defaultValue={""}
                                    min={1}
                                    max={100}
                                    className="w-full border-gray-500 focus-visible:border-primary focus-visible:ring-primary/50"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full h-full">
                            <span className="text-xs">Mô tả quy tắc</span>
                            <Textarea
                                name="input_description"
                                placeholder="Quy tắc được dùng để phân công nhân viên theo ..."
                                defaultValue={""}
                                className="w-full h-full border-gray-500 focus-visible:border-primary focus-visible:ring-primary/50"
                            />
                        </div>
                    </div>
                )}
                {selectedTab === "Điều kiện" && (
                    <div className="flex flex-col gap-4 w-full h-full">
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-lg">Điều kiện của quy tắc</span>
                                <span className="text-xs font-light">Định nghĩa các điều kiện cần đạt để quy tắc được kích hoạt</span>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        <Icon icon="ic:baseline-plus" className="" />
                                        Thêm điều kiện
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-50">
                                    <div className="flex flex-col">
                                        {nonScRuleConditions.map((rule, index) => (
                                            <div
                                                key={`rulecondition-${rule.ruleconditionid}`}
                                                className="flex w-full items-center justify-center p-2 border-b-2 hover:bg-primary-50 cursor-pointer"
                                            >
                                                {rule.ruleconditionname}
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col max-w-full overflow-x-auto">
                            <div className="flex w-full">
                                <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">
                                    Thuộc tính cần so sánh
                                </div>
                                <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">
                                    Toán tử so sánh
                                </div>
                                <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">
                                    Giá trị so sánh
                                </div>
                                <div className="border-b-1 border-b-gray-500 w-8 flex-shrink-0">
                                    {/*Cột chứa nút xóa */}
                                </div>
                            </div>
                            {ruleConditions.length > 0 ? ruleConditions.map((rule, index) => (
                                <div
                                    key={`rulecondition-${rule.ruleconditionid}`}
                                    className="flex w-full items-center h-full border-b max-h-[40vh] overflow-y-auto"
                                >
                                    <div className="w-full p-2 text-sm">
                                        {rule.ruleconditionname}
                                    </div>
                                    <div className="w-full p-2">
                                        <Select defaultValue={rule.ruleconditioncompareoperator}>
                                            <SelectTrigger className="border-gray-500 focus-visible:border-primary focus-visible:ring-primary/50">
                                                <SelectValue placeholder={"Toán tử so sánh"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={CompareOperator.LessThan}>{"Bé hơn (<)"}</SelectItem>
                                                <SelectItem value={CompareOperator.GreaterThan}>{"Lớn hơn (>)"}</SelectItem>
                                                <SelectItem value={CompareOperator.EqualTo}>{"Bằng (==)"}</SelectItem>
                                                <SelectItem value={CompareOperator.NotEqualTo}>{"Không bằng (!=)"}</SelectItem>
                                                <SelectItem value={CompareOperator.LessThanOrEqualTo}>{"Bé hơn bằng (<=)"}</SelectItem>
                                                <SelectItem value={CompareOperator.GreaterThanOrEqualTo}>{"Lớn hơn bằng (>=)"}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-full p-2">
                                        <Input
                                            name="ruleconditioncomparevalue"
                                            type="number"
                                            placeholder="VD: 12"
                                            defaultValue={rule.ruleconditioncomparevalue}
                                            className="w-full border-gray-500 focus-visible:border-primary focus-visible:ring-primary/50"
                                        />
                                    </div>
                                    <div className="w-8 flex-shrink-0 flex items-center justify-center">
                                        <Icon
                                            icon="material-symbols:delete-outline-rounded"
                                            className="cursor-pointer size-6 transition-all duration-300 hover:text-red-500 hover:size-7"
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="flex w-full items-center">
                                    <div className="w-full p-2">
                                        Chưa có điều kiện nào
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {selectedTab === "Hành động" && (
                    <div className="flex flex-col gap-4 w-full h-full">
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-lg">Hành động khi thỏa điều kiện của quy tắc</span>
                                <span className="text-xs font-light">Định nghĩa các hành động thực hiện khi các điều kiện của quy tắc được thỏa mãn</span>
                            </div>
                            <Button variant="outline">
                                <Icon icon="ic:baseline-plus" className="" />
                                Thêm điều kiện
                            </Button>
                        </div>
                        <div className="flex flex-col max-w-full overflow-x-auto">
                            <div className="flex w-full">
                                <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">
                                    Tên hành động
                                </div>
                                <div className="w-full p-2 font-semibold text-sm border-b-1 border-b-gray-500">
                                    Giá trị hành động
                                </div>
                                <div className="border-b-1 border-b-gray-500 w-8 flex-shrink-0">
                                    {/*Cột chứa nút xóa */}
                                </div>
                            </div>
                            <div className="flex flex-col h-full max-h-[40vh] overflow-y-auto">
                                {ruleActions.length > 0 ? ruleActions.map((rule, index) => (
                                    <div
                                        key={`rulecondition-${rule.ruleactionid}`}
                                        className="flex w-full items-center h-full border-b "
                                    >
                                        <div className="w-full p-2 text-sm">
                                            {rule.ruleactionname}
                                        </div>
                                        <div className="w-full p-2">
                                            <Select defaultValue={rule.ruleactionvalue}>
                                                <SelectTrigger className="border-gray-500 focus-visible:border-primary focus-visible:ring-primary/50">
                                                    <SelectValue placeholder={"Chọn hành động"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={"true"}>{"Có thể phân công hoặc xóa"}</SelectItem>
                                                    <SelectItem value={"false"}>{"Không thể phân công hoặc xóa"}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-8 flex-shrink-0 flex items-center justify-center">
                                            <Icon
                                                icon="material-symbols:delete-outline-rounded"
                                                className="cursor-pointer size-6 transition-all duration-300 hover:text-red-500 hover:size-7"
                                            />
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex w-full items-center">
                                        <div className="w-full p-2">
                                            Chưa có hành động nào
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


export default AssignmentRuleDetail;