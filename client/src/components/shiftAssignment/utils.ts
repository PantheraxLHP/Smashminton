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

export function getTrueActionValue(ruleType: string) {
    switch (ruleType) {
        case 'employee':
            return 'setEligible(true);';
        case 'enrollmentEmployee':
            return 'setEligible(true);';
        case 'shift':
            return 'setAssignable(true);';
        case 'enrollmentShift':
            return 'setAssignable(true);';
        default:
            return 'setAssignable(true);';
    }
}

export function getFalseActionValue(ruleType: string) {
    switch (ruleType) {
        case 'employee':
            return 'setEligible(false);';
        case 'enrollmentEmployee':
            return 'setEligible(false);';
        case 'shift':
            return 'setAssignable(false);';
        case 'enrollmentShift':
            return 'setAssignable(false);';
        default:
            return 'setAssignable(false);';
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
        case 'ShiftEnrollment(shift == $SD)':
            return 'true';
        case 'not(ShiftEnrollment(shift == $SD))':
            return 'false';
        case 'ShiftEnrollment(employee == $E, shift == $CSD)':
            return 'true';
        case 'not(ShiftEnrollment(employee == $E, shift == $CSD))':
            return 'false';
        case 'ShiftAssignment(employee == $E, shift == $CSD)':
            return 'true';
        case 'not(ShiftAssignment(employee == $E, shift == $CSD))':
            return 'false';
        default:
            return conditionValue;
    }
}

export function getTrueConditionValue(ruleType: string, conditionName: string) {
    switch (ruleType) {
        case 'employee':
            if (conditionName === 'isAssigned') {
                return 'ShiftAssignment(employee == $E, shift == $CSD)';
            }
            else if (conditionName === 'isEligible') {
                return 'true';
            }
            else return 'undefined';
        case 'enrollmentEmployee':
            if (conditionName === 'isEnrolled') {
                return 'ShiftEnrollment(employee == $E, shift == $CSD)';
            }
            else if (conditionName === 'isAssigned') {
                return 'ShiftAssignment(employee == $E, shift == $CSD)';
            }
            else if (conditionName === 'isEligible') {
                return 'true';
            }
            else return 'undefined';
        case 'enrollmentShift':
            if (conditionName === 'isEnrolled') {
                return 'ShiftEnrollment(shift == $SD)';
            }
            else if (conditionName === 'isAssignable') {
                return 'true';
            }
            else return 'undefined';
        case 'shift':
            if (conditionName === 'isAssignable') {
                return 'true';
            }
            else return 'undefined';
        default:
            return 'undefined';
    }
}

export function getFalseConditionValue(ruleType: string, conditionName: string) {
    switch (ruleType) {
        case 'employee':
            if (conditionName === 'isAssigned') {
                return 'not(ShiftAssignment(employee == $E, shift == $CSD))';
            }
            else if (conditionName === 'isEligible') {
                return 'false';
            }
            else return 'undefined';
        case 'enrollmentEmployee':
            if (conditionName === 'isEnrolled') {
                return 'not(ShiftEnrollment(employee == $E, shift == $CSD))';
            }
            else if (conditionName === 'isAssigned') {
                return 'not(ShiftAssignment(employee == $E, shift == $CSD))';
            }
            else if (conditionName === 'isEligible') {
                return 'false';
            }
            else return 'undefined';
        case 'enrollmentShift':
            if (conditionName === 'isEnrolled') {
                return 'not(ShiftEnrollment(shift == $SD))';
            }
            else if (conditionName === 'isAssignable') {
                return 'false';
            }
            else return 'undefined';
        case 'shift':
            if (conditionName === 'isAssignable') {
                return 'false';
            }
            else return 'undefined';
        default:
            return 'undefined';
    }
}