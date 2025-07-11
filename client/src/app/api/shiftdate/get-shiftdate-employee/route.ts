import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const searchParams = request.nextUrl.searchParams;
        const employeeid = searchParams.get('employeeid');
        const dayfrom = searchParams.get('dayfrom');
        const dayto = searchParams.get('dayto');
        const response = await fetch(
            `${process.env.SERVER}/api/v1/shift-date/shift-assignment/${employeeid}?dayfrom=${dayfrom}&dayto=${dayto}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                },
                credentials: 'include',
            },
        );

        if (!response.ok) {
            return ApiResponse.error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách sân');
    }
}
