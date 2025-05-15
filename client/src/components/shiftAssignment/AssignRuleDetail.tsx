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

const AssignmentRuleDetail = () => {
    const tabs = ["Thông tin cơ bản", "Điều kiện", "Hành động"];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    return (
        <div className="flex flex-col w-full h-[60vh]">
            <div className="flex items-center">
                {tabs.map((tab, index) => (
                    <div
                        key={`tab-${index}`}
                        className={`w-40 flex justify-center items-center p-4 rounded-t-lg cursor-pointer z-2 ${selectedTab === tab ? "border-primary border-t-2 border-l-2 border-r-2 bg-primary-50" : ""}`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            <div className="flex flex-col p-4 border-primary border-l-2 border-r-2 border-b-2 border-t-2 z-1 -mt-0.5 bg-primary-50 h-full">
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
                                className="w-full ring-primary"
                            />
                        </div>
                        <div className="flex gap-4 w-full">
                            <div className="flex flex-col gap-1 w-2/3">
                                <span className="text-xs">Đối tượng áp dụng</span>
                                <Select>
                                    <SelectTrigger>
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
                                    placeholder="100"
                                    defaultValue={""}
                                    min={1}
                                    max={100}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full h-full">
                            <span className="text-xs">Mô tả quy tắc</span>
                            <Textarea
                                name="input_description"
                                placeholder="Quy tắc được dùng để phân công nhân viên theo ..."
                                defaultValue={""}
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                )}
                {selectedTab === "Điều kiện" && (
                    <span>Điều kiện</span>
                )}
                {selectedTab === "Hành động" && (
                    <span>Hành động</span>
                )}
            </div>
        </div>
    );
}


export default AssignmentRuleDetail;