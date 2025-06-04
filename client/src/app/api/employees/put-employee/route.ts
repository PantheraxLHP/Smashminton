import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const formData = new FormData();
        const { employeeId, ...body } = await request.json();
        formData.append('employeeId', employeeId.toString());
        formData.append('fullname', body.fullname);
        formData.append('email', body.email);
        formData.append('phone', body.phone);
        formData.append('address', body.address);
        formData.append('position', body.position);
        formData.append('salary', body.salary.toString());
        if (body.avatar) {  
            formData.append('avatar', body.avatar);
        }
        const response = await fetch(`${process.env.SERVER}/api/v1/employees/${employeeId}`, {
            headers: {
                'Content-Type': 'multipart/form-data',
                credentials: 'include',
            },
            method: 'PUT',
            body: formData,
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
