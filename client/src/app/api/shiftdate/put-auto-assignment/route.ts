import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        console.log(body);
        const response = await fetch(`${process.env.SERVER}/api/v1/auto-assignment`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: body }),
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
