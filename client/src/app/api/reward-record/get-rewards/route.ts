import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const params = new URLSearchParams(searchParams).toString();
        const response = await fetch(`${process.env.SERVER}/api/v1/reward-records/employees?${params}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return ApiResponse.error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách sân');
    }
}
