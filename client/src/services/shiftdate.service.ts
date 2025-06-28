import { ServiceResponse } from '@/lib/serviceResponse';
import { formatDateString } from '@/lib/utils';
import { AssignmentRule, RuleAction, RuleCondition } from '@/components/shiftAssignment/AssignmentRuleList';

export const getShiftDate = async (dayfrom: Date, dayto: Date, employee_type: string) => {
    try {
        const queryParams = new URLSearchParams({
            dayfrom: formatDateString(dayfrom),
            dayto: formatDateString(dayto),
            employee_type: employee_type,
        });

        const response = await fetch(`/api/shiftdate/get-shiftdate?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể tải danh sách ngày làm việc');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách ngày làm việc');
    }
};

export const getShiftDateEmployee = async (employeeid: number, dayfrom: Date, dayto: Date) => {
    try {
        const queryParams = new URLSearchParams({
            employeeid: employeeid.toString(),
            dayfrom: formatDateString(dayfrom),
            dayto: formatDateString(dayto),
        });

        const response = await fetch(`/api/shiftdate/get-shiftdate-employee?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể tải danh sách nhân viên');
        }
        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách nhân viên');
    }
};

export const searchEmployees = async (shiftdate: Date, shiftid: number, q: string, page: number, pageSize: number) => {
    try {
        const queryParams = new URLSearchParams({
            shiftdate: new Date(shiftdate).toISOString(),
            shiftid: shiftid.toString(),
            q: q,
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        const response = await fetch(`/api/shiftdate/search-employees?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể tìm kiếm nhân viên');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tìm kiếm nhân viên');
    }
};

export const addAssignment = async (assignmentData: { shiftdate: string; shiftid: number; employeeid: number }) => {
    try {
        const response = await fetch(`/api/shiftdate/post-assignment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(assignmentData),
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thêm phân công');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thêm phân công');
    }
};

export const deleteAssignment = async (assignmentData: { shiftdate: string; shiftid: number; employeeid: number }) => {
    try {
        const response = await fetch(`/api/shiftdate/delete-assignment`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(assignmentData),
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể xóa phân công');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể xóa phân công');
    }
};

export const updateShiftAssignment = async (assignmentData: {
    shiftdate: string;
    shiftid: number;
    employeeid: number;
    assignmentstatus: 'approved' | 'refused';
}) => {
    try {
        const response = await fetch(`/api/shiftdate/update-assignment`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(assignmentData),
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể cập nhật phân công');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể cập nhật phân công');
    }
};

export const getPartTimeShiftEnrollment = async (dayfrom: Date, dayto: Date, filter: string, employeeid: number) => {
    try {
        const queryParams = new URLSearchParams({
            dayfrom: formatDateString(dayfrom),
            dayto: formatDateString(dayto),
            filter: filter,
            employeeid: employeeid.toString(),
        });

        const response = await fetch(`/api/shiftdate/get-enrollment?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể tải danh sách đăng ký ca làm');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách đăng ký ca làm');
    }
};

export const createShiftEnrollment = async (employeeid: number, shiftid: number, shiftdate: string) => {
    try {
        const response = await fetch('/api/shiftdate/post-enrollment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                employeeid,
                shiftid,
                shiftdate,
            }),
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể đăng ký ca làm việc');
        }

        return ServiceResponse.success(result);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể đăng ký ca làm việc');
    }
};

export const deleteShiftEnrollment = async (employeeid: number, shiftid: number, shiftdate: string) => {
    try {
        const response = await fetch('/api/shiftdate/delete-enrollment', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                employeeid,
                shiftid,
                shiftdate,
            }),
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể hủy đăng ký ca làm việc');
        }

        return ServiceResponse.success(result);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể hủy đăng ký ca làm việc');
    }
};

export const autoAssignShift = async (fullTimeOption: string, partTimeOption: string) => {
    try {
        const response = await fetch('/api/shiftdate/post-auto-assignment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ fullTimeOption, partTimeOption }),
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện phân công tự động');
        }

        return ServiceResponse.success(result);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện phân công tự động');
    }
};

export const getAutoAssignment = async () => {
    try {
        const response = await fetch('/api/shiftdate/get-auto-assignment', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();
        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Không thể tải danh sách tự động phân công',
        );
    }
};

interface RuleData {
    type: string;
    cols: string[];
}

export const updateAutoAssignment = async (ruleList: AssignmentRule[]) => {
    try {
        const ruleData: RuleData[] = ruleList.map((rule) => ({
            type: rule.ruleType,
            cols: [
                rule.ruleDescription,
                rule.ruleName,
                ...rule.conditions.map((condition) => condition.conditionValue),
                ...rule.actions.map((action) => action.actionValue),
            ],
        }));

        const response = await fetch('/api/shiftdate/put-auto-assignment', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ data: ruleData }),
        });
        const result = await response.json();
        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể cập nhật quy tắc phân công');
        }
        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể cập nhật quy tắc phân công');
    }
};
