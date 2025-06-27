import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const formData = await request.formData();
        const employeeId = formData.get('employeeId');

        const backendFormData = new FormData();

        for (const [key, value] of formData.entries()) {
            if (key === 'avatar') continue;
            backendFormData.append(key, value.toString());
        }
        // Handle avatar separately
        const avatar = formData.get('avatar') as File;
        if (avatar && avatar.size > 0) {
            backendFormData.append('avatarurl', avatar);
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/employees/${employeeId}`, {
            method: 'PUT',
            body: backendFormData,
            headers: {
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
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
