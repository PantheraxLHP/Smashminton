import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AssignmentRule, RuleCondition, RuleAction } from './AssignmentRuleList';

enum CompareOperator {
    LessThan = '<',
    GreaterThan = '>',
    EqualTo = '==',
    NotEqualTo = '!=',
    LessThanOrEqualTo = '<=',
    GreaterThanOrEqualTo = '>=',
}

function formatActionName(actionName: string) {
    switch (actionName) {
        case 'setEligible':
            return 'Có thể phân công';
        case 'setAssignable':
            return 'Có thể phân công';
        case 'setDeletable':
            return 'Có thể xoá ';
        default:
            return actionName;
    }
}

function formatConditionName(conditionName: string) {
    switch (conditionName) {
        case 'assignedEmployees':
            return 'Số nhân viên được phân công';
        case 'assignedShifts':
            return 'Số ca làm đã được phân công';
        case 'isAssignable':
            return 'Có thể phân công';
        case 'isEligible':
            return 'Có thể phân công';
        case 'isEnrolled':
            return 'Có nhân viên đăng ký ca làm';
        default:
            return conditionName;
    }
}

const AssignmentRuleDetail = ({ AssignmentRule }: { AssignmentRule?: AssignmentRule }) => {
    const tabs = ['Thông tin cơ bản', 'Điều kiện', 'Hành động'];
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    // Helper function to format condition values
    const formatConditionValue = (condition: RuleCondition): RuleCondition => {
        if (condition.conditionName.startsWith('is')) {
            // Boolean conditions - keep as is
            return condition;
        } else {
            // Numeric conditions - ensure format "operator value"
            if (!condition.conditionValue.includes(' ')) {
                // If no operator, add default
                return {
                    ...condition,
                    conditionValue: `${CompareOperator.EqualTo} ${condition.conditionValue || '0'}`,
                };
            }
            return condition;
        }
    };

    // Form data states - these will persist across tab changes
    const [ruleName, setRuleName] = useState(AssignmentRule?.ruleName || '');
    const [ruleDescription, setRuleDescription] = useState(AssignmentRule?.ruleDescription || '');
    const [ruleTarget, setRuleTarget] = useState('employee'); // Default target
    const [ruleConditions, setRuleConditions] = useState<RuleCondition[]>(
        AssignmentRule?.conditions?.map(formatConditionValue) || [],
    );
    const [ruleActions, setRuleActions] = useState<RuleAction[]>(AssignmentRule?.actions || []);

    const [backupAssignmentRule] = useState(
        AssignmentRule
            ? AssignmentRule
            : {
                  ruleName: '',
                  ruleDescription: '',
                  conditions: [],
                  actions: [],
              },
    );

    // Function to reset all form data (call this when popup closes)
    const resetFormData = () => {
        setRuleName(backupAssignmentRule.ruleName);
        setRuleDescription(backupAssignmentRule.ruleDescription);
        setRuleTarget('employee');
        setRuleConditions(backupAssignmentRule.conditions || []);
        setRuleActions(backupAssignmentRule.actions || []);
        setSelectedTab(tabs[0]);
    };

    // Helper functions for managing conditions and actions
    const updateConditionValue = (conditionName: string, newValue: string) => {
        setRuleConditions((prev) =>
            prev.map((condition) =>
                condition.conditionName === conditionName ? { ...condition, conditionValue: newValue } : condition,
            ),
        );
    };

    const removeCondition = (conditionName: string) => {
        setRuleConditions((prev) => prev.filter((condition) => condition.conditionName !== conditionName));
    };

    const updateActionValue = (actionName: string, newValue: string) => {
        setRuleActions((prev) =>
            prev.map((action) => (action.actionName === actionName ? { ...action, actionValue: newValue } : action)),
        );
    };

    return (
        <div className="flex h-[60vh] w-full flex-col">
            <div className="flex items-center">
                {tabs.map((tab, index) => (
                    <div
                        key={`tab-${index}`}
                        className={`z-2 flex w-40 cursor-pointer items-center justify-center rounded-t-lg p-4 ${selectedTab === tab ? 'border-primary border-t-2 border-r-2 border-l-2 bg-white' : ''}`}
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            <div className="border-primary z-1 -mt-0.5 flex h-full flex-col rounded-b-lg border-t-2 border-r-2 border-b-2 border-l-2 bg-white p-4">
                {selectedTab === 'Thông tin cơ bản' && (
                    <div className="flex h-full w-full flex-col gap-4">
                        <span className="text-lg">Thông tin cơ bản quy tắc</span>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs">Tên quy tắc</span>
                            <Input
                                name="input_rulename"
                                type="text"
                                placeholder="VD: Quy tắc A"
                                value={ruleName}
                                onChange={(e) => setRuleName(e.target.value)}
                                className="focus-visible:border-primary focus-visible:ring-primary/50 w-full border-gray-500"
                            />
                        </div>
                        <div className="flex w-full gap-4">
                            <div className="flex w-2/3 flex-col gap-1">
                                <span className="text-xs">Đối tượng áp dụng</span>
                                <Select value={ruleTarget} onValueChange={setRuleTarget}>
                                    <SelectTrigger className="focus-visible:border-primary focus-visible:ring-primary/50 border-gray-500">
                                        <SelectValue placeholder="Chọn đối tượng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employee">Nhân viên</SelectItem>
                                        <SelectItem value="enrollmentEmployee">
                                            Nhân viên (Có đăng ký ca làm)
                                        </SelectItem>
                                        <SelectItem value="shift">Ca làm việc</SelectItem>
                                        <SelectItem value="enrollmentShift">
                                            Ca làm việc (Đã có người đăng ký)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex h-full w-full flex-col gap-1">
                            <span className="text-xs">Mô tả quy tắc</span>
                            <Textarea
                                name="input_description"
                                placeholder="Quy tắc được dùng để phân công nhân viên theo ..."
                                value={ruleDescription}
                                onChange={(e) => setRuleDescription(e.target.value)}
                                className="focus-visible:border-primary focus-visible:ring-primary/50 h-full w-full border-gray-500"
                            />
                        </div>
                    </div>
                )}
                {selectedTab === 'Điều kiện' && (
                    <div className="flex h-full w-full flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-lg">Điều kiện của quy tắc</span>
                                <span className="text-xs font-light">
                                    Định nghĩa các điều kiện cần đạt để quy tắc được kích hoạt
                                </span>
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
                                        {ruleConditions.map((condition) => (
                                            <div
                                                key={`rulecondition-${condition.conditionName}`}
                                                className="hover:bg-primary-50 flex w-full cursor-pointer items-center justify-center border-b-2 p-2"
                                            >
                                                {condition.conditionName}
                                            </div>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex max-w-full flex-col overflow-x-auto">
                            <div className="flex w-full">
                                <div className="w-full border-b-1 border-b-gray-500 p-2 text-sm font-semibold">
                                    Thuộc tính cần so sánh
                                </div>

                                <div className="w-full border-b-1 border-b-gray-500 p-2 text-sm font-semibold">
                                    Giá trị
                                </div>
                                <div className="w-8 flex-shrink-0 border-b-1 border-b-gray-500">
                                    {/*Cột chứa nút xóa */}
                                </div>
                            </div>
                            {ruleConditions.length > 0 ? (
                                ruleConditions.map((condition) => (
                                    <div
                                        key={`rulecondition-${condition.conditionName}`}
                                        className="flex h-full max-h-[40vh] w-full items-center border-b"
                                    >
                                        <div className="w-full text-sm">
                                            {formatConditionName(condition.conditionName)}
                                        </div>
                                        <div className="w-full p-2">
                                            {condition.conditionName.startsWith('is') ? (
                                                <Select
                                                    value={condition.conditionValue}
                                                    onValueChange={(value) =>
                                                        updateConditionValue(condition.conditionName, value)
                                                    }
                                                >
                                                    <SelectTrigger className="focus-visible:border-primary focus-visible:ring-primary/50 border-gray-500">
                                                        <SelectValue placeholder={'Giá trị'} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={'true'}>{'Có'}</SelectItem>
                                                        <SelectItem value={'false'}>{'Không'}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="flex w-full flex-row gap-2">
                                                    <Select
                                                        value={
                                                            condition.conditionValue.split(' ')[0] ||
                                                            CompareOperator.EqualTo
                                                        }
                                                        onValueChange={(operator) => {
                                                            const currentNumber =
                                                                condition.conditionValue.split(' ')[1] || '';
                                                            updateConditionValue(
                                                                condition.conditionName,
                                                                `${operator} ${currentNumber}`,
                                                            );
                                                        }}
                                                    >
                                                        <SelectTrigger className="focus-visible:border-primary focus-visible:ring-primary/50 border-gray-500">
                                                            <SelectValue placeholder="Toán tử so sánh" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={CompareOperator.LessThan}>
                                                                {'<'}
                                                            </SelectItem>
                                                            <SelectItem value={CompareOperator.GreaterThan}>
                                                                {'>'}
                                                            </SelectItem>
                                                            <SelectItem value={CompareOperator.EqualTo}>
                                                                {'=='}
                                                            </SelectItem>
                                                            <SelectItem value={CompareOperator.NotEqualTo}>
                                                                {'!='}
                                                            </SelectItem>
                                                            <SelectItem value={CompareOperator.LessThanOrEqualTo}>
                                                                {'<='}
                                                            </SelectItem>
                                                            <SelectItem value={CompareOperator.GreaterThanOrEqualTo}>
                                                                {'>='}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        name="ruleconditioncomparevalue"
                                                        type="number"
                                                        placeholder="VD: 12"
                                                        value={condition.conditionValue.split(' ')[1] || ''}
                                                        onChange={(e) => {
                                                            const currentOperator =
                                                                condition.conditionValue.split(' ')[0] ||
                                                                CompareOperator.EqualTo;
                                                            updateConditionValue(
                                                                condition.conditionName,
                                                                `${currentOperator} ${e.target.value}`,
                                                            );
                                                        }}
                                                        className="focus-visible:border-primary focus-visible:ring-primary/50 w-full border-gray-500"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex w-8 flex-shrink-0 items-center justify-center">
                                            <Icon
                                                icon="material-symbols:delete-outline-rounded"
                                                className="size-6 cursor-pointer transition-all duration-300 hover:size-7 hover:text-red-500"
                                                onClick={() => removeCondition(condition.conditionName)}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex w-full items-center">
                                    <div className="w-full p-2">Chưa có điều kiện nào</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {selectedTab === 'Hành động' && (
                    <div className="flex h-full w-full flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-lg">Hành động khi thỏa điều kiện của quy tắc</span>
                                <span className="text-xs font-light">
                                    Định nghĩa các hành động thực hiện khi các điều kiện của quy tắc được thỏa mãn
                                </span>
                            </div>
                        </div>
                        <div className="flex max-w-full flex-col overflow-x-auto">
                            <div className="flex w-full">
                                <div className="w-full border-b-1 border-b-gray-500 p-2 text-sm font-semibold">
                                    Tên hành động
                                </div>
                                <div className="w-full border-b-1 border-b-gray-500 p-2 text-sm font-semibold">
                                    Giá trị hành động
                                </div>
                            </div>
                            <div className="flex h-full max-h-[40vh] flex-col overflow-y-auto">
                                {ruleActions.length > 0 ? (
                                    <div className="flex h-full w-full items-center border-b">
                                        <div className="w-full p-2 text-sm">
                                            {formatActionName(ruleActions[0].actionName)}
                                        </div>
                                        <div className="w-full p-2">
                                            <Select
                                                value={ruleActions[0].actionValue}
                                                onValueChange={(value) =>
                                                    updateActionValue(ruleActions[0].actionName, value)
                                                }
                                            >
                                                <SelectTrigger className="focus-visible:border-primary focus-visible:ring-primary/50 border-gray-500">
                                                    <SelectValue placeholder={ruleActions[0].actionName} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={'true'}>{'Có'}</SelectItem>
                                                    <SelectItem value={'false'}>{'Không'}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex w-full items-center">
                                        <div className="w-full p-2">Chưa có hành động nào</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-4 flex w-full justify-end gap-2">
                <Button variant="secondary" onClick={resetFormData}>
                    <Icon icon="material-symbols:arrow-back-rounded" />
                    Quay về
                </Button>
                <Button>Lưu</Button>
            </div>
        </div>
    );
};

export default AssignmentRuleDetail;
