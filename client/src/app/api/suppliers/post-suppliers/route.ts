import { ApiResponse } from '@/lib/apiResponse';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            suppliername,
            contactname,
            phonenumber,
            email,
            address,
            products,
        }: {
            suppliername: string;
            contactname: string;
            phonenumber: string;
            email: string;
            address: string;
            products: { productid: number; costprice: number }[];
        } = body;

        if (!suppliername || !contactname || !phonenumber || !email || !address || !Array.isArray(products)) {
            return ApiResponse.error('Dữ liệu không hợp lệ');
        }

        // Tạo query string từ products
        const queryParams = products
            .map(p => `productid=${encodeURIComponent(String(p.productid))}&costprice=${encodeURIComponent(String(p.costprice))}`)
            .join('&');

        const url = `${process.env.SERVER}/api/v1/suppliers/new-supplier?${queryParams}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ suppliername, contactname, phonenumber, email, address }),
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
