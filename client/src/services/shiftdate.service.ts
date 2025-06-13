import { ServiceResponse } from '@/lib/serviceResponse';
import { formatDateString } from '@/lib/utils';

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

export const searchEmployees = async (shiftdate: Date, shiftid: number, page: number, pageSize: number) => {
    try {
        const queryParams = new URLSearchParams({
            shiftdate: formatDateString(shiftdate),
            shiftid: shiftid.toString(),
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
