import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const employeeId = formData.get('employeeId');

        // Create new FormData for the backend request
        const backendFormData = new FormData();
        backendFormData.append('employeeId', employeeId?.toString() || '');
        backendFormData.append('fullname', formData.get('fullname')?.toString() || '');
        backendFormData.append('gender', formData.get('gender')?.toString() || '');
        backendFormData.append('dob', formData.get('dob')?.toString() || '');
        backendFormData.append('email', formData.get('email')?.toString() || '');
        backendFormData.append('phonenumber', formData.get('phone')?.toString() || '');
        backendFormData.append('address', formData.get('address')?.toString() || '');
        backendFormData.append('position', formData.get('position')?.toString() || '');
        backendFormData.append('role', formData.get('role')?.toString() || '');
        backendFormData.append('cccd', formData.get('cccd')?.toString() || '');
        backendFormData.append('expiry_cccd', formData.get('expiry_cccd')?.toString() || '');
        backendFormData.append('taxcode', formData.get('taxcode')?.toString() || '');
        backendFormData.append('salary', formData.get('salary')?.toString() || '');

        const avatar = formData.get('avatar') as File;
        if (avatar && avatar.size > 0) {
            backendFormData.append('avatarurl', avatar);
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/employees/${employeeId}`, {
            method: 'PUT',
            body: backendFormData,
            credentials: 'include',
        });

        if (!response.ok) {
            return ApiResponse.error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
}
