
import { useState } from "react";
import { AutoassignmentRules } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import NewAssignmentRuleForm from "./NewAssignmentRuleForm";

const RuleOptions = () => {
    const [rules, setRules] = useState<AutoassignmentRules[]>([
        { aaruleid: 1, rulename: "Quy tắc 1", rulestatus: "Active", ruledescription: "Mô tả quy tắc 1", rulevalue: "1" },
        { aaruleid: 2, rulename: "Quy tắc 2", rulestatus: "Inactive", ruledescription: "Mô tả quy tắc 2", rulevalue: "2" },
        { aaruleid: 3, rulename: "Quy tắc 3", rulestatus: "Active", ruledescription: "Mô tả quy tắc 3", rulevalue: "3" },
        { aaruleid: 4, rulename: "Quy tắc 4", rulestatus: "Inactive", ruledescription: "Mô tả quy tắc 4", rulevalue: "4" },
        { aaruleid: 5, rulename: "Quy tắc 5", rulestatus: "Active", ruledescription: "Mô tả quy tắc 5", rulevalue: "5" },
        { aaruleid: 6, rulename: "Quy tắc 6", rulestatus: "Inactive", ruledescription: "Mô tả quy tắc 6", rulevalue: "ASC" },
        { aaruleid: 7, rulename: "Quy tắc 7", rulestatus: "Active", ruledescription: "Mô tả quy tắc 7", rulevalue: "DESC" },
        { aaruleid: 8, rulename: "Quy tắc 8", rulestatus: "Inactive", ruledescription: "Mô tả quy tắc 8", rulevalue: "ASC" },
        { aaruleid: 9, rulename: "Quy tắc 9", rulestatus: "Active", ruledescription: "Mô tả quy tắc 9", rulevalue: "DESC" },
        { aaruleid: 10, rulename: "Quy tắc 10", rulestatus: "Inactive", ruledescription: "Mô tả quy tắc 10", rulevalue: "ASC" },
    ]);

    const handleCheckedChange = (checked: boolean, aaruleid: number) => {
        setRules((prevRules) =>
            prevRules.map((rule) =>
                rule.aaruleid === aaruleid ? { ...rule, rulestatus: checked ? "Active" : "Inactive" } : rule
            )
        );
    }

    const handleValueChange = (value: string, aaruleid: number) => {
        setRules((prevRules) =>
            prevRules.map((rule) =>
                rule.aaruleid === aaruleid ? { ...rule, rulevalue: value } : rule
            )
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between items-center">
                <Button variant="outline">
                    Bật/Tắt tất cả quy tắc
                </Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" >
                            Thêm quy tắc
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="!max-w-[80vw] overflow-y-auto max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle>Thêm quy tắc phân công tự động</DialogTitle>
                            <DialogDescription>
                                Bạn có thể thêm quy tắc phân công ca làm việc tự động cho nhân viên bán thời gian tại đây
                            </DialogDescription>
                        </DialogHeader>
                        <NewAssignmentRuleForm />
                        <DialogFooter>
                            <DialogTrigger asChild>
                                <Button variant="secondary">Thoát</Button>
                            </DialogTrigger>
                            <Button type="submit" form="new-assignment-rule-form" variant="outline">Thêm quy tắc</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto w-full">
                {rules.map((rule, index) => (
                    <div
                        key={index}
                        className="flex gap-10 items-center p-2 border rounded-lg hover:bg-primary-50">
                        <Switch
                            id={`${rule.aaruleid}`}
                            checked={rule.rulestatus === "Active" ? true : false}
                            onCheckedChange={(checked) => handleCheckedChange(checked, rule.aaruleid)} className={`cursor-pointer`}
                        />
                        <Icon icon="uil:setting" className="size-10 text-primary-200 cursor-pointer transition-all duration-300 hover:rotate-180 hover:text-primary-500" />
                        <span className="text-lg w-full">{rule.rulename}</span>
                        <div className={`flex gap-5 items-center`}>
                            <button
                                className={`group p-1 bg-red-100 rounded-sm items-center flex justify-center cursor-pointer hover:bg-red-500 ${isNaN(Number.parseFloat(rule.rulevalue ?? "")) ? "invisible" : ""}`}
                            >
                                <Icon icon="ic:baseline-minus" className="text-lg text-red-500 group-hover:text-white" />
                            </button>
                            <Input
                                name="rulevalue"
                                type="text"
                                className="w-15 text-center"
                                value={rule.rulevalue}
                                onChange={(e) => handleValueChange(e.target.value, rule.aaruleid)}
                            />
                            <button
                                className={`group p-1 bg-primary-100 rounded-sm items-center flex justify-center cursor-pointer hover:bg-primary ${isNaN(Number.parseFloat(rule.rulevalue ?? "")) ? "invisible" : ""}`}
                            >
                                <Icon icon="ic:baseline-plus" className="text-lg text-primary group-hover:text-white" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RuleOptions;