export function formatActionName(actionName: string) {
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

export function formatConditionName(conditionName: string) {
    switch (conditionName) {
        case 'assignedEmployees':
            return 'Số nhân viên được phân công';
        case 'assignedShifts':
        case 'assignedShiftInDay':
            return 'Số ca làm đã được phân công trong ngày';
        case 'assignedShiftInWeek':
            return 'Số ca làm đã được phân công trong tuần';
        case 'isAssigned':
            return 'Đã được phân công';
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

export function formatConditionValue(conditionValue: string) {
    switch (conditionValue) {
        case 'ShiftEnrollment(getShift().equals($SD))':
            return 'true';
        case 'not(ShiftEnrollment(getShift().equals($SD)))':
            return 'false';
        case 'ShiftEnrollment(getEmployee().equals($E), getShift().equals($CSD))':
            return 'true';
        case 'not(ShiftEnrollment(getEmployee().equals($E), getShift().equals($CSD)))':
            return 'false';
        case 'ShiftAssignment(getEmployee().equals($E), getShift().equals($CSD))':
            return 'true';
        case 'not(ShiftAssignment(getEmployee().equals($E), getShift().equals($CSD)))':
            return 'false';
        default:
            return conditionValue;
    }
}
