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
  
export const getAllPurchaseOrder = async (page: number, pageSize: number) => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        const response = await fetch(`/api/purchase-order/get-all-purchase-order?${queryParams}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        const result = await response.json();

        const purchaseorder = result.data?.data;
        const pagination = result.data?.pagination;

        if (!response.ok || !Array.isArray(purchaseorder)) {
            return ServiceResponse.error(result.message || 'Dữ liệu trả về không hợp lệ');
        }

        return ServiceResponse.success({
            data: purchaseorder,
            pagination,
        });
    } catch (error) {
        return ServiceResponse.error(
            error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu'
        );
    }
};

export const updatePurchaseOrder = async (id: number, payload: { realityQuantity: number; realityExpiryDate: string }) => {
    try {
        const response = await fetch(`/api/purchase-order/patch-purchase-order?id=${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });        

        const result = await response.json();

        if (!response.ok) {
            return {
                ok: false,
                message: result.message || 'Không thể xác nhận đơn hàng',
            };
        }

        return {
            ok: true,
            message: result.message,
        };
    } catch (error) {
        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        };
    }
};
