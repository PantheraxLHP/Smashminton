import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const url = new URL(request.url);
        const productid = url.searchParams.get('productid');

        if (!productid) {
            return ApiResponse.error('Thiếu productid trong query string');
        }

        const response = await fetch(`${process.env.SERVER}/api/v1/products/delete-product/${productid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
        });

        if (!response.ok) {
            let errorMessage = ``;
            const statusCode = response.status;

            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMessage += errorData.message;
                }
            } catch (e) {
                const fallbackMessage = await response.text();
                errorMessage += fallbackMessage;
            }

            return NextResponse.json(
                { message: errorMessage },
                { status: statusCode }
            );
        }

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json(result, { status: response.status });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('/api/v1/products/delete-product/ error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Lỗi không xác định' },
            { status: 500 }
        );
    }
}