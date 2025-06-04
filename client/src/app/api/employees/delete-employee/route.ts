import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { employeeIds } = await request.json();
        const response = await fetch(`${process.env.SERVER}/api/v1/orders/remove-rental-products/${employeeIds}`, {
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include',
            },
            method: 'DELETE',
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
