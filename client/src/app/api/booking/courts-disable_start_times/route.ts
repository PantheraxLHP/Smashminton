import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const zoneid = searchParams.get('zoneid');
        const date = searchParams.get('date');
        const starttime = searchParams.get('starttime');
        const duration = searchParams.get('duration');
        const fixedCourt = searchParams.get('fixedCourt');

        // Construct backend API URL with query parameters
        const queryString = new URLSearchParams({
            zoneid: zoneid || '',
            date: date || '',
            starttime: starttime || '',
            duration: duration || '',
            fixedCourt: fixedCourt || '',
        }).toString();

        const response = await fetch(
            `${process.env.SERVER}/api/v1/bookings/available-courts-and-unavailable-start-time?${queryString}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.ok) {
            return ApiResponse.error(`HTTP error! Status: ${response.status}`);
        }
        // Return Courts list for booking page
        const result = await response.json();
        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách sân');
    }
}
