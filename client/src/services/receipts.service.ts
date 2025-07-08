import { ServiceResponse } from '@/lib/serviceResponse';

export const getReceiptDetail = async (customerid: number, employeeid: number) => {
    try {
        const queryParams = new URLSearchParams({
            customerid: customerid.toString(),
            employeeid: employeeid.toString(),
        });

        const response = await fetch(`/api/payment/get-receipt?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
            return ServiceResponse.error(result.message || 'Không thể tải danh sách đơn hàng');
        }

        return ServiceResponse.success(result.data);
    } catch (error) {
        return ServiceResponse.error(error instanceof Error ? error.message : 'Không thể tải danh sách đơn hàng');
    }
};
