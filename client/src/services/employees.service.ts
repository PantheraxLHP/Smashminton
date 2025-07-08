import { ServiceResponse } from '@/lib/serviceResponse';
import { serializeFilterValue } from '@/lib/utils';

export const searchEmployees = async (query: string) => {
    try {
        const queryParams = new URLSearchParams({
            q: query.trim() || '',
        });

        const response = await fetch(`/api/employees/search-employees?${queryParams}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể tìm kiếm nhân viên');
        }

        return ServiceResponse.success(result.data || []);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tìm kiếm nhân viên');
    }
};

export const getEmployees = async (page: number, pageSize: number, filterValue: Record<string, any> = {}) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });
        serializeFilterValue(queryParams, filterValue);

        const response = await fetch(`/api/employees/get-employees?${queryParams}`, {
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

export const postEmployee = async (employeeData: {
    fullname?: string;
    email?: string;
    phone?: string;
    address?: string;
    position?: string;
    salary?: number;
}) => {
    try {
        const response = await fetch('/api/employees/post-employee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData),
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
};

export const putEmployee = async (employeeId: number, employeeData: Record<string, any>) => {
    try {
        const formData = new FormData();
        formData.append('employeeId', employeeId.toString());

        Object.entries(employeeData).forEach(([key, value]) => {
            if (key === 'avatar' || value === undefined) return;
            formData.append(key, value.toString());
        });
        // Handle avatar separately
        if (employeeData.avatar) {
            formData.append('avatar', employeeData.avatar);
        }

        const response = await fetch('/api/employees/put-employee', {
            method: 'PUT',
            body: formData,
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
};

export const deleteEmployees = async (employeeIds: number[]) => {
    try {
        const response = await fetch('/api/employees/delete-employee', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeIds),
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
};

export const postBankDetail = async (bankDetailData: {
    employeeid?: number;
    banknumber?: string;
    bankholder?: string;
    bankname?: string;
    active?: boolean;
}) => {
    try {
        const response = await fetch('/api/employees/post-employee-bankdetail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bankDetailData),
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
};

export const putBankActive = async (employeeId: number, bankDetailData: { bankdetailid: number; active: boolean }) => {
    try {
        const response = await fetch(`/api/employees/put-bank-active?employeeId=${employeeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bankDetailData),
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể thực hiện yêu cầu');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
};
