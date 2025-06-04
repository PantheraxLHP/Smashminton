import { ServiceResponse } from '@/lib/serviceResponse';

export const getEmployees = async (page: number, pageSize: number) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

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

export const putEmployee = async (
    employeeId: number,
    employeeData: {
        fullname?: string;
        email?: string;
        phone?: string;
        address?: string;
        position?: string;
        salary?: number;
        avatar?: File;
    },
) => {
    try {
        const formData = new FormData();
        formData.append('employeeId', employeeId.toString());
        formData.append('fullname', employeeData.fullname || '');
        formData.append('email', employeeData.email || '');
        formData.append('phone', employeeData.phone || '');
        formData.append('address', employeeData.address || '');
        formData.append('position', employeeData.position || '');
        formData.append('salary', employeeData.salary?.toString() || '');
        formData.append('avatar', employeeData.avatar || new Blob());
        const response = await fetch('/api/employees/put-employee', {
            method: 'PUT',
            headers: { 'Content-Type': 'multipart/form-data' },
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
