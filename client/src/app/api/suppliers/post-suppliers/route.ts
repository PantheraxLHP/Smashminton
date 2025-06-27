import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;

        const body = await req.json();
        const {
            suppliername,
            contactname,
            phonenumber,
            email,
            address,
            supplies,
        }: {
            suppliername: string;
            contactname: string;
            phonenumber: string;
            email: string;
            address: string;
            supplies: { productid: number; costprice: number }[];
        } = body;

        if (!suppliername || !contactname || !phonenumber || !email || !address || !Array.isArray(supplies)) {
            return ApiResponse.error('Dữ liệu không hợp lệ');
        }

        const url = `${process.env.SERVER}/api/v1/suppliers/new-supplier?`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
            credentials: 'include',
            body: JSON.stringify({ suppliername, contactname, phonenumber, email, address, supplies }),
        });

        const result = await response.json();

        if (!response.ok) {
            return ApiResponse.error(result.message || `HTTP error! Status: ${response.status}`);
        }

        return ApiResponse.success(result);
    } catch (error) {
        return ApiResponse.error(error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');
    }
}
