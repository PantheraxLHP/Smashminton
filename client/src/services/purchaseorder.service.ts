import { ServiceResponse } from '@/lib/serviceResponse';

export const createPurchaseOrder = async (orderData: {
    productid: number;
    productname: string;
    employeeid: number;
    supplierid: number;
    quantity: number;
}) => {
    try {
        const response = await fetch('/api/purchase-order/create-purchase-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('[ERROR] createPurchaseOrder failed:', result);
            return ServiceResponse.error(result.message || 'Tạo đơn hàng thất bại');
        }

        return ServiceResponse.success(result);
    } catch (error) {
        console.error('[ERROR] createPurchaseOrder exception:', error);
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Tạo đơn hàng thất bại'
        );
    }
  };