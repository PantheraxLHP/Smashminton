import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const employeeId = request.nextUrl.searchParams.get('employeeId');
        const body = await request.json();

        console.log('sdfsad', employeeId, JSON.stringify(body));
        const response = await fetch(`${process.env.SERVER}/api/v1/bank-detail/${employeeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
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
